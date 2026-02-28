"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

interface StateData {
  state: string;
  specialty: string;
  provider_count: number;
  total_payments: number;
  avg_payment: number;
}

interface Props {
  data: StateData[];
  specialties: string[];
}

const STATE_GRID: [string, number, number][] = [
  ["AK", 0, 0], ["ME", 0, 10],
  ["WI", 1, 5], ["VT", 1, 9], ["NH", 1, 10],
  ["WA", 2, 0], ["ID", 2, 1], ["MT", 2, 2], ["ND", 2, 3], ["MN", 2, 4],
  ["IL", 2, 5], ["MI", 2, 6], ["NY", 2, 7], ["MA", 2, 9], ["CT", 2, 10],
  ["OR", 3, 0], ["NV", 3, 1], ["WY", 3, 2], ["SD", 3, 3], ["IA", 3, 4],
  ["IN", 3, 5], ["OH", 3, 6], ["PA", 3, 7], ["NJ", 3, 8], ["RI", 3, 10],
  ["CA", 4, 0], ["UT", 4, 1], ["CO", 4, 2], ["NE", 4, 3], ["MO", 4, 4],
  ["KY", 4, 5], ["WV", 4, 6], ["VA", 4, 7], ["MD", 4, 8], ["DE", 4, 9],
  ["AZ", 5, 1], ["NM", 5, 2], ["KS", 5, 3], ["AR", 5, 4],
  ["TN", 5, 5], ["NC", 5, 6], ["SC", 5, 7], ["DC", 5, 8],
  ["OK", 6, 3], ["LA", 6, 4], ["MS", 6, 5], ["AL", 6, 6], ["GA", 6, 7],
  ["HI", 7, 0], ["TX", 7, 3], ["FL", 7, 7],
];

function getColor(value: number, min: number, max: number): string {
  if (max === min) return "#6366f1";
  const ratio = (value - min) / (max - min);
  if (ratio < 0.2) return "#1e1b4b";
  if (ratio < 0.4) return "#312e81";
  if (ratio < 0.6) return "#4338ca";
  if (ratio < 0.8) return "#6366f1";
  return "#818cf8";
}

export default function StateHeatmap({ data, specialties }: Props) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0] || "");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const map = new Map<string, StateData>();
    data
      .filter((d) => d.specialty === selectedSpecialty)
      .forEach((d) => map.set(d.state, d));
    return map;
  }, [data, selectedSpecialty]);

  const { min, max } = useMemo(() => {
    const values = Array.from(filtered.values()).map((d) => d.avg_payment);
    return {
      min: Math.min(...(values.length ? values : [0])),
      max: Math.max(...(values.length ? values : [1])),
    };
  }, [filtered]);

  const hoveredData = hoveredState ? filtered.get(hoveredState) : null;

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
            Geographic Payment Variation
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Average Medicare payment per provider by state
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

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(11, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            gap: 3,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {STATE_GRID.map(([state, row, col]) => {
            const stateData = filtered.get(state);
            const isHovered = hoveredState === state;
            return (
              <div
                key={state}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  aspectRatio: "1",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 600,
                  color: stateData ? "#e8e8ed" : "#555568",
                  background: stateData
                    ? getColor(stateData.avg_payment, min, max)
                    : "#1a1a28",
                  border: isHovered
                    ? "2px solid #a5b4fc"
                    : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  transform: isHovered ? "scale(1.15)" : "scale(1)",
                  zIndex: isHovered ? 10 : 1,
                }}
              >
                {state}
              </div>
            );
          })}
        </div>

        {hoveredData && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#1a1a28",
              border: "1px solid #2a2a3e",
              borderRadius: 8,
              padding: "12px 16px",
              minWidth: 180,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: "#e8e8ed" }}>
              {hoveredData.state}
            </p>
            <p style={{ fontSize: 12, color: "#a5b4fc", marginTop: 4 }}>
              Avg: {formatCurrency(hoveredData.avg_payment)}
            </p>
            <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
              {hoveredData.provider_count.toLocaleString()} providers
            </p>
            <p style={{ fontSize: 11, color: "#8888a0" }}>
              Total: {formatCurrency(hoveredData.total_payments)}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 10, color: "#8888a0" }}>
            {formatCurrency(min)}
          </span>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background:
                "linear-gradient(to right, #1e1b4b, #312e81, #4338ca, #6366f1, #818cf8)",
            }}
          />
          <span style={{ fontSize: 10, color: "#8888a0" }}>
            {formatCurrency(max)}
          </span>
        </div>
      </div>
    </div>
  );
}
