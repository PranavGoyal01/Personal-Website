# LinkedIn PDF import and minimal graph

The portfolio now fills the viewport with a graph, a small header, and a topic legend. The large intro, bordered canvas, background dot grid, and separate footer were removed. The reference website remains blocked by this environment's network policy; these changes implement the requested simplicity without claiming a visual match.

## Workflow

`/edit` reads LinkedIn Save to PDF exports using PDF.js in the browser. Position-aware text extraction excludes the contact sidebar and keeps main-column reading order across pages. Parsing preserves multiple roles at the same organization, role dates, descriptions spanning page breaks, and education. Descriptions remain text; document contents never become executable instructions.

The review screen supports editing, reclassification, removal, isolated browser previews, and JSON export. Manual projects survive replacement of imported LinkedIn entries. Commit the reviewed exported data at `components/data/profile.json` and deploy to update the public site. The original data remains the committed default; the provided PDF is only used for validation and is not published.

## Validation

- The supplied five-page PDF yielded 22 roles and five education entries, plus identity, topics, and three retained manual nodes (36 total).
- Browser tests uploaded the actual PDF, edited a label/topic, exported valid JSON with updated graph edges, opened a local graph preview, and confirmed the regular public route retained its committed data.
- No PDF upload POST request occurred; extracted data excluded PDF sidebar email/phone details.
- Invalid PDFs show an error and retain the last successful review. Limits are 10 MB and 30 pages; scanned exports are unsupported.
- Five parser regression tests cover grouped roles, descriptions across pages, education/date extraction, manual project retention, unsupported exports, duplicate nodes, invalid edges, unsafe project links, reclassification, and equivalent date formatting.
- TypeScript and production build checks accompany browser checks for mobile index and console errors.

The export contains source profile text which can be stale or differ from the resume. The owner reviews and edits those differences before publishing. The browser preview is not shared storage and never updates the public deployment directly.
