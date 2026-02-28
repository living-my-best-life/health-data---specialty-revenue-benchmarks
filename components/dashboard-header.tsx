interface DashboardHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export default function DashboardHeader({
  title,
  description,
  badge,
}: DashboardHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1
          className="dashboard-title"
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#e8e8ed",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 20,
              background: "rgba(99, 102, 241, 0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: 14,
          color: "#8888a0",
          marginTop: 6,
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );
}
