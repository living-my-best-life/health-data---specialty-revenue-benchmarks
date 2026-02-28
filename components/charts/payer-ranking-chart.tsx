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
import { PAYER_COLORS, PAYER_SHORT, CPT_METADATA } from "@/lib/utils";

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
      <p style={{ fontSize: 12, color: d.avgIndex >= 100 ? "#22c55e" : "#ef4444" }}>
        Avg {d.avgIndex.toFixed(0)}% of Medicare
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        Across {d.codeCount} procedure codes
      </p>
    </div>
  );
}

export default function PayerRankingChart({ data, medicare }: Props) {
  const specialtyGroups = useMemo(() => {
    const groups = new Set<string>();
    groups.add("All");
    data.forEach((d) => {
      const spec = CPT_METADATA[d.billing_code]?.specialty;
      if (spec) groups.add(spec);
    });
    return [...groups];
  }, [data]);

  const [selectedGroup, setSelectedGroup] = useState("All");

  const medicareMap = useMemo(() => {
    const map = new Map<string, number>();
    medicare.forEach((m) => map.set(m.hcpcs_code, m.non_facility_rate));
    return map;
  }, [medicare]);

  const chartData = useMemo(() => {
    const filteredCodes =
      selectedGroup === "All"
        ? [...new Set(data.map((d) => d.billing_code))]
        : [...new Set(data.map((d) => d.billing_code))].filter(
            (c) => CPT_METADATA[c]?.specialty === selectedGroup
          );

    const payers = [...new Set(data.map((d) => d.payer))];
    return payers
      .map((payer) => {
        const indices: number[] = [];
        filteredCodes.forEach((code) => {
          const rate = data.find((d) => d.payer === payer && d.billing_code === code);
          const mcr = medicareMap.get(code);
          if (rate && mcr && mcr > 0) {
            indices.push((rate.median_rate / mcr) * 100);
          }
        });
        if (indices.length === 0) return null;
        return {
          payer,
          shortPayer: PAYER_SHORT[payer] || payer,
          avgIndex: indices.reduce((s, v) => s + v, 0) / indices.length,
          codeCount: indices.length,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.avgIndex - a.avgIndex) as {
      payer: string;
      shortPayer: string;
      avgIndex: number;
      codeCount: number;
    }[];
  }, [data, medicare, selectedGroup, medicareMap]);

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
            Overall Payer Ranking
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Average reimbursement as % of Medicare, ranked best to worst
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {specialtyGroups.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: selectedGroup === g ? "#6366f1" : "#2a2a3e",
                background: selectedGroup === g ? "rgba(99,102,241,0.15)" : "transparent",
                color: selectedGroup === g ? "#a5b4fc" : "#8888a0",
                fontSize: 10,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}%`}
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
          <ReferenceLine
            x={100}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Bar dataKey="avgIndex" radius={[0, 6, 6, 0]} barSize={28}>
            {chartData.map((d) => (
              <Cell
                key={d.payer}
                fill={PAYER_COLORS[d.payer] || "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
