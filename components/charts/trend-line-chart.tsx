"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency, formatNumber, SPECIALTY_COLORS } from "@/lib/utils";

interface TrendData {
  year: number;
  specialty: string;
  provider_count: number;
  total_payments: number;
  avg_payment_per_provider: number;
  avg_benes: number;
}

interface Props {
  data: TrendData[];
}

type MetricKey = "avg_payment_per_provider" | "total_payments" | "provider_count" | "avg_benes";

const METRICS: { key: MetricKey; label: string; format: (v: number) => string }[] = [
  { key: "avg_payment_per_provider", label: "Avg Revenue / Provider", format: formatCurrency },
  { key: "total_payments", label: "Total Payments", format: formatCurrency },
  { key: "provider_count", label: "Provider Count", format: formatNumber },
  { key: "avg_benes", label: "Avg Beneficiaries", format: (v) => Math.round(v).toLocaleString() },
];

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
        maxWidth: 280,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 8 }}>
        {label}
      </p>
      {payload
        .sort((a: any, b: any) => b.value - a.value)
        .map((p: any) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginTop: 3,
            }}
          >
            <span style={{ fontSize: 11, color: p.color }}>{p.name}</span>
            <span style={{ fontSize: 11, color: "#c0c0d0", fontWeight: 600 }}>
              {typeof p.value === "number"
                ? p.value >= 1000
                  ? formatCurrency(p.value)
                  : p.value.toLocaleString()
                : p.value}
            </span>
          </div>
        ))}
    </div>
  );
}

export default function TrendLineChart({ data }: Props) {
  const [metric, setMetric] = useState<MetricKey>("avg_payment_per_provider");

  const specialties = useMemo(() => {
    return [...new Set(data.map((d) => d.specialty))];
  }, [data]);

  const chartData = useMemo(() => {
    const years = [...new Set(data.map((d) => d.year))].sort();
    return years.map((year) => {
      const row: any = { year };
      specialties.forEach((s) => {
        const entry = data.find((d) => d.year === year && d.specialty === s);
        row[s] = entry ? entry[metric] : null;
      });
      return row;
    });
  }, [data, specialties, metric]);

  const currentMetric = METRICS.find((m) => m.key === metric)!;

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
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e8ed", marginBottom: 4 }}>
            Specialty Trends (2013–2023)
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Year-over-year growth across all specialties
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: metric === m.key ? "#6366f1" : "#2a2a3e",
                background: metric === m.key ? "rgba(99,102,241,0.15)" : "transparent",
                color: metric === m.key ? "#a5b4fc" : "#8888a0",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={currentMetric.format}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          {specialties.map((s) => (
            <Line
              key={s}
              type="monotone"
              dataKey={s}
              stroke={SPECIALTY_COLORS[s] || "#6366f1"}
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: SPECIALTY_COLORS[s] || "#6366f1" }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#0a0a0f" }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
