import DashboardHeader from "@/components/dashboard-header";

export default function ProviderDensityPage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="Provider Density & White Space"
        description="Map provider concentration by specialty to identify underserved markets and expansion opportunities."
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
        <p style={{ fontSize: 48, marginBottom: 16 }}>🗺️</p>
        <p style={{ fontSize: 16, color: "#8888a0" }}>
          Dashboard #4 — Provider density mapping coming soon.
        </p>
      </div>
    </div>
  );
}
