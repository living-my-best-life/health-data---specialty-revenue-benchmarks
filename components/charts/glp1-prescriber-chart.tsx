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
import { formatNumber, formatCurrency } from "@/lib/utils";

interface PrescriberData {
  specialty: string;
  brand_group: string;
  total_claims: number;
  total_cost: number;
  num_prescribers: number;
}

interface Props {
  data: PrescriberData[];
}

const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#06b6d4", "#14b8a6", "#22c55e", "#eab308", "#f97316", "#ef4444", "#ec4899"];

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
        Claims: {formatNumber(d.total_claims)}
      </p>
      <p style={{ fontSize: 12, color: "#22c55e" }}>
        Total Cost: {formatCurrency(d.total_cost)}
      </p>
      <p style={{ fontSize: 11, color: "#8888a0", marginTop: 4 }}>
        {formatNumber(d.num_prescribers)} prescribers
      </p>
    </div>
  );
}

function shortenSpecialty(name: string): string {
  if (name.length <= 20) return name;
  const map: Record<string, string> = {
    "Family Practice": "Family Practice",
    "Internal Medicine": "Internal Med",
    "Nurse Practitioner": "Nurse Pract.",
    "Physician Assistant": "Physician Asst.",
    "Endocrinology, Diabetes and Metabolism": "Endocrinology",
    "General Practice": "General Practice",
    "Obstetrics/Gynecology": "OB/GYN",
    "Certified Nurse Midwife": "Nurse Midwife",
    "Cardiology": "Cardiology",
    "Gastroenterology": "Gastroenterology",
  };
  return map[name] || name.substring(0, 18) + "...";
}

export default function GLP1PrescriberChart({ data }: Props) {
  const [brandGroup, setBrandGroup] = useState("Semaglutide");

  const filtered = useMemo(() => {
    return data
      .filter((d) => d.brand_group === brandGroup)
      .sort((a, b) => b.total_claims - a.total_claims)
      .slice(0, 10);
  }, [data, brandGroup]);

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
            Who's Prescribing GLP-1s?
          </h3>
          <p style={{ fontSize: 12, color: "#8888a0" }}>
            Top prescribing specialties by total claims, 2023
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Semaglutide", "Tirzepatide"].map((bg) => (
            <button
              key={bg}
              onClick={() => setBrandGroup(bg)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: brandGroup === bg ? "#6366f1" : "#2a2a3e",
                background: brandGroup === bg ? "rgba(99,102,241,0.15)" : "transparent",
                color: brandGroup === bg ? "#a5b4fc" : "#8888a0",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={filtered}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fill: "#8888a0", fontSize: 11 }}
            axisLine={{ stroke: "#1e1e2e" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="specialty"
            tickFormatter={shortenSpecialty}
            tick={{ fill: "#c0c0d0", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="total_claims" radius={[0, 6, 6, 0]} barSize={24}>
            {filtered.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
