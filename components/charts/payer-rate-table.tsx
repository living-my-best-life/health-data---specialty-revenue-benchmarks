"use client";

import { useState, useMemo } from "react";
import { formatExactCurrency, PAYER_SHORT, CPT_METADATA } from "@/lib/utils";

interface PayerRate {
  billing_code: string;
  payer: string;
  median_rate: number;
  sample_size: number;
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
}

interface Props {
  data: PayerRate[];
  medicare: MedicareFee[];
}

export default function PayerRateTable({ data, medicare }: Props) {
  const specialtyGroups = useMemo(() => {
    const groups = new Set<string>();
    groups.add("All");
    data.forEach((d) => {
      const spec = CPT_METADATA[d.billing_code]?.specialty;
      if (spec) groups.add(spec);
    });
    return [...groups];
  }, [data]);

  const [selectedGroup, setSelectedGroup] = useState("All");
  const [sortBy, setSortBy] = useState<string>("code");

  const payers = useMemo(() => [...new Set(data.map((d) => d.payer))].sort(), [data]);

  const medicareMap = useMemo(() => {
    const map = new Map<string, number>();
    medicare.forEach((m) => map.set(m.hcpcs_code, m.non_facility_rate));
    return map;
  }, [medicare]);

  const rateMap = useMemo(() => {
    const map = new Map<string, PayerRate>();
    data.forEach((d) => map.set(`${d.billing_code}|${d.payer}`, d));
    return map;
  }, [data]);

  const codes = useMemo(() => {
    let filtered = [...new Set(data.map((d) => d.billing_code))];
    if (selectedGroup !== "All") {
      filtered = filtered.filter((c) => CPT_METADATA[c]?.specialty === selectedGroup);
    }
    if (sortBy === "code") {
      filtered.sort();
    } else if (sortBy === "medicare") {
      filtered.sort((a, b) => (medicareMap.get(b) || 0) - (medicareMap.get(a) || 0));
    } else {
      // Sort by a specific payer
      filtered.sort((a, b) => {
        const rateA = rateMap.get(`${a}|${sortBy}`)?.median_rate || 0;
        const rateB = rateMap.get(`${b}|${sortBy}`)?.median_rate || 0;
        return rateB - rateA;
      });
    }
    return filtered;
  }, [data, selectedGroup, sortBy, medicareMap, rateMap]);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
            Complete Rate Reference
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            All procedures and payers — click column headers to sort
          </p>
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          style={{
            background: "#1a1a28",
            border: "1px solid #2a2a3e",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e8e8ed",
            fontSize: 13,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {specialtyGroups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr>
              <th
                onClick={() => setSortBy("code")}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: sortBy === "code" ? "#a5b4fc" : "#8888a0",
                  borderBottom: "1px solid #1e1e2e",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Procedure
              </th>
              <th
                onClick={() => setSortBy("medicare")}
                style={{
                  textAlign: "right",
                  padding: "10px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: sortBy === "medicare" ? "#a5b4fc" : "#ef4444",
                  borderBottom: "1px solid #1e1e2e",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Medicare
              </th>
              {payers.map((p) => (
                <th
                  key={p}
                  onClick={() => setSortBy(p)}
                  style={{
                    textAlign: "right",
                    padding: "10px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: sortBy === p ? "#a5b4fc" : "#8888a0",
                    borderBottom: "1px solid #1e1e2e",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {PAYER_SHORT[p] || p}
                </th>
              ))}
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#22c55e",
                  borderBottom: "1px solid #1e1e2e",
                  whiteSpace: "nowrap",
                }}
              >
                Best
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ef4444",
                  borderBottom: "1px solid #1e1e2e",
                  whiteSpace: "nowrap",
                }}
              >
                Worst
              </th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code, i) => {
              const mcr = medicareMap.get(code) || 0;
              const payerRates = payers
                .map((p) => ({
                  payer: p,
                  rate: rateMap.get(`${code}|${p}`)?.median_rate || 0,
                }))
                .filter((r) => r.rate > 0);
              const best = payerRates.length > 0 ? payerRates.reduce((a, b) => (b.rate > a.rate ? b : a)) : null;
              const worst = payerRates.length > 0 ? payerRates.reduce((a, b) => (b.rate < a.rate ? b : a)) : null;

              return (
                <tr
                  key={code}
                  style={{
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#e8e8ed",
                      borderBottom: "1px solid #1a1a28",
                      fontWeight: 500,
                    }}
                  >
                    {CPT_METADATA[code]?.shortName || code}
                    <span style={{ color: "#555568", marginLeft: 6, fontSize: 10 }}>
                      {code}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 12,
                      color: "#ef4444",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                      fontWeight: 500,
                    }}
                  >
                    {mcr > 0 ? formatExactCurrency(mcr) : "—"}
                  </td>
                  {payers.map((p) => {
                    const entry = rateMap.get(`${code}|${p}`);
                    const rate = entry?.median_rate || 0;
                    const isBest = best && p === best.payer;
                    const isWorst = worst && p === worst.payer;
                    return (
                      <td
                        key={p}
                        style={{
                          padding: "10px 8px",
                          fontSize: 12,
                          textAlign: "right",
                          borderBottom: "1px solid #1a1a28",
                          fontWeight: 500,
                          color: rate > 0
                            ? mcr > 0
                              ? rate >= mcr
                                ? "#86efac"
                                : "#fca5a5"
                              : "#c0c0d0"
                            : "#555568",
                          background: isBest
                            ? "rgba(34,197,94,0.1)"
                            : isWorst
                            ? "rgba(239,68,68,0.1)"
                            : "transparent",
                        }}
                      >
                        {rate > 0 ? formatExactCurrency(rate) : "—"}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 11,
                      textAlign: "center",
                      borderBottom: "1px solid #1a1a28",
                      color: "#22c55e",
                    }}
                  >
                    {best ? PAYER_SHORT[best.payer] || best.payer : "—"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 11,
                      textAlign: "center",
                      borderBottom: "1px solid #1a1a28",
                      color: "#ef4444",
                    }}
                  >
                    {worst ? PAYER_SHORT[worst.payer] || worst.payer : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
