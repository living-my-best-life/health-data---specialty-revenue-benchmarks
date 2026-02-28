"use client";

import { useMemo } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface SpendingData {
  brnd_name: string;
  gnrc_name: string;
  tot_spndng: number;
  tot_clms: number;
  tot_benes: number;
  period_start: string;
  period_end: string;
}

interface Props {
  data: SpendingData[];
}

const BRAND_COLORS: Record<string, string> = {
  Ozempic: "#6366f1",
  Mounjaro: "#22c55e",
  Rybelsus: "#06b6d4",
  Wegovy: "#a855f7",
  Zepbound: "#f97316",
};

export default function GLP1BrandTable({ data }: Props) {
  const rows = useMemo(() => {
    const brands = [...new Set(data.map((d) => d.brnd_name))];
    return brands.map((brand) => {
      const annual2024 = data.find(
        (d) => d.brnd_name === brand && d.period_start === "2024-01-01" && d.period_end === "2024-12-31"
      );
      const h1_2025 = data.find(
        (d) => d.brnd_name === brand && d.period_start === "2025-01-01" && d.period_end === "2025-06-30"
      );
      const gnrc = data.find((d) => d.brnd_name === brand)?.gnrc_name || "";
      const spending2024 = annual2024?.tot_spndng || 0;
      const spendingH1 = h1_2025?.tot_spndng || 0;
      const annualized2025 = spendingH1 * 2;
      const growth = spending2024 > 0 ? ((annualized2025 - spending2024) / spending2024) * 100 : 0;
      const claims2024 = annual2024?.tot_clms || 0;
      const benes2024 = annual2024?.tot_benes || 0;
      const costPerClaim = claims2024 > 0 ? spending2024 / claims2024 : 0;
      const costPerBene = benes2024 > 0 ? spending2024 / benes2024 : 0;
      return {
        brand,
        gnrc,
        spending2024,
        annualized2025,
        growth,
        claims2024,
        benes2024,
        costPerClaim,
        costPerBene,
        benesH1: h1_2025?.tot_benes || 0,
      };
    }).sort((a, b) => b.spending2024 - a.spending2024);
  }, [data]);

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
        Brand Comparison
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 20 }}>
        Head-to-head Medicare Part D metrics for all GLP-1 brands
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Brand", "Class", "2024 Spending", "2025 (Ann.)", "Growth", "Claims", "Beneficiaries", "$/Claim", "$/Beneficiary"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: h === "Brand" || h === "Class" ? "left" : "right",
                      padding: "10px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#8888a0",
                      borderBottom: "1px solid #1e1e2e",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.brand}>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: BRAND_COLORS[r.brand] || "#e8e8ed",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  {r.brand}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 11,
                    color: "#8888a0",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  {r.gnrc}
                </td>
                {[
                  formatCurrency(r.spending2024),
                  formatCurrency(r.annualized2025),
                ].map((v, i) => (
                  <td
                    key={i}
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#e8e8ed",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </td>
                ))}
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    textAlign: "right",
                    borderBottom: "1px solid #1a1a28",
                    fontWeight: 600,
                    color: r.growth > 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {r.growth > 0 ? "+" : ""}
                  {r.growth.toFixed(0)}%
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#c0c0d0",
                    textAlign: "right",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  {formatNumber(r.claims2024)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#c0c0d0",
                    textAlign: "right",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  {formatNumber(r.benes2024)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#c0c0d0",
                    textAlign: "right",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  ${r.costPerClaim.toFixed(0)}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#c0c0d0",
                    textAlign: "right",
                    borderBottom: "1px solid #1a1a28",
                  }}
                >
                  ${r.costPerBene.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
