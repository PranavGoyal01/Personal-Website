import { test } from "node:test";
import assert from "node:assert/strict";
// Node's type stripping uses explicit extensions for this isolated parser test.
// @ts-ignore Node runtime requires the TypeScript extension.
import {
  parseLinkedInLines,
  validateProfile,
  makeProfile,
} from "../lib/linkedin-import.ts";
import type { PdfLine } from "../lib/linkedin-import";
import type { PortfolioData } from "../components/data/nodes";
const base: PortfolioData = {
  version: 1,
  nodes: [
    { id: "center", label: "Example Person", category: "center", detail: {} },
    ...["ai", "quant", "engineering", "leadership", "education"].map((c) => ({
      id: c + "-branch",
      label: c,
      category: c as any,
      detail: {},
    })),
    {
      id: "project",
      label: "Independent project",
      category: "engineering",
      source: "manual",
      detail: {
        links: [{ label: "Code", href: "https://github.com/example/project" }],
      },
    },
  ],
  edges: [],
};
function line(text: string, size = 10.5, page = 1): PdfLine {
  return { text, size, page, x: 223, y: 100 };
}
const fixture = [
  line("Example Person", 26),
  line("Summary", 15.75),
  line("Builds reliable products."),
  line("Experience", 15.75),
  line("Example Software", 12),
  line("2 years"),
  line("Engineering Lead", 11.5),
  line("April 2026 - Present (7 months)"),
  line("- Leads a team"),
  line("across projects.", 10.5, 2),
  line("Developer", 11.5),
  line("October 2025 - April 2026 (7 months)"),
  line("Built a product."),
  line("Example Research", 12),
  line("Research Assistant", 11.5),
  line("May 2025 - September 2026 (1 year)"),
  line("Studied market simulations."),
  line("Education", 15.75),
  line("Example University", 12),
  line("Bachelor of Science, CS · (September 2024 - May 2028)"),
];
test("preserves grouped roles, descriptions across pages, dates, education and manual projects", () => {
  const r = parseLinkedInLines(fixture, base);
  assert.equal(r.roles, 3);
  assert.equal(r.education, 1);
  const lead = r.profile.nodes.find(
    (n) => n.detail.role === "Engineering Lead",
  )!;
  assert.deepEqual(lead.detail.bullets, ["Leads a team across projects."]);
  assert.equal(lead.detail.org, "Example Software");
  assert.equal(
    r.profile.nodes.find((n) => n.detail.role === "Developer")!.detail.org,
    "Example Software",
  );
  assert.equal(
    r.profile.nodes.find((n) => n.detail.role === "Research Assistant")!
      .category,
    "ai",
  );
  assert.equal(
    r.profile.nodes.find(
      (n) => n.category === "education" && !n.id.endsWith("-branch"),
    )!.detail.dates,
    "September 2024 - May 2028",
  );
  assert.ok(r.profile.nodes.some((n) => n.id === "project"));
  validateProfile(r.profile);
  assert.ok(
    r.profile.edges.every(
      (e) =>
        r.profile.nodes.some((n) => n.id === e.source) &&
        r.profile.nodes.some((n) => n.id === e.target),
    ),
  );
});
test("rejects unsupported exports without mutating existing data", () => {
  const original = JSON.stringify(base);
  assert.throws(
    () => parseLinkedInLines([line("Scanned PDF")], base),
    /LinkedIn/,
  );
  assert.equal(JSON.stringify(base), original);
});
test("rejects duplicate nodes, broken edges and unsafe links", () => {
  assert.throws(() =>
    validateProfile({ ...base, nodes: [...base.nodes, base.nodes[0]] }),
  );
  assert.throws(() =>
    validateProfile({
      ...base,
      edges: [{ source: "center", target: "missing" }],
    }),
  );
  assert.throws(() =>
    validateProfile({
      ...base,
      nodes: [
        ...base.nodes,
        {
          id: "bad",
          label: "bad",
          category: "engineering",
          detail: { links: [{ label: "bad", href: "javascript:alert(1)" }] },
        },
      ],
    }),
  );
});
test("changing category rebuilds graph connections", () => {
  const nodes = base.nodes.map((n) =>
    n.id === "project" ? { ...n, category: "quant" as const } : n,
  );
  assert.deepEqual(
    makeProfile(nodes).edges.find((e) => e.target === "project"),
    { source: "quant-branch", target: "project" },
  );
});

test("equivalent month abbreviations do not create false date warnings", () => {
  const current: PortfolioData = {
    ...base,
    nodes: [
      ...base.nodes,
      {
        id: "old-role",
        label: "Example Software",
        category: "engineering",
        source: "linkedin",
        detail: {
          org: "Example Software",
          role: "Engineering Lead",
          dates: "Apr 2026 – Present",
        },
      },
    ],
  };
  const r = parseLinkedInLines(
    fixture.slice(0, 10).concat(fixture.slice(13)),
    current,
  );
  assert.ok(!r.warnings.some((w) => w.startsWith("Example Software:")));
});
