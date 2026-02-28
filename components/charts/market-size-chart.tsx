"use client";

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
import { formatCurrency, shortenSpecialty } from "@/lib/utils";

interface SpecialtyData {
  specialty: string;
  total_medical_payments: number;
  total_drug_payments: number;
  total_payments: number;
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
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function MarketSizeChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.total_payments - a.total_payments);

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
        Total Market Size by Specialty
      </h3>
      <p style={{ fontSize: 12, color: "#8888a0", marginBottom: 24 }}>
        Medicare Part B payments split by medical services vs. drug administration
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
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
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#8888a0" }}
            iconType="square"
          />
          <Bar
            dataKey="total_medical_payments"
            name="Medical Services"
            fill="#6366f1"
            stackId="a"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="total_drug_payments"
            name="Drug Payments"
            fill="#a855f7"
            stackId="a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
