# Content Guide

## Content Files

- `src/content/profile.json` holds the public identity, expertise, projects, experience, and FAQs.
- `src/content/posts/*.json` holds one engineering note per file. Each filename should match its `slug`.
- Content is plain JSON, not JSX or Markdown. Use double quotes, escape embedded quotes, and avoid comments and trailing commas.
- Keep array order intentional. It provides an editorial order for profile entries and article sections; the site renderer controls any additional sorting.

## Edit on GitHub

1. Open the repository on GitHub and select the branch you want to update.
2. Open `src/content/profile.json` or a file in `src/content/posts/`, then choose the pencil icon to edit.
3. Change text values without renaming schema fields or changing their types.
4. Review the diff, commit to a branch, and open a pull request if the repository uses review. Merge into the deployment branch when approved.
5. Check the build and deployment result, then inspect the rendered page. A GitHub commit does not by itself guarantee that a hosting service has published the change.

## Add an Engineering Note

In GitHub, open `src/content/posts/`, select **Add file > Create new file**, and name it with a unique lowercase, hyphen-separated slug, such as `webhook-review-checklist.json`. Use an existing note as the structural reference or start with this template:

```json
{
  "slug": "webhook-review-checklist",
  "title": "A Webhook Review Checklist",
  "description": "A practical checklist for authenticating webhook events and processing them reliably.",
  "date": "2026-09-08",
  "category": "Engineering note",
  "readingMinutes": 3,
  "sections": [
    {
      "heading": "Establish the trust boundary",
      "paragraphs": [
        "Authenticate the incoming event before allowing its contents to influence application state."
      ],
      "bullets": [
        "Verify the provider's authentication requirements."
      ]
    }
  ]
}
```

Replace the example with substantive content before publishing. Use the actual editorial date in `YYYY-MM-DD` form and estimate `readingMinutes` as a positive integer. For the three supplied notes, `2026-09-08` is an editorial date, not the date a project shipped. `bullets` is optional; `heading` and `paragraphs` are required for every section. Keep all other post fields present and do not add publication-status fields: those fields are not part of this schema.

The articles are proposed editorial content and require the profile owner's review and approval before sharing or publishing. Review technical accuracy, voice, and suitability for public attribution. Their public category is exactly `Engineering note`; they offer design guidance, not project postmortems. Files in the content directory are publication inputs, not private storage or an access-controlled review area.

## Profile Schema

The exact top-level fields are `name`, `shortName`, `role`, `location`, `email`, `url`, `summary`, `github`, `linkedin`, `expertise`, `projects`, `experience`, and `faqs`. Identity and summary fields are strings; the last four fields are arrays of objects.

| Array | Required fields |
| --- | --- |
| `expertise` | `id`, `title`, `description`, `skills` |
| `projects` | `slug`, `title`, `company`, `category`, `summary`, `challenge`, `approach`, `outcome`, `stack`, `flow` |
| `experience` | `company`, `role`, `period`, `description` |
| `faqs` | `question`, `answer` |

All nested fields are strings except `skills`, `approach`, `stack`, and `flow`, which are arrays of strings. Keep the four expertise IDs exactly `ai`, `payments`, `saas`, and `cloud`. Project slugs must be unique and stable. Experience periods are display strings, so entries such as `Recent work` do not need an invented calendar date. Role labels describe engineering scope and should not be read as verified contractual job titles.

## Editorial Boundaries

- Use Fkadeal Matiwos / FKADL and the contact links already recorded in the profile.
- Describe experience as roughly ten years; do not infer an exact career start or introduce education claims.
- Preserve the supplied periods: Lawgical `Recent work`, BirrLink `2024 - present`, FARIS `2023 - present`, ETM `2021 - 2023`, and independent consulting without dates.
- Keep end-client identities, private contact records, credentials, salaries, and personal goals out of all content.
- Describe known project scope without inventing adoption numbers, revenue, latency improvements, or other quantitative achievements.
- Do not present a procurement proposal, design recommendation, or planned feature as completed delivery.
- Keep ODA details minimal. Preserve the supplied FARIS, ETM, and consulting scope; add further responsibilities or technologies only when verified and shareable.
- Distinguish recommended technical practices in notes from claims about a project's actual implementation. Review technical guidance before publishing revisions.

## Build and Static Paths

The content-driven publishing workflow uses these JSON files as source material for the profile and detail pages. Run `npm run build` after editing content so the site's content loader and static-generation steps can incorporate the changes into the deployment output.

Static paths are generated automatically as `/work/{slug}/` and `/writing/{slug}/`. A new note also appears in the writing index, RSS feed, sitemap, and AI-readable exports. Renaming a published slug requires a redirect in the hosting configuration. The homepage and project-fit finder feature selected project slugs in `src/App.tsx`; update those references if you rename or remove a featured project.

Generated HTML, bundled assets, and generated route or sitemap output are build artifacts, not the editorial source. Edit the JSON and rebuild rather than manually patching generated files. Check the configured output directory and test direct navigation to each new detail URL, not just navigation from the home page. Content changes become visible on the hosted site after the updated build is deployed.

## Local Review and Publish

Install dependencies with `npm ci` when needed. Review content locally with `npm run dev`, then run:

```sh
npm run build
npm run typecheck
npm run test
npm run preview
```

The build validates content fields, types, slugs, and dates before rendering. Tests verify generated pages, links, metadata, and discovery files. Neither replaces editorial review. Confirm article content is accurate and suitable for your public profile before sharing. Inspect new detail pages and check mobile layouts.

For a local content change, stage only the intended content files. The following example stages the profile and one note; adjust the explicit paths for your edit:

```sh
git status --short
git diff -- src/content/profile.json src/content/posts/durable-ai-workflows.json
git add src/content/profile.json src/content/posts/durable-ai-workflows.json
git diff --cached
git commit -m "Update profile and engineering note"
git push
```

Push to your working branch and merge through the repository's normal process. If hosting is connected to the deployment branch, the merge or push should trigger its configured build; verify that it actually completes. If deployment is manual, publish through the configured host after the build. Confirm the updated profile and note URLs on the live site before sharing them.
