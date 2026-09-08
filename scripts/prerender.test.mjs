import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  escapeXml,
  loadContent,
  pageHead,
  root,
  validateContent,
} from "./content.mjs";

const content = await loadContent();
const { pages, posts, profile, origin } = content;
const dist = new URL("dist/", root);
const read = (path) => readFile(new URL(path, dist), "utf8");
const outputPath = (page) =>
  page.notFound ? "404.html" : `${page.path.slice(1)}index.html`;
const decode = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity) => {
    if (entity.startsWith("#"))
      return String.fromCodePoint(
        entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : Number(entity.slice(1)),
      );
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[entity];
  });
const plainText = (html) =>
  decode(html.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

test("content schema rejects invalid edits with actionable field paths", () => {
  assert.doesNotThrow(() => validateContent(profile, posts));
  const cases = [
    [
      ({ profile: p }) => {
        p.name = "";
      },
      /profile\.json\.name: expected a non-empty string/,
    ],
    [
      ({ profile: p }) => {
        delete p.summary;
      },
      /profile\.json\.summary/,
    ],
    [
      ({ profile: p }) => {
        p.email = "not an email";
      },
      /profile\.json\.email/,
    ],
    [
      ({ profile: p }) => {
        p.url = "http://example.com";
      },
      /profile\.json\.url/,
    ],
    [
      ({ profile: p }) => {
        p.url = "https://example.com/subpath/";
      },
      /profile\.json\.url/,
    ],
    [
      ({ profile: p }) => {
        p.github = "not a URL";
      },
      /profile\.json\.github/,
    ],
    [
      ({ profile: p }) => {
        p.linkedin = "https://user:secret@example.com";
      },
      /profile\.json\.linkedin/,
    ],
    [
      ({ profile: p }) => {
        p.location = "City only";
      },
      /profile\.json\.location/,
    ],
    [
      ({ profile: p }) => {
        p.expertise = {};
      },
      /profile\.json\.expertise: expected an array/,
    ],
    [
      ({ profile: p }) => {
        p.expertise[0].skills = [42];
      },
      /expertise\[0\]\.skills\[0\]/,
    ],
    [
      ({ profile: p }) => {
        p.expertise[0].id = "renamed";
      },
      /keep IDs in the order/,
    ],
    [
      ({ profile: p }) => {
        p.projects[0].approach = [];
      },
      /projects\[0\]\.approach: expected at least one item/,
    ],
    [
      ({ profile: p }) => {
        p.projects[0].slug = "../unsafe";
      },
      /projects\[0\]\.slug/,
    ],
    [
      ({ profile: p }) => {
        p.projects[1].slug = p.projects[0].slug;
      },
      /duplicate slug/,
    ],
    [
      ({ profile: p }) => {
        p.experience[0].period = 2026;
      },
      /experience\[0\]\.period/,
    ],
    [
      ({ profile: p }) => {
        p.faqs[0] = null;
      },
      /faqs\[0\]: expected an object/,
    ],
    [
      ({ profile: p }) => {
        p.privateClients = [];
      },
      /privateClients: unknown field/,
    ],
    [
      ({ posts: p }) => {
        p[0].readingMinutes = 1.5;
      },
      /readingMinutes: expected a positive integer/,
    ],
    [
      ({ posts: p }) => {
        p[0].readingMinutes = 0;
      },
      /readingMinutes: expected a positive integer/,
    ],
    [
      ({ posts: p }) => {
        p[0].date = "2026-02-30";
      },
      /date: expected a real calendar date/,
    ],
    [
      ({ posts: p }) => {
        p[0].date = "2026-13-01";
      },
      /date: expected a real calendar date/,
    ],
    [
      ({ posts: p }) => {
        p[0].date = "yesterday";
      },
      /date: expected YYYY-MM-DD/,
    ],
    [
      ({ posts: p }) => {
        p[0].sections[0].paragraphs = "not an array";
      },
      /sections\[0\]\.paragraphs: expected an array/,
    ],
    [
      ({ posts: p }) => {
        p[0].sections[0].bullets = null;
      },
      /sections\[0\]\.bullets: expected an array/,
    ],
    [
      ({ posts: p }) => {
        p[0].sections[0].heading = false;
      },
      /sections\[0\]\.heading/,
    ],
  ];
  for (const [mutate, error] of cases) {
    const copy = structuredClone({ profile, posts });
    mutate(copy);
    assert.throws(() => validateContent(copy.profile, copy.posts), error);
  }
  const copy = structuredClone(posts);
  copy[0].sections[0].bullets = [];
  assert.doesNotThrow(
    () => validateContent(profile, copy),
    "Optional bullets can be empty",
  );
});

test("metadata derives identity and location from content and escapes editorial text", () => {
  const changed = {
    ...profile,
    location: "Hawassa, Ethiopia",
    email: "public@open.et",
  };
  const page = {
    ...pages[0],
    title: "A & B </title><script>alert(1)</script>",
    description: 'A "quote" & <tag>',
  };
  const head = pageHead(page, { profile: changed, origin });
  const graph = JSON.parse(
    head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  )["@graph"];
  const person = graph.find((node) => node["@type"] === "Person");
  assert.equal(person.address.addressLocality, "Hawassa");
  assert.equal(person.address.addressCountry, "ET");
  assert.equal(person.email, changed.email);
  assert.ok(!head.includes("</title><script>"));
  assert.ok(head.includes("\\u003c"));
  assert.ok(head.includes(escapeXml(page.description)));
});

test("every route contains rendered content, unique metadata, and linked structured data", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    const html = await read(outputPath(page));
    assert.ok(
      !html.includes("<!--app-html-->") && !html.includes("<!--page-head-->"),
      page.path,
    );
    assert.match(html, /<div id="root"><[^>]+>/, page.path);
    assert.equal(
      (html.match(/<main(?:\s|>)/g) || []).length,
      1,
      `${page.path}: one main landmark`,
    );
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) || []).length,
      1,
      `${page.path}: one rendered heading`,
    );
    const body = plainText(html.split("<body>")[1]);
    assert.ok(
      body.includes(profile.name),
      `${page.path}: identity rendered in body`,
    );
    if (page.project)
      assert.ok(
        body.includes(page.project.title) &&
          body.includes(page.project.challenge),
        `${page.path}: full case study rendered`,
      );
    if (page.post) {
      assert.ok(
        body.includes(page.post.title),
        `${page.path}: article title rendered`,
      );
      for (const section of page.post.sections) {
        for (const paragraph of section.paragraphs)
          assert.ok(
            body.includes(paragraph.replace(/\s+/g, " ")),
            `${page.path}: article paragraph rendered`,
          );
      }
    }
    if (page.notFound)
      assert.match(body, /not found|doesn.t exist|couldn.t find|404/i);
    const titleMatches = [...html.matchAll(/<title>(.*?)<\/title>/g)];
    assert.equal(titleMatches.length, 1, `${page.path}: one title`);
    assert.equal(decode(titleMatches[0][1]), page.title);
    const descriptionsInHtml = [
      ...html.matchAll(/<meta name="description" content="([^"]*)"/g),
    ];
    assert.equal(descriptionsInHtml.length, 1);
    assert.equal(decode(descriptionsInHtml[0][1]), page.description);
    assert.ok(!titles.has(page.title), `Duplicate title: ${page.title}`);
    assert.ok(
      !descriptions.has(page.description),
      `Duplicate description: ${page.path}`,
    );
    titles.add(page.title);
    descriptions.add(page.description);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${page.url}"`));
    for (const [attribute, name, value] of [
      ["property", "og:title", page.title],
      ["property", "og:description", page.description],
      ["property", "og:url", page.url],
      ["name", "twitter:title", page.title],
      ["name", "twitter:description", page.description],
      ["name", "twitter:card", "summary_large_image"],
      ["property", "og:image", `${origin}/social-card.png`],
      ["property", "og:image:type", "image/png"],
      ["name", "twitter:image", `${origin}/social-card.png`],
    ])
      assert.ok(
        html.includes(`${attribute}="${name}" content="${escapeXml(value)}"`),
        `${page.path}: ${name}`,
      );
    assert.ok(
      html.includes(
        `name="robots" content="${page.notFound ? "noindex, follow" : "index, follow, max-image-preview:large"}"`,
      ),
    );
    const scripts = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    assert.equal(scripts.length, 1);
    const schema = JSON.parse(scripts[0][1]);
    assert.equal(schema["@context"], "https://schema.org");
    const graph = schema["@graph"];
    const person = graph.find((node) => node["@type"] === "Person");
    assert.equal(person.name, profile.name);
    assert.equal(person.email, profile.email);
    assert.equal(person.address["@type"], "PostalAddress");
    assert.equal(
      person.address.addressLocality,
      profile.location.split(",")[0].trim(),
    );
    const country = profile.location.split(",")[1].trim();
    assert.equal(
      person.address.addressCountry,
      country === "Ethiopia" ? "ET" : country,
    );
    for (const skill of profile.expertise.flatMap((item) => [
      item.title,
      ...item.skills,
    ]))
      assert.ok(
        person.knowsAbout.includes(skill),
        `${page.path}: Person knowsAbout includes ${skill}`,
      );
    assert.equal(person.worksFor, undefined, "Do not infer current employers");
    assert.ok(
      graph.some(
        (node) => node["@type"] === "WebSite" && node.url === `${origin}/`,
      ),
    );
    if (page.post) {
      const article = graph.find((node) => node["@type"] === "Article");
      assert.equal(article.author["@id"], person["@id"]);
      assert.equal(article.datePublished, page.post.date);
      assert.equal(article.image, `${origin}/social-card.png`);
    }
    if (["/", "/about/", "/resume/"].includes(page.path))
      assert.ok(graph.some((node) => node["@type"] === "ProfilePage"));
    if (page.path !== "/" && !page.notFound) {
      const crumbs = graph.find(
        (node) => node["@type"] === "BreadcrumbList",
      ).itemListElement;
      assert.equal(crumbs.at(-1).item, page.url);
      crumbs.forEach((crumb, index) => {
        assert.equal(crumb.position, index + 1);
        assert.ok(pages.some((target) => target.url === crumb.item));
      });
    }
  }
});

