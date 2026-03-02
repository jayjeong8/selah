"use client";

import { useCallback, useState } from "react";

const PROXY = "/api/youversion";

interface TestResult {
  label: string;
  status: "idle" | "loading" | "success" | "error";
  data?: unknown;
  error?: string;
  elapsed?: number;
}

const TESTS = [
  {
    id: "ko-bibles",
    label: "1. Korean Bible versions list",
    path: "bibles?language_ranges[]=ko",
  },
  {
    id: "krv-detail",
    label: "2. KRV (88) details",
    path: "bibles/88",
  },
  {
    id: "krv-index",
    label: "3. KRV (88) index (books/chapters)",
    path: "bibles/88/index",
  },
  {
    id: "krv-gen1-text",
    label: "4. KRV Genesis 1 (text format)",
    path: "bibles/88/passages/GEN.1?format=text",
  },
  {
    id: "krv-gen1-html",
    label: "5. KRV Genesis 1 (html format)",
    path: "bibles/88/passages/GEN.1?format=html",
  },
  {
    id: "krv-gen1-1",
    label: "6. KRV Genesis 1:1 (single verse)",
    path: "bibles/88/passages/GEN.1.1?format=text",
  },
  {
    id: "krv-gen1-verses",
    label: "7. KRV Genesis 1 verse list",
    path: "bibles/88/books/GEN/chapters/1/verses",
  },
  {
    id: "rnksv-gen1-1",
    label: "8. RNKSV/새번역 (142) Genesis 1:1",
    path: "bibles/142/passages/GEN.1.1?format=text",
  },
  {
    id: "klb-gen1-1",
    label: "9. KLB/현대인의 성경 (86) Genesis 1:1",
    path: "bibles/86/passages/GEN.1.1?format=text",
  },
  {
    id: "wb-gen1-1",
    label: "10. WB/우리말성경 (4639) Genesis 1:1",
    path: "bibles/4639/passages/GEN.1.1?format=text",
  },
  {
    id: "krv-psa119-text",
    label: "11. KRV Psalm 119 (longest chapter, text)",
    path: "bibles/88/passages/PSA.119?format=text",
  },
  {
    id: "all-bibles",
    label: "12. All available Bibles (full list)",
    path: "bibles?page_size=*",
  },
] as const;

export default function YouVersionTestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const runTest = useCallback(async (id: string, path: string, label: string) => {
    setResults((prev) => ({
      ...prev,
      [id]: { label, status: "loading" },
    }));

    const start = performance.now();
    try {
      const res = await fetch(`${PROXY}/${path}`);
      const elapsed = Math.round(performance.now() - start);
      const data = await res.json();

      if (!res.ok) {
        setResults((prev) => ({
          ...prev,
          [id]: {
            label,
            status: "error",
            error: `HTTP ${res.status}: ${JSON.stringify(data)}`,
            elapsed,
          },
        }));
      } else {
        setResults((prev) => ({
          ...prev,
          [id]: { label, status: "success", data, elapsed },
        }));
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setResults((prev) => ({
        ...prev,
        [id]: { label, status: "error", error: String(err), elapsed },
      }));
    }
  }, []);

  const runAll = useCallback(async () => {
    for (const test of TESTS) {
      await runTest(test.id, test.path, test.label);
    }
  }, [runTest]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>YouVersion API Test</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
        Proxy: <code>{PROXY}</code> → <code>api.youversion.com/v1</code>
      </p>

      <button
        type="button"
        onClick={runAll}
        style={{
          padding: "8px 20px",
          fontSize: 14,
          fontWeight: 600,
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        Run All Tests
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TESTS.map((test) => {
          const result = results[test.id];
          const isExpanded = expandedId === test.id;

          return (
            <div
              key={test.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "#fafafa",
                }}
              >
                <button
                  type="button"
                  onClick={() => runTest(test.id, test.path, test.label)}
                  style={{
                    padding: "4px 12px",
                    fontSize: 12,
                    background: "#eee",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Run
                </button>

                <span style={{ fontSize: 13, flex: 1 }}>{test.label}</span>

                <StatusBadge status={result?.status} elapsed={result?.elapsed} />

                {result?.data && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : test.id)}
                    style={{
                      padding: "2px 8px",
                      fontSize: 11,
                      background: "transparent",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {isExpanded ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {result?.error && (
                <div
                  style={{
                    padding: "8px 14px",
                    fontSize: 12,
                    color: "#c00",
                    background: "#fff5f5",
                  }}
                >
                  {result.error}
                </div>
              )}

              {isExpanded && result?.data && (
                <pre
                  style={{
                    padding: 14,
                    fontSize: 11,
                    lineHeight: 1.5,
                    background: "#1a1a2e",
                    color: "#eee",
                    overflow: "auto",
                    maxHeight: 500,
                    margin: 0,
                  }}
                >
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status, elapsed }: { status?: string; elapsed?: number }) {
  if (!status || status === "idle") return null;

  const styles: Record<string, { bg: string; color: string; text: string }> = {
    loading: { bg: "#fff3cd", color: "#856404", text: "Loading..." },
    success: { bg: "#d4edda", color: "#155724", text: `OK${elapsed ? ` (${elapsed}ms)` : ""}` },
    error: { bg: "#f8d7da", color: "#721c24", text: `Error${elapsed ? ` (${elapsed}ms)` : ""}` },
  };

  const s = styles[status];
  if (!s) return null;

  return (
    <span
      style={{
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        borderRadius: 4,
        flexShrink: 0,
      }}
    >
      {s.text}
    </span>
  );
}
