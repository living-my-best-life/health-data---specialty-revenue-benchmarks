"use client";

import { useMemo } from "react";
import { formatExactCurrency, PAYER_SHORT, CPT_METADATA } from "@/lib/utils";

interface PayerRate {
  billing_code: string;
  payer: string;
  median_rate: number;
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
}

interface Props {
  data: PayerRate[];
  medicare: MedicareFee[];
}

function getCellColor(pctOfMedicare: number): string {
  if (pctOfMedicare >= 180) return "rgba(34,197,94,0.5)";
  if (pctOfMedicare >= 140) return "rgba(34,197,94,0.35)";
  if (pctOfMedicare >= 120) return "rgba(34,197,94,0.2)";
  if (pctOfMedicare >= 105) return "rgba(34,197,94,0.1)";
  if (pctOfMedicare >= 95) return "transparent";
  if (pctOfMedicare >= 80) return "rgba(239,68,68,0.1)";
  if (pctOfMedicare >= 60) return "rgba(239,68,68,0.2)";
  return "rgba(239,68,68,0.35)";
}

function getCellTextColor(pctOfMedicare: number): string {
  if (pctOfMedicare >= 120) return "#86efac";
  if (pctOfMedicare >= 95) return "#c0c0d0";
  return "#fca5a5";
}

export default function RateSpreadHeatmap({ data, medicare }: Props) {
  const codes = useMemo(() => {
    return [...new Set(data.map((d) => d.billing_code))].sort();
  }, [data]);

  const payers = useMemo(() => {
    return [...new Set(data.map((d) => d.payer))].sort();
  }, [data]);

  const medicareMap = useMemo(() => {
    const map = new Map<string, number>();
    medicare.forEach((m) => map.set(m.hcpcs_code, m.non_facility_rate));
    return map;
  }, [medicare]);

  const rateMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(`${d.billing_code}|${d.payer}`, d.median_rate));
    return map;
  }, [data]);

  const specialtyGroups = useMemo(() => {
    const groups: { label: string; codes: string[] }[] = [];
    const seen = new Set<string>();
    codes.forEach((c) => {
      const spec = CPT_METADATA[c]?.specialty || "Other";
      if (!seen.has(spec)) {
        seen.add(spec);
        groups.push({ label: spec, codes: codes.filter((cc) => (CPT_METADATA[cc]?.specialty || "Other") === spec) });
      }
    });
    return groups;
  }, [codes]);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
        Rate Comparison Matrix
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 20 }}>
        Median negotiated rates — colored by % of Medicare (green = above, red = below)
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#8888a0",
                  borderBottom: "1px solid #1e1e2e",
                  position: "sticky",
                  left: 0,
                  background: "#12121a",
                  zIndex: 2,
                  minWidth: 140,
                }}
              >
                Procedure
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "8px 8px",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#ef4444",
                  borderBottom: "1px solid #1e1e2e",
                  whiteSpace: "nowrap",
                }}
              >
                Medicare
              </th>
              {payers.map((p) => (
                <th
                  key={p}
                  style={{
                    textAlign: "right",
                    padding: "8px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#8888a0",
                    borderBottom: "1px solid #1e1e2e",
                    whiteSpace: "nowrap",
                  }}
                >
                  {PAYER_SHORT[p] || p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specialtyGroups.map((group) =>
              group.codes.map((code, idx) => {
                const mcr = medicareMap.get(code) || 0;
                return (
                  <tr key={code}>
                    <td
                      style={{
                        padding: "10px 12px",
                        fontSize: 11,
                        color: "#e8e8ed",
                        borderBottom: "1px solid #1a1a28",
                        position: "sticky",
                        left: 0,
                        background: "#12121a",
                        zIndex: 1,
                        borderTop: idx === 0 ? "1px solid #2a2a3e" : undefined,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {CPT_METADATA[code]?.shortName || code}
                      </span>
                      <span style={{ color: "#555568", marginLeft: 6, fontSize: 10 }}>
                        {code}
                      </span>
                      {idx === 0 && (
                        <div style={{ fontSize: 9, color: "#6366f1", marginTop: 2 }}>
                          {group.label}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 12,
                        color: "#ef4444",
                        textAlign: "right",
                        borderBottom: "1px solid #1a1a28",
                        fontWeight: 500,
                        borderTop: idx === 0 ? "1px solid #2a2a3e" : undefined,
                      }}
                    >
                      {mcr > 0 ? formatExactCurrency(mcr) : "—"}
                    </td>
                    {payers.map((p) => {
                      const rate = rateMap.get(`${code}|${p}`);
                      const pct = rate && mcr > 0 ? (rate / mcr) * 100 : 100;
                      return (
                        <td
                          key={p}
                          style={{
                            padding: "10px 8px",
                            fontSize: 12,
                            textAlign: "right",
                            borderBottom: "1px solid #1a1a28",
                            fontWeight: 500,
                            background: rate ? getCellColor(pct) : "transparent",
                            color: rate ? getCellTextColor(pct) : "#555568",
                            borderTop: idx === 0 ? "1px solid #2a2a3e" : undefined,
                          }}
                        >
                          {rate ? formatExactCurrency(rate) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 16,
          fontSize: 10,
          color: "#8888a0",
        }}
      >
        <span>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "rgba(239,68,68,0.25)", marginRight: 4, verticalAlign: "middle" }} />
          Below Medicare
        </span>
        <span>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "transparent", border: "1px solid #2a2a3e", marginRight: 4, verticalAlign: "middle" }} />
          Near Parity
        </span>
        <span>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "rgba(34,197,94,0.3)", marginRight: 4, verticalAlign: "middle" }} />
          Above Medicare
        </span>
      </div>
    </div>
  );
}
