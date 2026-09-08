import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

export const root = new URL("../", import.meta.url);
export const escapeXml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );

export function validateContent(profile, posts) {
  const profileSchema = {
    name: "string",
    shortName: "string",
    role: "string",
    location: "string",
    email: "string",
    url: "string",
    summary: "string",
    github: "string",
    linkedin: "string",
    expertise: [
      {
        id: "string",
        title: "string",
        description: "string",
        skills: ["string"],
      },
    ],
    projects: [
      {
        slug: "string",
        title: "string",
        company: "string",
        category: "string",
        summary: "string",
        challenge: "string",
        approach: ["string"],
        outcome: "string",
        stack: ["string"],
        flow: ["string"],
      },
    ],
    experience: [
      {
        company: "string",
        role: "string",
        period: "string",
        description: "string",
      },
    ],
    faqs: [{ question: "string", answer: "string" }],
  };
  const postSchema = {
    slug: "string",
    title: "string",
    description: "string",
    date: "string",
    category: "string",
    readingMinutes: "positiveInteger",
    sections: [
      { heading: "string", paragraphs: ["string"], "bullets?": ["string"] },
    ],
  };
  function validate(value, schema, path, optional = false) {
    if (schema === "string") {
      assert.ok(
        typeof value === "string" && value.trim().length > 0,
        `${path}: expected a non-empty string`,
      );
    } else if (schema === "positiveInteger") {
      assert.ok(
        Number.isInteger(value) && value > 0,
        `${path}: expected a positive integer`,
      );
    } else if (Array.isArray(schema)) {
      assert.ok(Array.isArray(value), `${path}: expected an array`);
      assert.ok(
        optional || value.length > 0,
        `${path}: expected at least one item`,
      );
      value.forEach((item, index) =>
        validate(item, schema[0], `${path}[${index}]`),
      );
    } else {
      assert.ok(
        value !== null && typeof value === "object" && !Array.isArray(value),
        `${path}: expected an object`,
      );
      const allowed = Object.keys(schema).map((key) => key.replace(/\?$/, ""));
      for (const key of Object.keys(value))
        assert.ok(
          allowed.includes(key),
          `${path}.${key}: unknown field; check the content schema`,
        );
      for (const [key, fieldSchema] of Object.entries(schema)) {
        const isOptional = key.endsWith("?");
        const field = key.replace(/\?$/, "");
        if (isOptional && value[field] === undefined) continue;
        validate(value[field], fieldSchema, `${path}.${field}`, isOptional);
      }
    }
  }
  validate(profile, profileSchema, "src/content/profile.json");
  assert.ok(
    Array.isArray(posts),
    "src/content/posts: expected an array of posts",
  );
  posts.forEach((post, index) =>
    validate(post, postSchema, `src/content/posts[${index}]`),
  );
  for (const field of ["url", "github", "linkedin"]) {
    let url;
    try {
      url = new URL(profile[field]);
    } catch {
      assert.fail(
        `src/content/profile.json.${field}: expected an absolute HTTPS URL`,
      );
    }
    assert.ok(
      url.protocol === "https:" && !url.username && !url.password,
      `src/content/profile.json.${field}: expected an HTTPS URL without credentials`,
    );
    if (field === "url")
      assert.ok(
        url.pathname === "/" && !url.search && !url.hash,
        "src/content/profile.json.url: expected an origin without a path, query, or fragment",
      );
  }
  assert.match(
    profile.email,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "src/content/profile.json.email: expected an email address",
  );
  assert.match(
    profile.location,
    /^[^,]+,\s*[^,]+$/,
    'src/content/profile.json.location: expected "City, Country"',
  );
  assert.ok(
    profile.location.split(",").every((part) => part.trim()),
    "src/content/profile.json.location: city and country must be non-empty",
  );
  assert.deepEqual(
    profile.expertise.map((item) => item.id),
    ["ai", "payments", "saas", "cloud"],
    "src/content/profile.json.expertise: keep IDs in the order ai, payments, saas, cloud used by App",
  );
  for (const [items, path] of [
    [profile.projects, "src/content/profile.json.projects"],
    [posts, "src/content/posts"],
  ]) {
    const slugs = new Set();
    items.forEach((item, index) => {
      assert.match(
        item.slug,
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        `${path}[${index}].slug: use lowercase hyphen-separated URL segments`,
      );
      assert.ok(
        !slugs.has(item.slug),
        `${path}[${index}].slug: duplicate slug "${item.slug}"`,
      );
      slugs.add(item.slug);
    });
  }
  for (const post of posts) {
    const path = `src/content/posts/${post.slug}.json.date`;
    assert.match(
      post.date,
      /^\d{4}-\d{2}-\d{2}$/,
      `${path}: expected YYYY-MM-DD`,
    );
    const date = new Date(`${post.date}T00:00:00Z`);
    assert.ok(
      Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 10) === post.date,
      `${path}: expected a real calendar date`,
    );
  }
}

