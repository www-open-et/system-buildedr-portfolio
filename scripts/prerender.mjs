import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { escapeXml as xml, loadContent, pageHead, root } from "./content.mjs";

const content = await loadContent();
const { profile, posts, pages, origin } = content;
const dist = new URL("dist/", root);
const template = await readFile(new URL("index.html", dist), "utf8");
const manifest = JSON.parse(
  await readFile(new URL(".vite/manifest.json", dist), "utf8"),
);
for (const marker of ["<!--app-html-->", "<!--page-head-->"]) {
  assert.equal(
    template.split(marker).length,
    2,
    `Expected exactly one ${marker} in Vite output`,
  );
}
// Vite's serve transform emits jsxDEV, which requires React's development runtime.
// Set this before loading Vite/React, even when the caller exports NODE_ENV=production.
// Config mode stays production to avoid development-only plugins; the client is already built.
process.env.NODE_ENV = "development";
const { createServer } = await import("vite");
const server = await createServer({
  root: fileURLToPath(root),
  mode: "production",
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, watch: null },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  for (const page of pages) {
    // ssrLoadModule uses source asset URLs; match the URLs in the production client bundle.
    const html = (await render(page.path)).replace(
      /\b(src|href)="\/([^"?#]+)"/g,
      (match, attribute, source) =>
        manifest[source]?.file
          ? `${attribute}="/${manifest[source].file}"`
          : match,
    );
    assert.ok(
      html.includes("<main"),
      `No main content rendered for ${page.path}`,
    );
    const output = new URL(
      page.notFound ? "404.html" : `${page.path.slice(1)}index.html`,
      dist,
    );
    await mkdir(new URL(".", output), { recursive: true });
    // Replacement functions preserve literal "$&" and similar sequences in editorial content.
    await writeFile(
      output,
      template
        .replace("<!--page-head-->", () => pageHead(page, content))
        .replace("<!--app-html-->", () => html),
    );
  }
} finally {
  await server.close();
}

const publicPages = pages.filter((page) => !page.notFound);
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPages.map((page) => `  <url><loc>${xml(page.url)}</loc>${page.post ? `<lastmod>${page.post.date}</lastmod>` : ""}</url>`).join("\n")}
</urlset>\n`,
);
await writeFile(
  new URL("robots.txt", dist),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  new URL("feed.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${xml(profile.name)} - Engineering Notes</title>
<link>${origin}/writing/</link><description>Engineering notes on reliable workflows, payment integrations, and software boundaries.</description>
<language>en</language><atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item><title>${xml(post.title)}</title><link>${origin}/writing/${post.slug}/</link><guid isPermaLink="true">${origin}/writing/${post.slug}/</guid><pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate><description>${xml(post.description)}</description></item>`).join("\n")}
</channel></rss>\n`,
);

// Deliberate allowlist: future editorial fields are not automatically exported.
const publicProfile = {
  name: profile.name,
  shortName: profile.shortName,
  role: profile.role,
  location: profile.location,
  url: `${origin}/`,
  email: profile.email,
  summary: profile.summary,
  sameAs: [profile.github, profile.linkedin],
  expertise: profile.expertise.map(({ title, description, skills }) => ({
    title,
    description,
    skills,
  })),
  projects: profile.projects.map(({ title, summary, slug, stack }) => ({
    title,
    summary,
    stack,
    url: `${origin}/work/${slug}/`,
  })),
  writing: posts.map(({ title, description, date, slug }) => ({
    title,
    description,
    date,
    url: `${origin}/writing/${slug}/`,
  })),
};
await writeFile(
  new URL("profile.json", dist),
  `${JSON.stringify(publicProfile, null, 2)}\n`,
);
const intro = `# ${profile.name}\n\n> ${profile.role}\n\n${profile.summary}\n\nThese files follow an experimental llms.txt convention. They do not guarantee discovery, indexing, or use by any AI service. The engineering notes cover design guidance, not confidential project postmortems.\n`;
const links = `\n## Pages\n\n${publicPages.map((page) => `- [${page.label}](${page.url}): ${page.description}`).join("\n")}\n\n## Structured Resources\n\n- [Public profile](${origin}/profile.json)\n- [RSS feed](${origin}/feed.xml)\n- [Sitemap](${origin}/sitemap.xml)\n- [Full text](${origin}/llms-full.txt)\n`;
await writeFile(new URL("llms.txt", dist), intro + links);
const fullText = [
  intro,
  links,
  "## Expertise",
  ...profile.expertise.map(
    (item) =>
      `### ${item.title}\n\n${item.description}\n\nSkills: ${item.skills.join(", ")}`,
  ),
  "## Selected Work",
  ...profile.projects.map(
    (item) =>
      `### ${item.title}\n\n${origin}/work/${item.slug}/\n\n${item.summary}\n\n${item.challenge}\n\n${item.approach.map((step) => `- ${step}`).join("\n")}\n\n${item.outcome}\n\nStack: ${item.stack.join(", ")}\n\nFlow: ${item.flow.join(" -> ")}`,
  ),
  "## Selected Experience",
  ...profile.experience.map(
    (item) =>
      `### ${item.company}\n\n${item.role} | ${item.period}\n\n${item.description}`,
  ),
  "## Frequently Asked Questions",
  ...profile.faqs.map((item) => `### ${item.question}\n\n${item.answer}`),
  "## Engineering Notes",
  ...posts.map(
    (post) =>
      `### ${post.title}\n\n${origin}/writing/${post.slug}/\n\n${post.date} | ${post.category}\n\n${post.description}\n\n${post.sections.map((section) => `#### ${section.heading}\n\n${section.paragraphs.join("\n\n")}${section.bullets?.length ? `\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}` : ""}`).join("\n\n")}`,
  ),
  `## Contact\n\n${profile.location}\n\n${profile.email}\n\n${profile.github}\n${profile.linkedin}`,
].join("\n\n");
await writeFile(new URL("llms-full.txt", dist), `${fullText}\n`);
console.log(
  `Prerendered ${publicPages.length} public routes and 404.html; generated sitemap, robots, RSS, public profile, and llms text.`,
);
