# Pranav Goyal — Personal Website

A minimal, full-screen interactive portfolio graph with a searchable index and accessible detail panels. Built with Next.js, React, TypeScript, Tailwind, and D3.

## Run locally

Use Node.js 22.18+ (verified with Node 24).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`. The dev/build scripts copy the PDF.js worker into `public/`; it is generated and ignored by Git. Run `npm test` for the LinkedIn importer regression tests.

## Update nodes from LinkedIn

1. Open **Update profile** (`/edit`). Upload a text-based LinkedIn **Save to PDF** export, up to 10 MB and 30 pages.
2. Review the extracted roles and education. Multiple roles at one employer stay separate; manually maintained project nodes remain. Date differences are flagged for review. The PDF's contact sidebar is excluded.
3. Edit labels, topics, organizations, dates, roles, and descriptions, or remove unwanted nodes.
4. Select **Save graph preview**, then **Open preview**. This is stored in your browser and only appears at `/?preview=1`; regular visitors see the committed data.
5. Select **Export profile.json**. Replace `components/data/profile.json` in GitHub with that file, review/commit the change, then deploy to publish it to everyone.

PDF processing runs entirely in the browser. The original PDF is neither uploaded nor saved to the repository. The editor has no server writes and does not need an owner login or API keys. It does not automatically publish changes. Scanned/image PDFs and substantially different export layouts are not supported; an import failure keeps the existing graph/review unchanged. Review extracted content before publishing.

## Edit content directly

`components/data/profile.json` contains `version`, `nodes`, and `edges`. Keep IDs unique and edge endpoints valid. Set a node's `source` to `manual` to retain it through future PDF imports. Categories and graph types live in `components/data/nodes.ts`. Optional `detail.links` provide HTTPS project links. Navigation/contact links live in `components/Nav.tsx`; metadata is in `app/layout.tsx`.

The resume PDF remains excluded. The original portfolio data remains the public default until a reviewed import is committed.

## Explore

Select a graph node, or focus it with Tab and press Enter/Space. Drag nodes or the background, zoom with scroll/buttons, or reset the view. Filter topics using the quiet legend at the bottom. Use the index for search on desktop or phones. Detail panels support Escape, focus trapping, and focus restoration.

## Hosting

Deploy this Next.js project on a standard Node-capable host such as Vercel. Domain/DNS changes and production publishing are separate from this draft implementation. The historical repo brief mentions `pgoyal.us`; current domain/deployment configuration has not been verified.

See [repository review](docs/repository-review.md) for previous branch/PR history and [PDF import verification](docs/pdf-import.md) for the new workflow's validation.
