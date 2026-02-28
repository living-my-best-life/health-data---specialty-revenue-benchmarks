"use client";

import { useState, useMemo } from "react";
import { formatExactCurrency, PAYER_COLORS, PAYER_SHORT, CPT_METADATA } from "@/lib/utils";

interface PayerRate {
  billing_code: string;
  payer: string;
  median_rate: number;
  p25_rate: number;
  p75_rate: number;
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
}

interface Props {
  data: PayerRate[];
  medicare: MedicareFee[];
}

export default function RateRangeChart({ data, medicare }: Props) {
  const codes = [...new Set(data.map((d) => d.billing_code))].sort();
  const [selectedCode, setSelectedCode] = useState(codes.includes("99214") ? "99214" : codes[0]);

  const medicareRate = useMemo(() => {
    const m = medicare.find((m) => m.hcpcs_code === selectedCode);
    return m?.non_facility_rate || 0;
  }, [medicare, selectedCode]);

  const rows = useMemo(() => {
    return data
      .filter((d) => d.billing_code === selectedCode)
      .sort((a, b) => b.median_rate - a.median_rate);
  }, [data, selectedCode]);

  const maxRate = useMemo(() => {
    return Math.max(...rows.map((r) => r.p75_rate), medicareRate) * 1.1;
  }, [rows, medicareRate]);

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
            Rate Variation (P25–P75)
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Interquartile range of negotiated rates
          </p>
        </div>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          style={{
            background: "#1a1a28",
            border: "1px solid #2a2a3e",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#e8e8ed",
            fontSize: 12,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {codes.map((c) => (
            <option key={c} value={c}>
              {CPT_METADATA[c]?.shortName || c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ position: "relative" }}>
        {/* Medicare reference line */}
        {medicareRate > 0 && (
          <div
            style={{
              position: "absolute",
              left: `${80 + ((medicareRate / maxRate) * (100 - 15))}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#ef4444",
              opacity: 0.6,
              zIndex: 5,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -16,
                left: -20,
                fontSize: 9,
                color: "#ef4444",
                whiteSpace: "nowrap",
              }}
            >
              Medicare
            </span>
          </div>
        )}

        {rows.map((r) => {
          const leftPct = (r.p25_rate / maxRate) * 100;
          const widthPct = ((r.p75_rate - r.p25_rate) / maxRate) * 100;
          const medianPct = (r.median_rate / maxRate) * 100;
          const color = PAYER_COLORS[r.payer] || "#6366f1";

          return (
            <div
              key={r.payer}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 80,
                  fontSize: 11,
                  color: "#c0c0d0",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {PAYER_SHORT[r.payer] || r.payer}
              </div>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: 24,
                  background: "#1a1a28",
                  borderRadius: 4,
                }}
              >
                {/* P25-P75 range bar */}
                <div
                  style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: 4,
                    height: 16,
                    background: color,
                    opacity: 0.3,
                    borderRadius: 3,
                  }}
                />
                {/* Median dot */}
                <div
                  style={{
                    position: "absolute",
                    left: `${medianPct}%`,
                    top: 6,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: color,
                    transform: "translateX(-50%)",
                    border: "2px solid #12121a",
                  }}
                />
              </div>
              <div
                style={{
                  width: 55,
                  fontSize: 10,
                  color: "#8888a0",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {formatExactCurrency(r.median_rate)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
