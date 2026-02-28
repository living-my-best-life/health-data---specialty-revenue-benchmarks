import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Healthcare Analytics — CMS Medicare Data Insights",
  description:
    "Interactive dashboards visualizing CMS Medicare provider utilization, payment data, and market trends for urgent care and on-demand healthcare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: 280,
              padding: "32px 40px",
              minHeight: "100vh",
              background: "#0a0a0f",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
