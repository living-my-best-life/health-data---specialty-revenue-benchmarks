"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { SPECIALTY_COLORS, shortenSpecialty } from "@/lib/utils";

interface SpecialtyData {
  specialty: string;
  providers: number;
  total_benes: number;
  total_payments: number;
  cost_per_bene: number;
}

interface Props {
  data: SpecialtyData[];
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
        ${d.cost_per_bene.toFixed(0)} per beneficiary
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        {d.providers.toLocaleString()} providers
      </p>
      <p style={{ fontSize: 11, color: "#8888a0" }}>
        {(d.total_benes / 1_000_000).toFixed(1)}M beneficiaries
      </p>
    </div>
  );
}

export default function SpecialtyCostChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data
        .map((d) => ({
          ...d,
          shortSpecialty: shortenSpecialty(d.specialty),
        }))
        .sort((a, b) => b.cost_per_bene - a.cost_per_bene),
    [data]
  );

  const emCost = chartData.find((d) => d.specialty === "Emergency Medicine")?.cost_per_bene || 0;

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
          Medicare Cost per Beneficiary by Specialty
        </h3>
        <p style={{ fontSize: 12, color: "#8888a0" }}>
          Average annual Medicare payment per beneficiary — lower is more cost-efficient
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortSpecialty"
            tick={{ fill: "#c0c0d0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          {emCost > 0 && (
            <ReferenceLine
              x={emCost}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "EM baseline",
                position: "top",
                style: { fill: "#ef4444", fontSize: 10 },
              }}
            />
          )}
          <Bar dataKey="cost_per_bene" radius={[0, 6, 6, 0]} barSize={28}>
            {chartData.map((d) => (
              <Cell
                key={d.specialty}
                fill={
                  d.specialty === "Emergency Medicine"
                    ? "#ef4444"
                    : SPECIALTY_COLORS[d.specialty] || "#6366f1"
                }
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
