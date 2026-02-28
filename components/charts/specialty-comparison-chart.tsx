"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { shortenSpecialty, SPECIALTY_COLORS } from "@/lib/utils";

interface ProviderDensity {
  state: string;
  specialty: string;
  provider_count: number;
  total_benes: number;
  total_payments: number;
}

interface Props {
  data: ProviderDensity[];
}

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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
        {d.specialty}
      </p>
      <p style={{ fontSize: 12, color: "#a5b4fc" }}>
        {d.density.toFixed(1)} per 10K benes
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        {d.provider_count.toLocaleString()} providers
      </p>
    </div>
  );
}

export default function SpecialtyComparisonChart({ data }: Props) {
  const states = useMemo(
    () => [...new Set(data.map((d) => d.state))].sort(),
    [data]
  );
  const [selectedState, setSelectedState] = useState("US");

  const chartData = useMemo(() => {
    if (selectedState === "US") {
      // National average
      const bySpecialty = new Map<string, { providers: number; benes: number }>();
      data.forEach((d) => {
        const existing = bySpecialty.get(d.specialty) || { providers: 0, benes: 0 };
        existing.providers += d.provider_count;
        existing.benes += d.total_benes;
        bySpecialty.set(d.specialty, existing);
      });
      return [...bySpecialty.entries()]
        .map(([specialty, { providers, benes }]) => ({
          specialty: shortenSpecialty(specialty),
          fullSpecialty: specialty,
          density: benes > 0 ? (providers / benes) * 10000 : 0,
          provider_count: providers,
        }))
        .filter((d) => d.density > 0)
        .sort((a, b) => b.density - a.density);
    }

    return data
      .filter((d) => d.state === selectedState && d.total_benes > 0)
      .map((d) => ({
        specialty: shortenSpecialty(d.specialty),
        fullSpecialty: d.specialty,
        density: (d.provider_count / d.total_benes) * 10000,
        provider_count: d.provider_count,
      }))
      .sort((a, b) => b.density - a.density);
  }, [data, selectedState]);

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
            Specialty Density Comparison
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Provider density across specialties for {selectedState === "US" ? "National Average" : selectedState}
          </p>
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
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
          <option value="US">National Average</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="specialty"
            tick={{ fill: "#8888a0", fontSize: 10 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Per 10K Benes",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#555568", fontSize: 10 },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="density" radius={[6, 6, 0, 0]} barSize={40}>
            {chartData.map((d) => (
              <Cell
                key={d.specialty}
                fill={SPECIALTY_COLORS[d.fullSpecialty] || "#6366f1"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
