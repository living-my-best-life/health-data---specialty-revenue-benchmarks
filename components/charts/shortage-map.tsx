"use client";

import { useState, useMemo } from "react";
import { formatNumber } from "@/lib/utils";

interface HPSAData {
  state: string;
  pc_shortage_areas: number;
  pc_total_shortage: number;
  mh_shortage_areas: number;
  mh_total_shortage: number;
}

interface Props {
  data: HPSAData[];
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

function getRedColor(value: number, min: number, max: number): string {
  if (max === min) return "#ef4444";
  const ratio = (value - min) / (max - min);
  if (ratio < 0.15) return "#1c1917";
  if (ratio < 0.3) return "#451a03";
  if (ratio < 0.45) return "#7c2d12";
  if (ratio < 0.6) return "#b91c1c";
  if (ratio < 0.75) return "#dc2626";
  if (ratio < 0.9) return "#ef4444";
  return "#fca5a5";
}

export default function ShortageMap({ data }: Props) {
  const [shortageType, setShortageType] = useState<"pc" | "mh">("pc");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateMap = useMemo(() => {
    const map = new Map<string, { areas: number; shortage: number; raw: HPSAData }>();
    data.forEach((d) => {
      const areas = shortageType === "pc" ? d.pc_shortage_areas : d.mh_shortage_areas;
      const shortage = shortageType === "pc" ? d.pc_total_shortage : d.mh_total_shortage;
      map.set(d.state, { areas, shortage, raw: d });
    });
    return map;
  }, [data, shortageType]);

  const { min, max } = useMemo(() => {
    const values = Array.from(stateMap.values())
      .map((d) => d.areas)
      .filter((v) => v > 0);
    return {
      min: Math.min(...(values.length ? values : [0])),
      max: Math.max(...(values.length ? values : [1])),
    };
  }, [stateMap]);

  const hoveredData = hoveredState ? stateMap.get(hoveredState) : null;

  const totalShortageAreas = useMemo(
    () => Array.from(stateMap.values()).reduce((s, d) => s + d.areas, 0),
    [stateMap]
  );

  const totalShortage = useMemo(
    () => Array.from(stateMap.values()).reduce((s, d) => s + d.shortage, 0),
    [stateMap]
  );

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
            HPSA Shortage Areas
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            {formatNumber(totalShortageAreas)} designated shortage areas &middot;{" "}
            {formatNumber(Math.round(totalShortage))} providers needed
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { key: "pc" as const, label: "Primary Care" },
            { key: "mh" as const, label: "Mental Health" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setShortageType(t.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: shortageType === t.key ? "#ef4444" : "#2a2a3e",
                background: shortageType === t.key ? "rgba(239,68,68,0.15)" : "transparent",
                color: shortageType === t.key ? "#fca5a5" : "#8888a0",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
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
            const sd = stateMap.get(state);
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
                  color: sd ? "#e8e8ed" : "#555568",
                  background: sd
                    ? getRedColor(sd.areas, min, max)
                    : "#1a1a28",
                  border: isHovered ? "2px solid #fca5a5" : "1px solid transparent",
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
              minWidth: 200,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: "#e8e8ed" }}>
              {hoveredState}
            </p>
            <p style={{ fontSize: 13, color: "#fca5a5", marginTop: 6 }}>
              {hoveredData.areas} shortage areas
            </p>
            <p style={{ fontSize: 11, color: "#8888a0", marginTop: 4 }}>
              {Math.round(hoveredData.shortage)} providers needed
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
          <span style={{ fontSize: 10, color: "#8888a0" }}>Few</span>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background:
                "linear-gradient(to right, #1c1917, #451a03, #7c2d12, #b91c1c, #dc2626, #ef4444, #fca5a5)",
            }}
          />
          <span style={{ fontSize: 10, color: "#8888a0" }}>Many</span>
        </div>
      </div>
    </div>
  );
}
