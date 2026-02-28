import DashboardHeader from "@/components/dashboard-header";

export default function PayerRatesPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="Payer Rate Comparison"
        description="Compare negotiated in-network rates across major payers for common urgent care and specialty procedure codes."
        badge="Coming Soon"
      />
      <div
        style={{
          background: "#12121a",
          border: "1px solid #1e1e2e",
          borderRadius: 12,
          padding: 48,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 48, marginBottom: 16 }}>💰</p>
        <p style={{ fontSize: 16, color: "#8888a0" }}>
          Dashboard #3 — Payer transparency rate analysis coming soon.
        </p>
      </div>
    </div>
  );
}
