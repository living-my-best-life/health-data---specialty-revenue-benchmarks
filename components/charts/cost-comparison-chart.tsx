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
  Legend,
} from "recharts";

interface CodeData {
  specialty: string;
  hcpcs_cd: string;
  hcpcs_desc: string;
  setting: string;
  providers: number;
  total_benes: number;
  total_payments: number;
  total_services: number;
  avg_payment: number;
}

interface Props {
  data: CodeData[];
}

const COMPLEXITY_MAP: Record<string, { label: string; edCode: string; officeCode: string }> = {
  low: { label: "Low Complexity", edCode: "99283", officeCode: "99213" },
  moderate: { label: "Moderate Complexity", edCode: "99284", officeCode: "99214" },
  high: { label: "High Complexity", edCode: "99285", officeCode: "99215" },
};

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
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ed", marginBottom: 8 }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: ${p.value.toFixed(2)}
        </p>
      ))}
      {payload.length === 2 && (
        <p style={{ fontSize: 11, color: "#f97316", marginTop: 6, fontWeight: 600 }}>
          ED Premium: {((payload[0].value / payload[1].value - 1) * 100).toFixed(0)}% more
        </p>
      )}
    </div>
  );
}

export default function CostComparisonChart({ data }: Props) {
  const chartData = useMemo(() => {
    const emData = data.filter((d) => d.specialty === "Emergency Medicine");

    return Object.entries(COMPLEXITY_MAP).map(([key, { label, edCode, officeCode }]) => {
      const ed = emData.find((d) => d.hcpcs_cd === edCode);
      const office = emData.find((d) => d.hcpcs_cd === officeCode);
      return {
        level: label,
        "ED Visit": ed?.avg_payment || 0,
        "Office Visit": office?.avg_payment || 0,
        edBenes: ed?.total_benes || 0,
        officeBenes: office?.total_benes || 0,
      };
    });
  }, [data]);

  const savingsData = useMemo(() => {
    return chartData.map((d) => ({
      level: d.level,
      premium: d["ED Visit"] > 0 && d["Office Visit"] > 0
        ? ((d["ED Visit"] / d["Office Visit"] - 1) * 100).toFixed(0) + "%"
        : "—",
      savingsPerVisit: d["ED Visit"] - d["Office Visit"],
    }));
  }, [chartData]);

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
          ED Visit vs Office Visit Cost
        </h3>
        <p style={{ fontSize: 12, color: "#8888a0" }}>
          Medicare avg payment per service — same complexity level, different setting
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="level"
            tick={{ fill: "#c0c0d0", fontSize: 12 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#8888a0" }}
          />
          <Bar dataKey="ED Visit" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={50} />
          <Bar dataKey="Office Visit" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={50} />
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          justifyContent: "center",
        }}
      >
        {savingsData.map((s) => (
          <div
            key={s.level}
            style={{
              textAlign: "center",
              padding: "8px 16px",
              background: "rgba(239,68,68,0.08)",
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: "#fca5a5" }}>
              {s.premium}
            </p>
            <p style={{ fontSize: 10, color: "#8888a0" }}>
              ED premium — {s.level}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
