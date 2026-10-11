# Pranav Goyal — Personal Website

An interactive portfolio connecting software engineering, AI research, quantitative finance, leadership, and education. Built on the graph implementation in PR #2 and refreshed from the supplied resume.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Explore

- Select a graph node, or focus it with Tab and press Enter/Space.
- Drag a node, drag the background to pan, and scroll or use controls to zoom.
- Reset view restores the graph's original framing.
- Filter by topic or open the searchable index. Phones use the readable index by default.
- Detail panels support Escape, focus trapping, and return focus to the opener.
- Follow GitHub and LinkedIn links.

## Update content

Edit `components/data/nodes.ts`: node IDs must be unique, edge endpoints must exist, and optional `detail.links` provide project links. The uploaded resume PDF is intentionally excluded from this public repository. The intro and contact links are in `app/page.tsx` and `components/Nav.tsx`; metadata is in `app/layout.tsx`. Colors and category names are in the data file. No API keys or database are needed for this version.

## Hosting

Deploy this Next.js project on a standard Node-capable Next.js host, such as Vercel, with `npm run build`. Domain/DNS changes and production publishing are separate from this draft repository implementation. The historical repo brief mentions `pgoyal.us`; ownership and current deployment configuration have not been verified.

See [repository review](docs/repository-review.md) for branch/PR history, findings, and verification evidence.