test("social preview is a real 1200 by 630 PNG", async () => {
  const image = await readFile(new URL("social-card.png", dist));
  assert.deepEqual(
    [...image.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(image.toString("ascii", 12, 16), "IHDR");
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});

test("rendered internal links, fragments, scripts, and images resolve to static output", async () => {
  for (const page of pages) {
    const html = await read(outputPath(page));
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(decode(match[1]), page.url);
      if (url.origin !== origin) continue;
      const path = decodeURIComponent(url.pathname).slice(1);
      const file = !path || path.endsWith("/") ? `${path}index.html` : path;
      await assert.doesNotReject(
        access(new URL(file, dist)),
        `${page.path}: missing internal target ${url.pathname}`,
      );
      if (url.hash && file.endsWith(".html")) {
        const target = await read(file);
        assert.ok(
          [...target.matchAll(/\bid="([^"]+)"/g)].some(
            (id) => decode(id[1]) === decodeURIComponent(url.hash.slice(1)),
          ),
          `${page.path}: missing fragment ${url.href}`,
        );
      }
    }
  }
});

test("sitemap and robots cover public routes only with the configured canonical origin", async () => {
  const sitemap = await read("sitemap.xml");
  assert.match(sitemap, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(
    sitemap,
    /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/,
  );
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    decode(match[1]),
  );
  assert.deepEqual(
    locations.sort(),
    pages
      .filter((page) => !page.notFound)
      .map((page) => page.url)
      .sort(),
  );
  assert.ok(!sitemap.includes("404"));
  assert.equal(
    await read("robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  );
  await assert.rejects(
    access(new URL("public/sitemap.xml", root)),
    "Sitemap must have one generated source of truth",
  );
});

test("RSS has escaped content, canonical permalinks, and valid publication dates", async () => {
  const feed = await read("feed.xml");
  assert.match(
    feed,
    /<rss version="2.0" xmlns:atom="http:\/\/www.w3.org\/2005\/Atom">/,
  );
  assert.match(
    feed,
    /<atom:link[^>]+rel="self"[^>]+type="application\/rss\+xml"/,
  );
  assert.ok(
    !/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i.test(feed),
    "No unescaped XML ampersands",
  );
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  assert.equal(items.length, posts.length);
  posts.forEach((post, index) => {
    const item = items[index][1];
    assert.ok(item.includes(`<title>${escapeXml(post.title)}</title>`));
    assert.ok(
      item.includes(
        `<description>${escapeXml(post.description)}</description>`,
      ),
    );
    assert.ok(
      item.includes(
        `<guid isPermaLink="true">${origin}/writing/${post.slug}/</guid>`,
      ),
    );
    assert.equal(
      new Date(item.match(/<pubDate>(.*?)<\/pubDate>/)[1]).toISOString(),
      `${post.date}T00:00:00.000Z`,
    );
  });
  assert.equal(
    escapeXml(`<tag a="x">A & B's</tag>`),
    "&lt;tag a=&quot;x&quot;&gt;A &amp; B&apos;s&lt;/tag&gt;",
  );
});

test("public exports are factual, readable, and explicitly allowlisted", async () => {
  const exported = JSON.parse(await read("profile.json"));
  assert.deepEqual(
    Object.keys(exported).sort(),
    [
      "name",
      "shortName",
      "role",
      "location",
      "url",
      "email",
      "summary",
      "sameAs",
      "expertise",
      "projects",
      "writing",
    ].sort(),
  );
  assert.equal(exported.name, profile.name);
  assert.equal(exported.summary, profile.summary);
  assert.equal(exported.projects.length, profile.projects.length);
  assert.equal(exported.writing.length, posts.length);
  const short = await read("llms.txt");
  const full = await read("llms-full.txt");
  assert.match(short, /experimental llms.txt convention/);
  for (const page of pages.filter((page) => !page.notFound))
    assert.ok(short.includes(page.url));
  for (const post of posts)
    for (const section of post.sections)
      for (const paragraph of section.paragraphs)
        assert.ok(full.includes(paragraph));
  for (const project of profile.projects)
    assert.ok(
      full.includes(project.challenge) && full.includes(project.outcome),
    );
});

test("published text has no template copy, obvious secrets, or sensitive field names", async () => {
  // A real input's placeholder attribute is valid UI, not leftover template copy.
  const forbidden =
    /lovable|lorem ipsum|your[- ]name|example\.com|\bTODO\b|\bPLACEHOLDER\b(?!\s*=)|public technical drafts|\bBEGIN (?:RSA |OPENSSH )?PRIVATE KEY|\b(?:api[_-]?key|client[_-]?secret|salary|personalGoals|privateClients)\s*["']?\s*[:=]/i;
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const url = new URL(
        entry.name + (entry.isDirectory() ? "/" : ""),
        directory,
      );
      if (entry.isDirectory()) {
        if (entry.name !== "assets") await inspect(url);
      } else if (/\.(html|txt|xml|json)$/.test(entry.name)) {
        assert.doesNotMatch(
          await readFile(url, "utf8"),
          forbidden,
          url.pathname,
        );
      }
    }
  }
  await inspect(dist);
});
