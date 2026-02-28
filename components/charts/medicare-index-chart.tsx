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
}

interface MedicareFee {
  hcpcs_code: string;
  non_facility_rate: number;
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
        {d.pctOfMedicare.toFixed(0)}% of Medicare
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        Median: {formatExactCurrency(d.median_rate)} vs Medicare {formatExactCurrency(d.medicareRate)}
      </p>
    </div>
  );
}

export default function MedicareIndexChart({ data, medicare }: Props) {
  const codes = [...new Set(data.map((d) => d.billing_code))].sort();
  const [selectedCode, setSelectedCode] = useState(codes.includes("99214") ? "99214" : codes[0]);

  const medicareRate = useMemo(() => {
    const m = medicare.find((m) => m.hcpcs_code === selectedCode);
    return m?.non_facility_rate || 0;
  }, [medicare, selectedCode]);

  const chartData = useMemo(() => {
    if (medicareRate === 0) return [];
    return data
      .filter((d) => d.billing_code === selectedCode)
      .map((d) => ({
        payer: d.payer,
        shortPayer: PAYER_SHORT[d.payer] || d.payer,
        pctOfMedicare: (d.median_rate / medicareRate) * 100,
        median_rate: d.median_rate,
        medicareRate,
      }))
      .sort((a, b) => b.pctOfMedicare - a.pctOfMedicare);
  }, [data, selectedCode, medicareRate]);

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
            Commercial vs Medicare
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Payer median as % of Medicare fee schedule
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
            fontSize: 12,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {codes.map((c) => (
            <option key={c} value={c}>
              {CPT_METADATA[c]?.shortName || c}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="shortPayer"
            tick={{ fill: "#c0c0d0", fontSize: 10 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <ReferenceLine
            y={100}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Medicare 100%",
              position: "right",
              fill: "#ef4444",
              fontSize: 10,
            }}
          />
          <Bar dataKey="pctOfMedicare" radius={[6, 6, 0, 0]} barSize={32}>
            {chartData.map((d) => (
              <Cell
                key={d.payer}
                fill={d.pctOfMedicare >= 100 ? "#22c55e" : "#ef4444"}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
