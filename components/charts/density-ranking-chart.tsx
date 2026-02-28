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
} from "recharts";
import { shortenSpecialty, SPECIALTY_COLORS } from "@/lib/utils";

interface ProviderDensity {
  state: string;
  specialty: string;
  provider_count: number;
  total_benes: number;
  total_payments: number;
}

interface Props {
  data: ProviderDensity[];
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
        {d.state}
      </p>
      <p style={{ fontSize: 12, color: "#a5b4fc" }}>
        {d.density.toFixed(1)} providers per 10K benes
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 2 }}>
        {d.provider_count.toLocaleString()} providers
      </p>
      <p style={{ fontSize: 11, color: "#8888a0" }}>
        {d.total_benes.toLocaleString()} beneficiaries
      </p>
    </div>
  );
}

export default function DensityRankingChart({ data }: Props) {
  const specialties = useMemo(
    () => [...new Set(data.map((d) => d.specialty))].sort(),
    [data]
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0] || "Family Practice");
  const [showBottom, setShowBottom] = useState(false);

  const chartData = useMemo(() => {
    const filtered = data
      .filter((d) => d.specialty === selectedSpecialty && d.total_benes > 0)
      .map((d) => ({
        ...d,
        density: (d.provider_count / d.total_benes) * 10000,
      }))
      .sort((a, b) => b.density - a.density);

    return showBottom ? filtered.slice(-20).reverse() : filtered.slice(0, 20);
  }, [data, selectedSpecialty, showBottom]);

  const median = useMemo(() => {
    const all = data
      .filter((d) => d.specialty === selectedSpecialty && d.total_benes > 0)
      .map((d) => (d.provider_count / d.total_benes) * 10000)
      .sort((a, b) => a - b);
    return all.length > 0 ? all[Math.floor(all.length / 2)] : 0;
  }, [data, selectedSpecialty]);

  const color = SPECIALTY_COLORS[selectedSpecialty] || "#6366f1";

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
            State Density Ranking
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            {showBottom ? "Bottom 20" : "Top 20"} states by providers per 10K beneficiaries
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["Top 20", "Bottom 20"].map((label, i) => (
              <button
                key={label}
                onClick={() => setShowBottom(i === 1)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: (i === 0 ? !showBottom : showBottom) ? "#6366f1" : "#2a2a3e",
                  background: (i === 0 ? !showBottom : showBottom)
                    ? "rgba(99,102,241,0.15)"
                    : "transparent",
                  color: (i === 0 ? !showBottom : showBottom) ? "#a5b4fc" : "#8888a0",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            style={{
              background: "#1a1a28",
              border: "1px solid #2a2a3e",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e8e8ed",
              fontSize: 11,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {shortenSpecialty(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
            label={{
              value: "Providers per 10K Beneficiaries",
              position: "insideBottom",
              offset: -5,
              style: { fill: "#555568", fontSize: 10 },
            }}
          />
          <YAxis
            type="category"
            dataKey="state"
            tick={{ fill: "#c0c0d0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="density" radius={[0, 6, 6, 0]} barSize={18}>
            {chartData.map((d) => (
              <Cell
                key={d.state}
                fill={d.density < median ? "#ef4444" : color}
                fillOpacity={d.density < median ? 0.7 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
