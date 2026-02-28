"use client";

import { useState, useMemo } from "react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface StateData {
  state: string;
  generic_name: string;
  total_claims: number;
  total_cost: number;
  total_benes: number;
}

interface Props {
  data: StateData[];
}

const STATE_ABBR: Record<string, string> = {
  Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",
  Connecticut:"CT",Delaware:"DE","District of Columbia":"DC",Florida:"FL",Georgia:"GA",
  Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",
  Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",
  Mississippi:"MS",Missouri:"MO",Montana:"MT",Nebraska:"NE",Nevada:"NV",
  "New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY",
  "North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",
  Pennsylvania:"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",
  Tennessee:"TN",Texas:"TX",Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA",
  "West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY",
};

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
  if (max === min) return "#22c55e";
  const ratio = (value - min) / (max - min);
  if (ratio < 0.2) return "#052e16";
  if (ratio < 0.4) return "#14532d";
  if (ratio < 0.6) return "#166534";
  if (ratio < 0.8) return "#16a34a";
  return "#22c55e";
}

export default function GLP1GeoHeatmap({ data }: Props) {
  const [drugClass, setDrugClass] = useState("Semaglutide");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateMap = useMemo(() => {
    const map = new Map<string, StateData>();
    data
      .filter((d) => d.generic_name === drugClass)
      .forEach((d) => {
        const abbr = STATE_ABBR[d.state];
        if (abbr) map.set(abbr, d);
      });
    return map;
  }, [data, drugClass]);

  const { min, max } = useMemo(() => {
    const values = Array.from(stateMap.values()).map((d) => d.total_claims);
    return {
      min: Math.min(...(values.length ? values : [0])),
      max: Math.max(...(values.length ? values : [1])),
    };
  }, [stateMap]);

  const hoveredData = hoveredState ? stateMap.get(hoveredState) : null;

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
            Geographic Demand
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            GLP-1 prescription claims by state, 2023
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Semaglutide", "Tirzepatide"].map((dc) => (
            <button
              key={dc}
              onClick={() => setDrugClass(dc)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: drugClass === dc ? "#22c55e" : "#2a2a3e",
                background: drugClass === dc ? "rgba(34,197,94,0.15)" : "transparent",
                color: drugClass === dc ? "#86efac" : "#8888a0",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {dc}
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
                  background: sd ? getColor(sd.total_claims, min, max) : "#1a1a28",
                  border: isHovered ? "2px solid #86efac" : "1px solid transparent",
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
            <p style={{ fontSize: 12, color: "#22c55e", marginTop: 4 }}>
              {formatNumber(hoveredData.total_claims)} claims
            </p>
            <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
              {formatNumber(hoveredData.total_benes)} beneficiaries
            </p>
            <p style={{ fontSize: 11, color: "#8888a0" }}>
              Total: {formatCurrency(hoveredData.total_cost)}
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
            {formatNumber(min)}
          </span>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background: "linear-gradient(to right, #052e16, #14532d, #166534, #16a34a, #22c55e)",
            }}
          />
          <span style={{ fontSize: 10, color: "#8888a0" }}>
            {formatNumber(max)}
          </span>
        </div>
      </div>
    </div>
  );
}
