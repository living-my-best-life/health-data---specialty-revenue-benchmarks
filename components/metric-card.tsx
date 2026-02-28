interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
}

export default function MetricCard({
  label,
  value,
  subtext,
  accentColor = "#6366f1",
}: MetricCardProps) {
  return (
    <div
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 200,
      }}
    >
      <p style={{ fontSize: 12, color: "#8888a0", fontWeight: 500, marginBottom: 8 }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
      {subtext && (
        <p style={{ fontSize: 11, color: "#6b6b80", marginTop: 6 }}>{subtext}</p>
      )}
    </div>
  );
}