export async function loadContent() {
  async function readJson(url) {
    try {
      return JSON.parse(await readFile(url, "utf8"));
    } catch (error) {
      throw new Error(`${url.pathname}: ${error.message}`, { cause: error });
    }
  }
  const profile = await readJson(new URL("src/content/profile.json", root));
  const directory = new URL("src/content/posts/", root);
  const files = (await readdir(directory))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const posts = await Promise.all(
    files.map((file) => readJson(new URL(file, directory))),
  );
  validateContent(profile, posts);
  posts.forEach((post, index) =>
    assert.equal(
      files[index],
      `${post.slug}.json`,
      `src/content/posts/${files[index]}: filename must match slug "${post.slug}"`,
    ),
  );
  const origin = new URL(profile.url).origin;
  posts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
  const pages = [
    {
      path: "/",
      label: "Home",
      title: `${profile.name} | ${profile.role}`,
      description: `${profile.name}, senior software engineer in ${profile.location}. AI automation, payment integrations, full-stack SaaS, and cloud delivery.`,
    },
    {
      path: "/about/",
      label: "About",
      description: `About ${profile.name}: roughly ten years of software engineering experience, connecting product interfaces, business operations, and infrastructure.`,
    },
    {
      path: "/work/",
      label: "Selected Work",
      description: `Selected engineering work by ${profile.name}: AI intake automation, prospect workflows, payment integrations, a multi-tenant marketplace, and award voting.`,
    },
    ...profile.projects.map((project) => ({
      path: `/work/${project.slug}/`,
      label: project.title,
      description: project.summary,
      project,
    })),
    {
      path: "/expertise/",
      label: "Engineering Expertise",
      description: `${profile.name}'s engineering focus: AI automation and durable workflows, payments and business integrations, full-stack SaaS, and cloud service operations.`,
    },
    {
      path: "/writing/",
      label: "Engineering Notes",
      description: `Engineering notes by ${profile.name} on durable AI workflows, payment callbacks, and multi-tenant boundaries. Practical guidance for reliable software.`,
    },
    ...posts.map((post) => ({
      path: `/writing/${post.slug}/`,
      label: post.title,
      description: post.description,
      post,
    })),
    {
      path: "/contact/",
      label: "Contact",
      description: `Contact ${profile.name} in ${profile.location} about AI automation, payments, SaaS, and cloud engineering. Share the problem and the support you need.`,
    },
    {
      path: "/resume/",
      label: "Resume",
      description: `${profile.name}'s professional overview: senior software engineering across AI automation, payments, full-stack platforms, and infrastructure. Selected experience and skills.`,
    },
    {
      path: "/404.html",
      label: "Page Not Found",
      description: `This page could not be found. Explore ${profile.name}'s work, engineering notes, or contact page.`,
      notFound: true,
    },
  ].map((page) => ({
    ...page,
    title: page.title || `${page.label} | ${profile.name}`,
    url: new URL(page.path, origin).href,
  }));
  return { profile, posts, pages, origin };
}

export function pageHead(page, { profile, origin }) {
  const [locality, country] = profile.location
    .split(",")
    .map((part) => part.trim());
  const person = {
    "@type": "Person",
    "@id": `${origin}/#person`,
    name: profile.name,
    url: `${origin}/`,
    jobTitle: profile.role,
    description: profile.summary,
    sameAs: [profile.github, profile.linkedin],
    email: profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: country === "Ethiopia" ? "ET" : country,
    },
    knowsAbout: [
      ...new Set(
        profile.expertise.flatMap((item) => [item.title, ...item.skills]),
      ),
    ],
  };
  const website = {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: `${origin}/`,
    name: profile.name,
    publisher: { "@id": person["@id"] },
  };
  const entity = {
    "@type": page.post
      ? "Article"
      : ["/", "/about/", "/resume/"].includes(page.path)
        ? "ProfilePage"
        : "WebPage",
    "@id": `${page.url}#${page.post ? "article" : "webpage"}`,
    url: page.url,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": website["@id"] },
    ...(page.post
      ? {
          headline: page.post.title,
          datePublished: page.post.date,
          author: { "@id": person["@id"] },
          mainEntityOfPage: page.url,
          image: `${origin}/social-card.png`,
        }
      : { mainEntity: { "@id": person["@id"] } }),
  };
  const graph = [person, website, entity];
  if (page.path !== "/" && !page.notFound) {
    const crumbs = [{ name: "Home", item: `${origin}/` }];
    if (page.project)
      crumbs.push({ name: "Selected Work", item: `${origin}/work/` });
    if (page.post)
      crumbs.push({ name: "Engineering Notes", item: `${origin}/writing/` });
    crumbs.push({ name: page.label, item: page.url });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...crumb,
      })),
    });
  }
  const meta = (name, content, property = false) =>
    `<meta ${property ? "property" : "name"}="${name}" content="${escapeXml(content)}" />`;
  return [
    `<title>${escapeXml(page.title)}</title>`,
    meta("description", page.description),
    meta("author", profile.name),
    meta(
      "robots",
      page.notFound
        ? "noindex, follow"
        : "index, follow, max-image-preview:large",
    ),
    `<link rel="canonical" href="${escapeXml(page.url)}" />`,
    ...Object.entries({
      type: page.post ? "article" : "website",
      title: page.title,
      description: page.description,
      url: page.url,
      site_name: profile.name,
      locale: "en_US",
      image: `${origin}/social-card.png`,
      "image:alt": `${profile.name} - Senior Software Engineer`,
      "image:width": "1200",
      "image:height": "630",
      "image:type": "image/png",
    }).map(([key, value]) => meta(`og:${key}`, value, true)),
    ...Object.entries({
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      image: `${origin}/social-card.png`,
      "image:alt": `${profile.name} - Senior Software Engineer`,
    }).map(([key, value]) => meta(`twitter:${key}`, value)),
    ...(page.post
      ? [
          meta(
            "article:published_time",
            `${page.post.date}T00:00:00.000Z`,
            true,
          ),
          meta("article:author", `${origin}/`, true),
        ]
      : []),
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
