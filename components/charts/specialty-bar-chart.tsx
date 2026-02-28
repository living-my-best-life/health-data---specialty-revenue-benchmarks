"use client";

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
import { formatCurrency, shortenSpecialty, SPECIALTY_COLORS } from "@/lib/utils";

interface SpecialtyData {
  specialty: string;
  avg_payment_per_provider: number;
  provider_count: number;
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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 6 }}>
        {d.specialty}
      </p>
      <p style={{ fontSize: 12, color: "#a5b4fc" }}>
        Avg Revenue: {formatCurrency(d.avg_payment_per_provider)}
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 4 }}>
        {d.provider_count.toLocaleString()} providers
      </p>
    </div>
  );
}

export default function SpecialtyBarChart({ data }: Props) {
  const sorted = [...data].sort(
    (a, b) => b.avg_payment_per_provider - a.avg_payment_per_provider
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
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#e8e8ed",
          marginBottom: 4,
        }}
      >
        Average Medicare Revenue per Provider
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Annual Medicare Part B fee-for-service payments, 2023
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="specialty"
            tickFormatter={shortenSpecialty}
            tick={{ fill: "#c0c0d0", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="avg_payment_per_provider" radius={[0, 6, 6, 0]} barSize={28}>
            {sorted.map((entry) => (
              <Cell
                key={entry.specialty}
                fill={SPECIALTY_COLORS[entry.specialty] || "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
