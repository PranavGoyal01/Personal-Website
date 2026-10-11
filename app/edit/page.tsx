"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  defaultProfile,
  CATEGORY_LABELS,
  Category,
} from "@/components/data/nodes";
import {
  ImportResult,
  makeProfile,
  parseLinkedInLines,
  validateProfile,
} from "@/lib/linkedin-import";
import { readLinkedInPdf } from "@/lib/read-linkedin-pdf";
const categories: Category[] = [
  "ai",
  "quant",
  "engineering",
  "leadership",
  "education",
];
export default function EditProfile() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(file: File) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const lines = await readLinkedInPdf(file);
      setResult(parseLinkedInLines(lines, defaultProfile));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The PDF could not be read.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  function update(id: string, field: string, value: string) {
    setResult((current) =>
      current
        ? {
            ...current,
            profile: makeProfile(
              current.profile.nodes.map((n) =>
                n.id !== id
                  ? n
                  : field === "category"
                    ? { ...n, category: value as Category }
                    : field === "label"
                      ? { ...n, label: value }
                      : {
                          ...n,
                          sublabel: field === "role" ? value : n.sublabel,
                          detail: {
                            ...n.detail,
                            [field]:
                              field === "bullets"
                                ? value.split("\n").filter(Boolean)
                                : value,
                          },
                        },
              ),
            ),
          }
        : current,
    );
  }
  function exportData(preview: boolean) {
    if (!result) return;
    setError("");
    try {
      validateProfile(result.profile);
      if (preview) {
        localStorage.setItem(
          "portfolio-preview-v1",
          JSON.stringify(result.profile),
        );
        setNotice(
          "Preview saved in this browser. Open the graph preview to review your changes.",
        );
      } else {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(result.profile, null, 2) + "\n"], {
            type: "application/json",
          }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "profile.json";
        a.click();
        URL.revokeObjectURL(url);
        setNotice(
          "Exported profile.json. Replace components/data/profile.json in GitHub, commit the file, and deploy the updated site to publish these nodes.",
        );
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not export your changes.",
      );
    }
  }
  return (
    <main className="import-page">
      <nav>
        <Link href="/">← Back to graph</Link>
      </nav>
      <h1>Update your connections.</h1>
      <p className="muted">
        Upload a LinkedIn profile PDF, review the extracted roles, then export
        the data for GitHub. The PDF stays in your browser and is never sent to
        a server.
      </p>
      <section className="upload-section">
        <label htmlFor="profile-pdf">LinkedIn profile PDF</label>
        <input
          ref={input}
          id="profile-pdf"
          type="file"
          accept="application/pdf,.pdf"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <p className="muted">
          Use LinkedIn → More → Save to PDF. Maximum 10 MB. Text-based exports
          only.
        </p>
      </section>
      <p aria-live="polite">{busy ? "Reading your profile…" : notice}</p>
      {error && (
        <p role="alert" className="import-error">
          {error}
        </p>
      )}
      {result && (
        <>
          <h2>
            Review {result.roles} roles and {result.education} education entries
          </h2>
          <p className="muted">
            Existing project nodes are retained. Contact details from the PDF
            are excluded. Changing data here does not change the public website.
          </p>
          <details className="import-warnings">
            <summary>Review notes ({result.warnings.length})</summary>
            <ul>
              {result.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </details>
          <div className="review-actions">
            <button onClick={() => exportData(true)}>Save graph preview</button>
            <Link href="/?preview=1" target="_blank">
              Open preview →
            </Link>
            <button onClick={() => exportData(false)}>
              Export profile.json
            </button>
          </div>
          <div className="review-nodes">
            {result.profile.nodes
              .filter((n) => !n.id.endsWith("-branch"))
              .map((n) => (
                <details key={n.id} data-review-node={n.id}>
                  <summary>
                    {n.label} <span className="muted">{n.sublabel}</span>
                  </summary>
                  <div className="review-fields">
                    <label>
                      Node label
                      <input
                        value={n.label}
                        onChange={(e) => update(n.id, "label", e.target.value)}
                      />
                    </label>
                    {n.category !== "center" && (
                      <label>
                        Topic
                        <select
                          value={n.category}
                          onChange={(e) =>
                            update(n.id, "category", e.target.value)
                          }
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label>
                      Role / degree
                      <input
                        value={n.detail.role || ""}
                        onChange={(e) => update(n.id, "role", e.target.value)}
                      />
                    </label>
                    <label>
                      Organization
                      <input
                        value={n.detail.org || ""}
                        onChange={(e) => update(n.id, "org", e.target.value)}
                      />
                    </label>
                    <label>
                      Dates
                      <input
                        value={n.detail.dates || ""}
                        onChange={(e) => update(n.id, "dates", e.target.value)}
                      />
                    </label>
                    <label>
                      Description (one bullet per line)
                      <textarea
                        rows={5}
                        value={n.detail.bullets?.join("\n") || ""}
                        onChange={(e) =>
                          update(n.id, "bullets", e.target.value)
                        }
                      />
                    </label>
                    {n.category !== "center" && (
                      <button
                        className="remove-node"
                        onClick={() =>
                          setResult((current) =>
                            current
                              ? {
                                  ...current,
                                  profile: makeProfile(
                                    current.profile.nodes.filter(
                                      (a) => a.id !== n.id,
                                    ),
                                  ),
                                }
                              : current,
                          )
                        }
                      >
                        Remove node
                      </button>
                    )}
                  </div>
                </details>
              ))}
          </div>
        </>
      )}
    </main>
  );
}
