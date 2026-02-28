import DashboardHeader from "@/components/dashboard-header";

export default function GLP1TrendsPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="GLP-1 Prescribing Trends"
        description="Track the explosive growth of semaglutide (Ozempic/Wegovy) and tirzepatide (Mounjaro/Zepbound) prescribing across specialties and geographies."
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
        <p style={{ fontSize: 48, marginBottom: 16 }}>💊</p>
        <p style={{ fontSize: 16, color: "#8888a0" }}>
          Dashboard #2 — GLP-1 prescribing data visualization coming next.
        </p>
      </div>
    </div>
  );
}
