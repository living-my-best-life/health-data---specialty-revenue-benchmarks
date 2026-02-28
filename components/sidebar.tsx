"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/specialty-benchmark",
    label: "Specialty Benchmark",
    description: "Revenue & volume by specialty",
    icon: "📊",
    active: true,
  },
  {
    href: "/glp1-trends",
    label: "GLP-1 Trends",
    description: "Prescribing & market growth",
    icon: "💊",
    active: true,
  },
  {
    href: "/payer-rates",
    label: "Payer Rates",
    description: "Transparency & reimbursement",
    icon: "💰",
    active: false,
  },
  {
    href: "/provider-density",
    label: "Provider Density",
    description: "Market gaps & opportunity",
    icon: "🗺️",
    active: false,
  },
  {
    href: "/ed-vs-urgent-care",
    label: "ED vs Urgent Care",
    description: "Value & efficiency comparison",
    icon: "🏥",
    active: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 280,
        minHeight: "100vh",
        background: "#0d0d14",
        borderRight: "1px solid #1e1e2e",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      <div style={{ padding: "0 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🔬
          </div>
          <div>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#e8e8ed",
                letterSpacing: "-0.02em",
              }}
            >
              Healthcare Analytics
            </h1>
            <p style={{ fontSize: 11, color: "#8888a0", marginTop: 1 }}>
              CMS Medicare Data Insights
            </p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "0 12px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#5555688",
            padding: "0 12px",
            marginBottom: 8,
          }}
        >
          Dashboards
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.active ? item.href : "#"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                background: isActive
                  ? "rgba(99, 102, 241, 0.12)"
                  : "transparent",
                cursor: item.active ? "pointer" : "not-allowed",
                opacity: item.active ? 1 : 0.4,
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>
                {item.icon}
              </span>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#a5b4fc" : "#c0c0d0",
                  }}
                >
                  {item.label}
                </p>
                <p style={{ fontSize: 11, color: "#6b6b80", marginTop: 1 }}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
          }}
        >
          <p style={{ fontSize: 11, color: "#8888a0" }}>
            Data Source: CMS Medicare
          </p>
          <p style={{ fontSize: 11, color: "#6b6b80", marginTop: 2 }}>
            Provider Utilization & Payment 2023
          </p>
          <p style={{ fontSize: 10, color: "#555568", marginTop: 4 }}>
            Powered by Mimilabs
          </p>
        </div>
      </div>
    </aside>
  );
}
