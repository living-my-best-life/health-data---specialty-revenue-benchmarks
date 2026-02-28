"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { formatCurrency, SPECIALTY_COLORS } from "@/lib/utils";

interface SpecialtyData {
  specialty: string;
  avg_payment_per_provider: number;
  avg_benes_per_provider: number;
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
      <p style={{ fontSize: 12, color: "#14b8a6" }}>
        Avg Beneficiaries: {Math.round(d.avg_benes_per_provider).toLocaleString()}
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 4 }}>
        {d.provider_count.toLocaleString()} providers
      </p>
      <p style={{ fontSize: 11, color: "#8888a0" }}>
        Rev/Beneficiary: {formatCurrency(d.avg_payment_per_provider / d.avg_benes_per_provider)}
      </p>
    </div>
  );
}

export default function RevenueScatter({ data }: Props) {
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
        Revenue vs. Patient Volume Efficiency
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Bubble size = number of providers in specialty. Higher and further right = more revenue, more patients.
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="avg_benes_per_provider"
            name="Avg Beneficiaries"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
            label={{
              value: "Avg Beneficiaries per Provider",
              position: "bottom",
              offset: -5,
              style: { fill: "#6b6b80", fontSize: 11 },
            }}
          />
          <YAxis
            dataKey="avg_payment_per_provider"
            name="Avg Revenue"
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Avg Revenue per Provider",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fill: "#6b6b80", fontSize: 11 },
            }}
          />
          <ZAxis
            dataKey="provider_count"
            range={[200, 2000]}
            name="Providers"
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} shape="circle">
            {data.map((entry, i) => (
              <circle
                key={entry.specialty}
                fill={SPECIALTY_COLORS[entry.specialty] || "#6366f1"}
                fillOpacity={0.7}
                stroke={SPECIALTY_COLORS[entry.specialty] || "#6366f1"}
                strokeWidth={1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
          marginTop: 16,
          justifyContent: "center",
        }}
      >
        {data.map((d) => (
          <div
            key={d.specialty}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: SPECIALTY_COLORS[d.specialty] || "#6366f1",
              }}
            />
            <span style={{ fontSize: 11, color: "#8888a0" }}>{d.specialty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
