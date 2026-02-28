"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface ProcedureData {
  specialty: string;
  hcpcs_cd: string;
  hcpcs_desc: string;
  total_services: number;
  total_beneficiaries: number;
  weighted_avg_payment: number;
  num_providers: number;
}

interface Props {
  data: ProcedureData[];
  specialties: string[];
}

type SortKey = "total_services" | "weighted_avg_payment" | "num_providers" | "total_beneficiaries";

export default function ProcedureTable({ data, specialties }: Props) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0] || "");
  const [sortBy, setSortBy] = useState<SortKey>("total_services");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    return data
      .filter((d) => d.specialty === selectedSpecialty)
      .sort((a, b) =>
        sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
      );
  }, [data, selectedSpecialty, sortBy, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortBy !== key) return " ↕";
    return sortDir === "desc" ? " ↓" : " ↑";
  };

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
            Top Procedures by Specialty
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Most common HCPCS codes by total Medicare services rendered
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
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Code</th>
              <th style={{ ...thStyle, textAlign: "left" }}>Description</th>
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => handleSort("total_services")}
              >
                Total Services{sortIcon("total_services")}
              </th>
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => handleSort("weighted_avg_payment")}
              >
                Avg Payment{sortIcon("weighted_avg_payment")}
              </th>
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => handleSort("num_providers")}
              >
                Providers{sortIcon("num_providers")}
              </th>
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => handleSort("total_beneficiaries")}
              >
                Beneficiaries{sortIcon("total_beneficiaries")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={row.hcpcs_cd}
                style={{
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                }}
              >
                <td style={tdStyle}>
                  <span
                    style={{
                      background: "rgba(99, 102, 241, 0.12)",
                      color: "#a5b4fc",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "monospace",
                    }}
                  >
                    {row.hcpcs_cd}
                  </span>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    maxWidth: 300,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.hcpcs_desc}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatNumber(row.total_services)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right", color: "#22c55e" }}>
                  {formatCurrency(row.weighted_avg_payment)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatNumber(row.num_providers)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatNumber(row.total_beneficiaries)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "#6b6b80" }}>
                  No procedure data available for this specialty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#8888a0",
  borderBottom: "1px solid #1e1e2e",
  textAlign: "right",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
  color: "#c0c0d0",
  borderBottom: "1px solid rgba(30,30,46,0.5)",
};
