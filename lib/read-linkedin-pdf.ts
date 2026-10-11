import type { PdfLine } from "./linkedin-import";
export async function readLinkedInPdf(file: File): Promise<PdfLine[]> {
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Choose a PDF smaller than 10 MB.");
  const buffer = await file.arrayBuffer();
  if (new TextDecoder().decode(buffer.slice(0, 5)) !== "%PDF-")
    throw new Error("Choose a valid PDF file.");
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const task = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
  });
  try {
    const doc = await task.promise;
    if (doc.numPages > 30)
      throw new Error(
        "This export has too many pages. Choose a LinkedIn profile PDF with up to 30 pages.",
      );
    const result: PdfLine[] = [];
    let cutoff = 0;
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.filter(
        (i): i is import("pdfjs-dist/types/src/display/api").TextItem =>
          "str" in i && !!i.str.trim(),
      );
      if (pageNumber === 1) {
        const experience = items.find((i) => i.str.trim() === "Experience");
        if (
          experience &&
          items.some(
            (i) =>
              i.str.trim() === "Contact" &&
              i.transform[4] < experience.transform[4] - 80,
          )
        )
          cutoff = experience.transform[4] - 5;
      }
      const rows: { y: number; items: typeof items }[] = [];
      for (const item of items
        .filter((i) => i.transform[4] >= cutoff)
        .sort(
          (a, b) =>
            b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4],
        )) {
        const y = item.transform[5];
        const row = rows.find((r) => Math.abs(r.y - y) < 2);
        if (row) row.items.push(item);
        else rows.push({ y, items: [item] });
      }
      result.push(
        ...rows.map((row) => ({
          text: row.items
            .sort((a, b) => a.transform[4] - b.transform[4])
            .map((i) => i.str)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim(),
          x: Math.min(...row.items.map((i) => i.transform[4])),
          y: row.y,
          size: Math.max(...row.items.map((i) => Math.abs(i.transform[0]))),
          page: pageNumber,
        })),
      );
    }
    if (!result.length)
      throw new Error(
        "No readable text was found. Scanned/image PDFs are not supported; use LinkedIn’s Save to PDF export.",
      );
    return result;
  } finally {
    await task.destroy();
  }
}
