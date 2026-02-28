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
  ReferenceLine,
} from "recharts";
import { formatExactCurrency, PAYER_COLORS, PAYER_SHORT, CPT_METADATA } from "@/lib/utils";

interface PayerRate {
  billing_code: string;
  payer: string;
  median_rate: number;
  p25_rate: number;
  p75_rate: number;
  avg_rate: number;
  sample_size: number;
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
  facility_rate: number;
}

interface Props {
  data: PayerRate[];
  medicare: MedicareFee[];
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
        {d.payer}
      </p>
      <p style={{ fontSize: 12, color: "#a5b4fc" }}>
        Median: {formatExactCurrency(d.median_rate)}
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        Range: {formatExactCurrency(d.p25_rate)} – {formatExactCurrency(d.p75_rate)}
      </p>
      {d.pctVsMedicare !== undefined && (
        <p
          style={{
            fontSize: 11,
            color: d.pctVsMedicare >= 0 ? "#22c55e" : "#ef4444",
            marginTop: 4,
          }}
        >
          {d.pctVsMedicare >= 0 ? "+" : ""}
          {d.pctVsMedicare.toFixed(0)}% vs Medicare
        </p>
      )}
      <p style={{ fontSize: 10, color: "#555568", marginTop: 4 }}>
        {d.sample_size.toLocaleString()} negotiated rates
      </p>
    </div>
  );
}

export default function PayerComparisonChart({ data, medicare }: Props) {
  const codes = [...new Set(data.map((d) => d.billing_code))].sort();
  const [selectedCode, setSelectedCode] = useState(codes.includes("99214") ? "99214" : codes[0]);

  const medicareRate = useMemo(() => {
    const m = medicare.find((m) => m.hcpcs_code === selectedCode);
    return m?.non_facility_rate || 0;
  }, [medicare, selectedCode]);

  const chartData = useMemo(() => {
    return data
      .filter((d) => d.billing_code === selectedCode)
      .map((d) => ({
        ...d,
        shortPayer: PAYER_SHORT[d.payer] || d.payer,
        pctVsMedicare: medicareRate > 0 ? ((d.median_rate - medicareRate) / medicareRate) * 100 : undefined,
      }))
      .sort((a, b) => b.median_rate - a.median_rate);
  }, [data, selectedCode, medicareRate]);

  const meta = CPT_METADATA[selectedCode];

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
            Payer Rate Comparison
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            {meta ? `${meta.name} (CPT ${selectedCode})` : `CPT ${selectedCode}`}
            {medicareRate > 0 && (
              <span style={{ color: "#a5b4fc" }}>
                {" "}— Medicare: {formatExactCurrency(medicareRate)}
              </span>
            )}
          </p>
        </div>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
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
          {codes.map((c) => (
            <option key={c} value={c}>
              {CPT_METADATA[c]?.shortName || c} ({c})
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatExactCurrency(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortPayer"
            tick={{ fill: "#c0c0d0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          {medicareRate > 0 && (
            <ReferenceLine
              x={medicareRate}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "Medicare",
                position: "top",
                fill: "#ef4444",
                fontSize: 10,
              }}
            />
          )}
          <Bar dataKey="median_rate" radius={[0, 6, 6, 0]} barSize={28}>
            {chartData.map((d) => (
              <Cell key={d.payer} fill={PAYER_COLORS[d.payer] || "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
