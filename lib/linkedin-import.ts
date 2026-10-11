import type {
  Category,
  GraphNode,
  PortfolioData,
} from "../components/data/nodes";
export interface PdfLine {
  text: string;
  x: number;
  y: number;
  size: number;
  page: number;
}
export interface ImportResult {
  profile: PortfolioData;
  warnings: string[];
  roles: number;
  education: number;
}
const datePattern =
  /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*[-–]\s*(?:Present|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/;
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function classify(
  org: string,
  role: string,
): Exclude<Category, "center"> {
  if (
    /research|artificial intelligence|inspirit|big data|hanlon/i.test(
      org + " " + role,
    )
  )
    return "ai";
  if (/investment|goldman|quant|finance/i.test(org + " " + role))
    return "quant";
  if (/developer|engineering|software/i.test(role)) return "engineering";
  return "leadership";
}
function bullets(lines: PdfLine[]): string[] {
  const parts: string[] = [];
  for (const line of lines) {
    const text = line.text.trim();
    if (!text || /^\d+ years?(?: \d+ months?)?$|^\d+ months?$/.test(text))
      continue;
    if (/^[-•]/.test(text) || !parts.length)
      parts.push(text.replace(/^[-•]\s*/, ""));
    else parts[parts.length - 1] += " " + text;
  }
  return parts;
}
export function parseLinkedInLines(
  input: PdfLine[],
  base: PortfolioData,
): ImportResult {
  const lines = input.filter(
    (l) => l.text.trim() && !/^Page \d+ of \d+$/.test(l.text.trim()),
  );
  const start = lines.findIndex((l) => l.text.trim() === "Experience");
  const end = lines.findIndex(
    (l, i) => i > start && l.text.trim() === "Education",
  );
  if (start < 0 || end < 0)
    throw new Error(
      "This PDF does not contain recognizable LinkedIn Experience and Education sections. Use LinkedIn’s Save to PDF export.",
    );
  const imported: GraphNode[] = [];
  let org = "",
    roleCount = 0,
    educationCount = 0;
  const experience = lines.slice(start + 1, end);
  for (let i = 0; i < experience.length; i++) {
    const line = experience[i];
    if (line.size >= 11.9) {
      org = line.text.trim();
      while (experience[i + 1]?.size >= 11.9)
        org += " " + experience[++i].text.trim();
      continue;
    }
    const date = line.text.match(datePattern)?.[0];
    if (!date) continue;
    const roles: string[] = [];
    for (
      let j = i - 1;
      j >= 0 && experience[j].size >= 11.2 && experience[j].size < 11.9;
      j--
    )
      roles.unshift(experience[j].text.trim());
    const role = roles.join(" ");
    if (!org || !role)
      throw new Error(
        "A role could not be matched to an organization. Review the PDF format before importing.",
      );
    let next = i + 1;
    while (
      next < experience.length &&
      experience[next].size < 11.2 &&
      !datePattern.test(experience[next].text)
    )
      next++;
    imported.push({
      id: `linkedin-${slug(org)}-${slug(role)}`,
      label: org,
      sublabel: role,
      source: "linkedin",
      category: classify(org, role),
      detail: {
        org,
        role,
        dates: date,
        bullets: bullets(experience.slice(i + 1, next)),
      },
    });
    roleCount++;
  }
  const education = lines.slice(end + 1);
  for (let i = 0; i < education.length; i++) {
    if (education[i].size < 11.9) continue;
    let school = education[i].text.trim();
    while (education[i + 1]?.size >= 11.9)
      school += " " + education[++i].text.trim();
    const detail: string[] = [];
    while (education[i + 1] && education[i + 1].size < 11.9)
      detail.push(education[++i].text.trim());
    const description = detail.join(" ");
    const date = description.match(datePattern)?.[0];
    const degree = description
      .replace(/\s*·?\s*\([^)]*\)\s*$/, "")
      .replace(/\s*·\s*$/, "")
      .trim();
    imported.push({
      id: `linkedin-education-${slug(school)}`,
      label: school,
      sublabel: degree || "Education",
      source: "linkedin",
      category: "education",
      detail: {
        org: school,
        role: degree || undefined,
        dates: date,
        bullets: [],
      },
    });
    educationCount++;
  }
  if (!roleCount || !educationCount)
    throw new Error(
      "No complete roles or education entries were found. Your current graph has not been changed.",
    );
  const identity = lines.slice(0, start).find((l) => l.size >= 20);
  const summaryStart = lines.findIndex((l) => l.text.trim() === "Summary");
  const oldCenter = base.nodes.find((n) => n.category === "center")!;
  const center: GraphNode = {
    ...oldCenter,
    label: identity?.text || oldCenter.label,
    detail: {
      ...oldCenter.detail,
      bullets:
        summaryStart >= 0
          ? [
              lines
                .slice(summaryStart + 1, start)
                .map((l) => l.text)
                .join(" "),
            ]
          : oldCenter.detail.bullets,
    },
  };
  const branches = base.nodes.filter((n) => n.id.endsWith("-branch"));
  const manual = base.nodes.filter(
    (n) =>
      n.source === "manual" &&
      n.category !== "center" &&
      !n.id.endsWith("-branch"),
  );
  const unique = new Map(imported.map((n) => [n.id, n]));
  const warnings: string[] = [
    "PDF exports may contain stale headlines or dates. Check each role before exporting. Imported roles replace the LinkedIn entries; manually maintained projects are retained.",
  ];
  if (unique.size !== imported.length)
    warnings.push(
      "Repeated organization/role entries were combined. Review the resulting dates.",
    );
  const normalizeDates = (value = "") =>
    value
      .toLowerCase()
      .replace(
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/g,
        (month) => month.slice(0, 3),
      )
      .replace(/\s*[-–]\s*/g, "-");
  for (const node of Array.from(unique.values())) {
    const orgKey = (org: string) =>
      slug(org.replace(/(?: at|,) Stevens Institute of Technology/i, ""));
    const incomingOrg = orgKey(node.detail.org || "");
    const old = base.nodes.find(
      (n) =>
        n.detail.org &&
        (orgKey(n.detail.org).includes(incomingOrg) ||
          incomingOrg.includes(orgKey(n.detail.org))) &&
        normalizeDates(n.detail.dates) !== normalizeDates(node.detail.dates),
    );
    if (old)
      warnings.push(
        `${node.label}: imported dates “${node.detail.dates || "unspecified"}” differ from existing dates “${old.detail.dates || "unspecified"}”.`,
      );
  }
  return {
    profile: makeProfile([
      center,
      ...branches,
      ...Array.from(unique.values()),
      ...manual,
    ]),
    warnings,
    roles: roleCount,
    education: educationCount,
  };
}
export function makeProfile(nodes: GraphNode[]): PortfolioData {
  const branches = new Map(
    nodes
      .filter((n) => n.id.endsWith("-branch"))
      .map((n) => [n.category, n.id]),
  );
  return {
    version: 1,
    nodes,
    edges: nodes
      .filter((n) => n.category !== "center")
      .map((n) => ({
        source: n.id.endsWith("-branch") ? "center" : branches.get(n.category)!,
        target: n.id,
      })),
  };
}
export function validateProfile(
  value: unknown,
): asserts value is PortfolioData {
  const p = value as PortfolioData;
  if (
    !p ||
    p.version !== 1 ||
    !Array.isArray(p.nodes) ||
    !Array.isArray(p.edges) ||
    p.nodes.length > 150
  )
    throw new Error("Invalid portfolio data.");
  const ids = new Set<string>();
  for (const n of p.nodes) {
    if (
      !n ||
      typeof n.id !== "string" ||
      !n.id.trim() ||
      ids.has(n.id) ||
      typeof n.label !== "string" ||
      !n.label.trim() ||
      ![
        "center",
        "ai",
        "quant",
        "engineering",
        "leadership",
        "education",
      ].includes(n.category) ||
      !n.detail ||
      !Array.isArray(n.detail.bullets ?? []) ||
      (n.detail.bullets ?? []).some((b) => typeof b !== "string")
    )
      throw new Error("Invalid or duplicate portfolio node.");
    if (
      n.detail.links &&
      (!Array.isArray(n.detail.links) ||
        n.detail.links.some(
          (l) =>
            !l || typeof l.href !== "string" || !/^https:\/\//.test(l.href),
        ))
    )
      throw new Error("Project links must use HTTPS.");
    ids.add(n.id);
  }
  if (
    !ids.has("center") ||
    p.nodes.filter((n) => n.category === "center").length !== 1 ||
    p.edges.some((e) => !e || !ids.has(e.source) || !ids.has(e.target))
  )
    throw new Error("Invalid graph connections.");
}
