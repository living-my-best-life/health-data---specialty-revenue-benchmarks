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
        flex: "1 1 200px",
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "#8888a0",
          fontWeight: 500,
          marginBottom: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </p>
      {subtext && (
        <p
          style={{
            fontSize: 11,
            color: "#6b6b80",
            marginTop: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
