"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AVOIDABLE_DATA = [
  { category: "Non-Emergent", pct: 13, color: "#22c55e", description: "Treatable at urgent care or primary care" },
  { category: "Emergent but Preventable", pct: 14, color: "#eab308", description: "Could have been prevented with better access" },
  { category: "True Emergency", pct: 58, color: "#ef4444", description: "Required emergency department care" },
  { category: "Injury", pct: 12, color: "#f97316", description: "Trauma or injury cases" },
  { category: "Mental Health / Substance", pct: 3, color: "#a855f7", description: "Psychiatric, alcohol, or drug-related" },
];

const TOTAL_ED_VISITS = 130_000_000; // ~130M annual ED visits nationally
const AVG_ED_COST = 1228; // From MEPS data
const AVG_UC_COST = 150; // Industry average for UC visit

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "#1a1a28",
        border: "1px solid #2a2a3e",
        borderRadius: 8,
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: d.color }}>
        {d.category}
      </p>
      <p style={{ fontSize: 12, color: "#e8e8ed", marginTop: 4 }}>
        {d.pct}% of ED visits
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        {d.description}
      </p>
    </div>
  );
}

export default function AvoidableVisitsChart() {
  const avoidablePct = AVOIDABLE_DATA[0].pct + AVOIDABLE_DATA[1].pct;
  const avoidableVisits = TOTAL_ED_VISITS * (avoidablePct / 100);
  const potentialSavings = avoidableVisits * (AVG_ED_COST - AVG_UC_COST);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
          ED Visit Classification
        </h3>
        <p style={{ fontSize: 12, color: "#8888a0" }}>
          Based on NYU ED Algorithm — percentage of visits by urgency category
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 200, height: 200, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={AVOIDABLE_DATA}
                dataKey="pct"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {AVOIDABLE_DATA.map((d) => (
                  <Cell key={d.category} fill={d.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>
              {avoidablePct}%
            </p>
            <p style={{ fontSize: 9, color: "#8888a0" }}>Avoidable</p>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {AVOIDABLE_DATA.map((d) => (
            <div
              key={d.category}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: d.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#c0c0d0" }}>{d.category}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.pct}%</span>
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: "#1e1e2e",
                    marginTop: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${d.pct}%`,
                      height: "100%",
                      borderRadius: 2,
                      background: d.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          padding: "12px 16px",
          background: "rgba(34,197,94,0.06)",
          borderRadius: 8,
          border: "1px solid rgba(34,197,94,0.12)",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
            {(avoidableVisits / 1_000_000).toFixed(0)}M
          </p>
          <p style={{ fontSize: 10, color: "#8888a0" }}>Avoidable ED visits/yr</p>
        </div>
        <div style={{ width: 1, background: "#1e1e2e" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
            ${(potentialSavings / 1_000_000_000).toFixed(0)}B
          </p>
          <p style={{ fontSize: 10, color: "#8888a0" }}>Potential savings if diverted to UC</p>
        </div>
        <div style={{ width: 1, background: "#1e1e2e" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
            ${(AVG_ED_COST - AVG_UC_COST).toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: "#8888a0" }}>Saved per diverted visit</p>
        </div>
      </div>
    </div>
  );
}
