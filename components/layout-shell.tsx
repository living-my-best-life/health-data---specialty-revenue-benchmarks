"use client";

import { type ReactNode } from "react";
import Sidebar from "./sidebar";
import {
  SidebarProvider,
  useSidebar,
  SIDEBAR_EXPANDED,
  SIDEBAR_COLLAPSED,
} from "./sidebar-context";

function LayoutInner({ children }: { children: ReactNode }) {
  const { isExpanded, isMobile } = useSidebar();

  const marginLeft = isMobile ? 0 : isExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft,
          minHeight: "100vh",
          background: "#0a0a0f",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: isMobile ? "72px 16px 32px" : "32px 40px",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
