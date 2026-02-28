"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatNumber, shortenSpecialty } from "@/lib/utils";

interface SpecialtyData {
  specialty: string;
  provider_count: number;
  avg_benes_per_provider: number;
}

interface Props {
  data: SpecialtyData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
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
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginTop: 2 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export default function ProviderVolumeChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.provider_count - a.provider_count);

  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
        Provider Volume & Patient Load
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Number of Medicare providers vs. average beneficiaries per provider
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart
          data={sorted}
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="specialty"
            tickFormatter={shortenSpecialty}
            tick={{ fill: "#8888a0", fontSize: 10 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#14b8a6", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" />
          <Bar
            yAxisId="left"
            dataKey="provider_count"
            name="Providers"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_benes_per_provider"
            name="Avg Beneficiaries"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={{ fill: "#14b8a6", r: 4, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
