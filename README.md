# Fkadeal Matiwos Portfolio

A content-driven React portfolio for Fkadeal Matiwos, senior software engineer in Addis Ababa, Ethiopia. Vite builds client assets; a Node script server-renders every public route into standalone HTML. The canonical domain comes from `src/content/profile.json`, currently https://fkadeal.open.et.

## Workflow

Use Node.js 20.19+ or Node.js 22 LTS and npm. Install the existing locked dependencies with `npm ci` on a fresh checkout.

```sh
npm run dev        # Vite development server
npm run typecheck  # TypeScript checks, separate from the build
npm run build      # Client bundle, then static prerender and crawl artifacts
npm run test       # Validate the generated dist/ output; build first
npm run preview    # Review the production output locally
```

Development serves the client app, not generated route-specific head metadata. Use the production build and preview to inspect SEO output. No server runtime or additional SSR dependency is required for deployment.

GitHub Actions runs type checks, lint, a fresh build, and generated-output tests on pushes to `main` and pull requests. This workflow verifies changes; it does not configure or replace your hosting provider's deployment.

## Content

- `src/content/profile.json`: public identity, expertise, selected work, experience, and FAQs.
- `src/content/posts/*.json`: engineering notes, discovered automatically at build time.
- `CONTENT_GUIDE.md`: step-by-step publishing instructions, JSON schema, and editorial boundaries.

Edit source JSON, rebuild, run tests, and review the result. Project and post slugs must be unique lowercase hyphen-separated URL segments, and post filenames must match their slugs. Dates must be real `YYYY-MM-DD` dates. Changing a published slug requires a hosting redirect. All content in these files is public. Do not add confidential client names, credentials, private contact data, or unsupported outcomes. Automated tests catch common mistakes, not every privacy issue; editorial review remains necessary.

The prerenderer validates every required field, nested object, string array, positive reading-time integer, and publication date before rendering. Errors identify the source and field, such as `src/content/profile.json.projects[0].title: expected a non-empty string`. Unknown fields are rejected to catch spelling mistakes and accidental private additions. Optional section `bullets` may be omitted or empty. Keep expertise IDs in the order `ai`, `payments`, `saas`, `cloud`, which App uses for its capability links and icons. Profile URLs must use HTTPS; the canonical URL must be an origin without a subpath. Location uses `City, Country` for structured address generation.

## Static Build

`src/entry-server.tsx` exports `render(path)` using `renderToString(<App path={path} />)`. App must accept an optional path with an SSR-safe default and render its full content without browser globals during SSR. The client entry hydrates the same tree using the browser path. Neither the static renderer nor the metadata generator relies on an App route export.

`scripts/prerender.mjs` loads that entry through Vite's `ssrLoadModule` after `vite build --manifest --assetsInlineLimit 0`. The separate prerender process sets `NODE_ENV=development` before loading Vite/React because Vite's serve transform emits `jsxDEV`, which requires the development React runtime. Vite config mode remains `production` so development-only tagging stays off. The client bundle is already built for production; App's rendered content must not branch on `NODE_ENV` or `import.meta.env.DEV/PROD` so server and client trees match. Asset inlining is disabled so imported image URLs can be mapped through the client manifest to their production asset filenames. The script closes the temporary Vite server and writes HTML into `dist/` using the built template's `<!--app-html-->` and `<!--page-head-->` markers. There is no `.prerender/` bundle to deploy or clean up.

Generated directory-index routes:

- `/`, `/about/`, `/work/`, `/expertise/`, `/writing/`, `/contact/`, `/resume/`
- `/work/{project-slug}/` for each profile project
- `/writing/{post-slug}/` for each engineering note
- `/404.html`, rendered separately with `noindex, follow`

Each page has its own title, description, canonical URL, Open Graph and Twitter metadata, and JSON-LD. Structured data includes Person, WebSite, ProfilePage where appropriate, Article with an author on notes, and breadcrumbs on public subpages. Person includes the public email, city/country derived from `profile.location`, and expertise titles and skills. No employment relationship, publication history, or project metric is inferred beyond the public content. Social previews and Article image metadata use the 1200 by 630 PNG at `/social-card.png`, rasterized from the editable cream/lime/ink `public/social-card.svg`.

After editing the SVG, regenerate the PNG with ImageMagick (an optional authoring tool, not a build dependency):

```sh
convert -background none public/social-card.svg -strip PNG24:public/social-card.png
```

The build also generates:

- `/sitemap.xml`: all public canonical routes, excluding 404; article dates supply article last-modified values.
- `/robots.txt`: allows public crawling and links to the configured sitemap. The build overrides the public copy using the content domain; no stale `public/sitemap.xml` is retained.
- `/feed.xml`: RSS 2.0 with canonical article links, escaped XML, and UTC publication dates.
- `/profile.json`: an explicit allowlist of public identity, contact, expertise, project summaries, and writing links. New source fields are not automatically exposed here.
- `/llms.txt` and `/llms-full.txt`: readable discovery links and public content following an experimental convention, with no guarantee of AI indexing or use.

`npm run test` uses Node's built-in test runner and assertions against generated files. It checks malformed-content rejection, route bodies, full article text, metadata uniqueness and escaping, structured data, internal link and fragment targets, sitemap coverage, robots rules, RSS fields and dates, export boundaries, PNG dimensions, and common template/secret markers. It does not replace a browser hydration, accessibility, or visual review.

## Hosting

Publish **only `dist/`** after a successful build and test run. Configure the host to serve directory indexes so `/work/example/` resolves to `/work/example/index.html`. Redirect slashless page URLs to their trailing-slash canonical URLs. Preserve `/` as the homepage and serve assets and XML/JSON/text files directly with their appropriate content types.

Configure unknown paths to serve `404.html` **with HTTP status 404**, preserving the requested URL. Do not use an SPA catch-all that returns `index.html` with status 200 for every request; that hides missing pages and serves incorrect metadata. Vite preview is useful for local review but is not proof of production 404 behavior. Check direct requests to every kind of detail page and a nonexistent route after deployment.

Point the domain to the host and enable HTTPS. If the domain changes, update `profile.url` and the development copy of `public/robots.txt`, rebuild, and configure redirects from old URLs. Verify production canonical URLs, sitemap, robots, RSS, and social assets after deployment.

Search engines decide whether and when to crawl, index, and display structured data. These files provide crawlable content, not ranking or inclusion guarantees. Manually verify domain ownership in Google Search Console (usually a DNS TXT record), then submit `https://fkadeal.open.et/sitemap.xml`. Domain verification and sitemap submission are owner actions, not performed by this repository.

## Dependency Maintenance

The npm lockfile includes compatible security updates. At implementation time, `npm audit` still reports inherited advisories in the Vite/esbuild/Lovable development-tool chain and the unused React Router dependencies. Resolving the remaining reports requires dependency removal or major-version migrations; those are not silently forced by this portfolio change. Do not expose the Vite development server publicly. Production is static HTML and assets, not a running Vite server. Use npm consistently; the legacy Bun lockfiles have not been updated.
