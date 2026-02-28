"use client";

import { useState, useMemo } from "react";
import { formatNumber, formatCurrency, shortenSpecialty, SPECIALTY_COLORS } from "@/lib/utils";

interface ProviderDensity {
  state: string;
  specialty: string;
  provider_count: number;
  total_benes: number;
  total_payments: number;
}

interface HPSAData {
  state: string;
  pc_shortage_areas: number;
  pc_total_shortage: number;
  mh_shortage_areas: number;
  mh_total_shortage: number;
}

interface Props {
  densityData: ProviderDensity[];
  hpsaData: HPSAData[];
}

export default function ProviderDensityTable({ densityData, hpsaData }: Props) {
  const specialties = useMemo(
    () => [...new Set(densityData.map((d) => d.specialty))].sort(),
    [densityData]
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0] || "Family Practice");
  const [sortBy, setSortBy] = useState<"state" | "density" | "providers" | "benes" | "shortage">("density");
  const [sortAsc, setSortAsc] = useState(false);

  const hpsaMap = useMemo(() => {
    const map = new Map<string, { pc: number; mh: number; pcShortage: number; mhShortage: number }>();
    hpsaData.forEach((d) => {
      map.set(d.state, {
        pc: d.pc_shortage_areas,
        mh: d.mh_shortage_areas,
        pcShortage: d.pc_total_shortage,
        mhShortage: d.mh_total_shortage,
      });
    });
    return map;
  }, [hpsaData]);

  const tableData = useMemo(() => {
    const rows = densityData
      .filter((d) => d.specialty === selectedSpecialty && d.total_benes > 0)
      .map((d) => {
        const hpsa = hpsaMap.get(d.state);
        return {
          state: d.state,
          provider_count: d.provider_count,
          total_benes: d.total_benes,
          total_payments: d.total_payments,
          density: (d.provider_count / d.total_benes) * 10000,
          shortageAreas: hpsa ? hpsa.pc + hpsa.mh : 0,
          totalShortage: hpsa ? hpsa.pcShortage + hpsa.mhShortage : 0,
        };
      });

    rows.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "state":
          cmp = a.state.localeCompare(b.state);
          break;
        case "density":
          cmp = a.density - b.density;
          break;
        case "providers":
          cmp = a.provider_count - b.provider_count;
          break;
        case "benes":
          cmp = a.total_benes - b.total_benes;
          break;
        case "shortage":
          cmp = a.shortageAreas - b.shortageAreas;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return rows;
  }, [densityData, selectedSpecialty, sortBy, sortAsc, hpsaMap]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  const median = useMemo(() => {
    const sorted = tableData.map((d) => d.density).sort((a, b) => a - b);
    return sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
  }, [tableData]);

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
            State Provider Reference
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Complete density data with HPSA shortage indicators — click headers to sort
          </p>
        </div>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
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
          {specialties.map((s) => (
            <option key={s} value={s}>
              {shortenSpecialty(s)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                { key: "state" as const, label: "State", align: "left" as const },
                { key: "density" as const, label: "Per 10K Benes", align: "right" as const },
                { key: "providers" as const, label: "Providers", align: "right" as const },
                { key: "benes" as const, label: "Beneficiaries", align: "right" as const },
                { key: "shortage" as const, label: "HPSA Shortages", align: "right" as const },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    textAlign: col.align,
                    padding: "10px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: sortBy === col.key ? "#a5b4fc" : "#8888a0",
                    borderBottom: "1px solid #1e1e2e",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span style={{ marginLeft: 4 }}>{sortAsc ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              <th
                style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#555568",
                  borderBottom: "1px solid #1e1e2e",
                }}
              >
                Density Bar
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => {
              const maxDensity = tableData.length > 0 ? Math.max(...tableData.map((d) => d.density)) : 1;
              const barWidth = maxDensity > 0 ? (row.density / maxDensity) * 100 : 0;
              return (
                <tr
                  key={row.state}
                  style={{
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#e8e8ed",
                      borderBottom: "1px solid #1a1a28",
                    }}
                  >
                    {row.state}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: row.density < median ? "#fca5a5" : "#86efac",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                    }}
                  >
                    {row.density.toFixed(1)}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#c0c0d0",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                    }}
                  >
                    {formatNumber(row.provider_count)}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#c0c0d0",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                    }}
                  >
                    {formatNumber(row.total_benes)}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: row.shortageAreas > 50 ? "#fca5a5" : "#8888a0",
                      textAlign: "right",
                      borderBottom: "1px solid #1a1a28",
                      fontWeight: row.shortageAreas > 50 ? 600 : 400,
                    }}
                  >
                    {row.shortageAreas > 0 ? row.shortageAreas : "—"}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #1a1a28",
                      width: 150,
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: "#1a1a28",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: "100%",
                          borderRadius: 4,
                          background:
                            row.density < median
                              ? "linear-gradient(90deg, #ef4444, #f87171)"
                              : `linear-gradient(90deg, ${SPECIALTY_COLORS[selectedSpecialty] || "#6366f1"}, ${SPECIALTY_COLORS[selectedSpecialty] || "#6366f1"}cc)`,
                        }}
                      />
                    </div>
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
