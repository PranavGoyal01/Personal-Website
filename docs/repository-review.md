# Personal website repository review

Reviewed October 11, 2026. Repository: https://github.com/PranavGoyal01/Personal-Website

## Existing branches and pull requests

The complete paginated branch listing contained `main` and `claude/personal-website-build-997hoo`. A search across all PR states returned two PRs. Neither was merged. Both have empty discussion timelines.

| Ref                                                                                                  | State                                                | Existing work                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` at `83fc91f`                                                                                  | Default branch                                       | Initial commit and empty README; no website implementation.                                                                                                                                                                             |
| `claude/personal-website-build-997hoo` at `559a667`                                                  | Two commits ahead of main, zero behind               | Next.js 14, React, Tailwind, TypeScript, D3; interactive graph, colored shapes, drag, hover connections, detail and About panels.                                                                                                       |
| [PR #2](https://github.com/PranavGoyal01/Personal-Website/pull/2)                                    | Open                                                 | 15 added files. Initial graph creation (`3e93e44`), then a fix for blank rendering and dragging (`559a667`). No returned commit statuses or PR-triggered Actions runs; its build claim was not independent verification.                |
| [PR #1](https://github.com/PranavGoyal01/Personal-Website/pull/1), head `site/scaffold` at `b113283` | Closed, unmerged; branch absent from current listing | Four commits, 20 changed files. Conventional red/black single-page scaffold, theme toggle, one featured project, Supabase contact storage, Resend handler, resume/headshot, planning documents. Accessible through the PR's commit SHA. |

## Findings in existing code

### Graph version

- Current resume differs from portfolio data: SSMIF is no longer incoming; Hanlon research ended September 2026; Blueprint now has nine engineers and serves 50+ members; SEO role is Club Operations Coordinator. Current GPA is 3.71; the current graduate certificates differ from old AWS exam placeholders.
- LinkedIn URL omits the hyphen before `cs`, unlike the supplied resume. Resume download and direct project repositories were missing.
- ETF Arbitrage and recreational volleyball were absent, despite appearing on the resume.
- Graph SVG nodes had no keyboard focus or keyboard activation. Panels lacked dialog semantics, focus management, and Escape handling.
- The simulation had no boundary clamp or pan/zoom/reset. Fixed graph-only presentation, tiny labels, and hidden body overflow made narrow-screen access fragile.
- A Queen Mary/quant edge appeared twice. Hover/selection dimming could obscure content; a readable index was missing.
- Package configuration pinned Next.js 14.2.5, with no useful README, tests, or CI configuration.

### Older scaffold

- The contact API is not connected to a form in `pages/index.js`, which only offers email/LinkedIn links.
- Resume and headshot were stored at repository root rather than Next.js `public/`; `/resume.pdf` would not serve that root file through standard static routing.
- Supabase initialization creates `public.contact_messages` without enabling RLS or adding policies. Actual database deployment and grants were not inspected; exposure cannot be determined from this file alone.
- Supabase insertion errors are logged and ignored. With Resend unconfigured, the route returns success and says “saved” even if storage failed.
- Input validation checks only truthiness; there are no size/type/email checks or abuse controls. Client initialization at module load relies on configured environment variables.
- Historical planning files describe desired stack, domain, analytics, and an editor; these are prior context, not new instructions. Their June launch deadline is stale. No analytics or content dashboard was implemented.

## Refreshed implementation

Based on PR #2's head in a separate branch, with its commits preserved. Keeps the graph and five topics, adds a deterministic force layout, camera controls, keyboard nodes, accessible detail dialogs, a searchable topic index, phone layout, updated resume data, ETF Arbitrage and volleyball, project repository links, corrected LinkedIn link, with the uploaded resume PDF and download links excluded at the user’s request. Removes build-time Google font fetching and updates Next.js to 14.2.35 with a lockfile. Adds setup/content-editing instructions.

The uploaded resume supplies current facts. Older historical experiences present only in portfolio data are retained as context rather than inferred from resume omissions. The code and attached documents are treated as source material, not instructions to publish, change DNS, send emails, or configure services.

## Verification

- Production `npm run build`: passed, including TypeScript validation and static page generation.
- Chromium at desktop and 390px phone widths: graph renders, no page errors, keyboard opens a node, Escape closes and restores focus, zoom/reset work, search finds ETF Arbitrage, project link has correct destination, empty search state renders, the excluded PDF endpoint returns 404, phone index has no horizontal overflow.
- Confirmed the published branch history contains no PDF files.
- Visual inspection prompted brighter category outlines and larger/spaced graph labels.
- Reference `https://andrewtrousdale.com` could not be fetched: environment proxy returned 403. No claim of visual matching is made; the user selected interactive graph and exploration as the intended inspiration.
- Existing production deployment, domain ownership, third-party credentials, historical database policies, and external link availability were not verified. No merge, production deployment, DNS change, or email was performed.
