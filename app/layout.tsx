import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "Healthcare Analytics — CMS Medicare Data Insights",
  description:
    "Interactive dashboards visualizing CMS Medicare provider utilization, payment data, and market trends for urgent care and on-demand healthcare.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
