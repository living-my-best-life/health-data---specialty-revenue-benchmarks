import DashboardHeader from "@/components/dashboard-header";

export default function EDvsUrgentCarePage() {
  return (
    <div style={{ maxWidth: 1200 }}>
      <DashboardHeader
        title="ED vs Urgent Care Value Story"
        description="Compare emergency department and urgent care on cost, wait times, and patient satisfaction to build the case for on-demand healthcare."
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
        <p style={{ fontSize: 48, marginBottom: 16 }}>🏥</p>
        <p style={{ fontSize: 16, color: "#8888a0" }}>
          Dashboard #5 — ED vs urgent care comparison coming soon.
        </p>
      </div>
    </div>
  );
}
