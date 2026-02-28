"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useSidebar,
  SIDEBAR_EXPANDED,
  SIDEBAR_COLLAPSED,
} from "./sidebar-context";

const navItems = [
  {
    href: "/specialty-benchmark",
    label: "Specialty Benchmark",
    description: "Revenue & volume by specialty",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    active: true,
  },
  {
    href: "/glp1-trends",
    label: "GLP-1 Trends",
    description: "Prescribing & market growth",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 13.5h3" />
      </svg>
    ),
    active: true,
  },
  {
    href: "/payer-rates",
    label: "Payer Rates",
    description: "Transparency & reimbursement",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    active: true,
  },
  {
    href: "/provider-density",
    label: "Provider Density",
    description: "Market gaps & opportunity",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
      </svg>
    ),
    active: true,
  },
  {
    href: "/ed-vs-urgent-care",
    label: "ED vs Urgent Care",
    description: "Value & efficiency comparison",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    ),
    active: true,
  },
];

/* Hamburger / X toggle button */
function MenuToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        transition: "background 0.15s",
        color: "#8888a0",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(99, 102, 241, 0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  );
}

/* Collapse toggle for desktop (chevron arrow) */
function CollapseToggle({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      style={{
        background: "#12121a",
        border: "1px solid #1e1e2e",
        cursor: "pointer",
        padding: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        position: "absolute",
        top: 28,
        right: -14,
        zIndex: 60,
        color: "#8888a0",
        width: 28,
        height: 28,
        transition: "color 0.15s, border-color 0.15s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(99, 102, 241, 0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#8888a0";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e2e";
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobile, isMobileOpen, toggleSidebar, closeMobile } =
    useSidebar();

  const sidebarWidth = isMobile
    ? SIDEBAR_EXPANDED
    : isExpanded
      ? SIDEBAR_EXPANDED
      : SIDEBAR_COLLAPSED;

  const showLabels = isMobile ? true : isExpanded;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && isMobileOpen && (
        <div
          onClick={closeMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Mobile hamburger button (fixed position, always visible on mobile) */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 55,
            background: "#12121a",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
            padding: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8e8ed",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          minHeight: "100vh",
          background: "#0d0d14",
          borderRight: "1px solid #1e1e2e",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transition: isMobile
            ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            : "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform:
            isMobile && !isMobileOpen ? "translateX(-100%)" : "translateX(0)",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* Header with logo and close/collapse toggle */}
        <div
          style={{
            padding: showLabels ? "0 20px" : "0 0",
            marginBottom: 32,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: showLabels ? "flex-start" : "center",
            minHeight: 36,
          }}
        >
          {/* Mobile close button */}
          {isMobile && isMobileOpen && (
            <div style={{ position: "absolute", top: -4, right: 12 }}>
              <MenuToggle isOpen={true} onClick={closeMobile} />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: showLabels ? 10 : 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#ffffff",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 2h6l3 7H6L9 2z" />
                <path d="M12 9v13" />
                <path d="M8 13h8" />
              </svg>
            </div>
            {showLabels && (
              <div
                style={{
                  opacity: showLabels ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#e8e8ed",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Healthcare Analytics
                </h1>
                <p style={{ fontSize: 11, color: "#8888a0", marginTop: 1 }}>
                  CMS Medicare Data Insights
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle button */}
          {!isMobile && (
            <CollapseToggle
              isExpanded={isExpanded}
              onClick={toggleSidebar}
            />
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: showLabels ? "0 12px" : "0 8px" }}>
          {showLabels && (
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#555568",
                padding: "0 12px",
                marginBottom: 8,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Dashboards
            </p>
          )}
          {!showLabels && (
            <div
              style={{
                width: 32,
                height: 1,
                background: "#1e1e2e",
                margin: "0 auto 12px",
              }}
            />
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.active ? item.href : "#"}
                onClick={() => {
                  if (isMobile) closeMobile();
                }}
                title={!showLabels ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: showLabels ? 12 : 0,
                  padding: showLabels ? "10px 12px" : "10px 0",
                  justifyContent: showLabels ? "flex-start" : "center",
                  borderRadius: 8,
                  marginBottom: 2,
                  textDecoration: "none",
                  background: isActive
                    ? "rgba(99, 102, 241, 0.12)"
                    : "transparent",
                  cursor: item.active ? "pointer" : "not-allowed",
                  opacity: item.active ? 1 : 0.4,
                  transition: "background 0.15s",
                  position: "relative",
                  minHeight: 44,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(99, 102, 241, 0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }
                }}
              >
                <span
                  style={{
                    width: 24,
                    minWidth: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#a5b4fc" : "#8888a0",
                    transition: "color 0.15s",
                  }}
                >
                  {item.icon}
                </span>
                {showLabels && (
                  <div
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#a5b4fc" : "#c0c0d0",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#6b6b80",
                        marginTop: 1,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info card */}
        {showLabels && (
          <div style={{ padding: "0 20px" }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(99, 102, 241, 0.06)",
                border: "1px solid rgba(99, 102, 241, 0.12)",
              }}
            >
              <p style={{ fontSize: 11, color: "#8888a0" }}>
                Data Source: CMS Medicare
              </p>
              <p style={{ fontSize: 11, color: "#6b6b80", marginTop: 2 }}>
                Provider Utilization & Payment 2023
              </p>
              <p style={{ fontSize: 10, color: "#555568", marginTop: 4 }}>
                Powered by Mimilabs
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
