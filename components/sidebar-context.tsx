"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isExpanded: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  isMobile: false,
  isMobileOpen: false,
  toggleSidebar: () => {},
  closeMobile: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_EXPANDED = 264;
const SIDEBAR_COLLAPSED = 72;

export { SIDEBAR_EXPANDED, SIDEBAR_COLLAPSED, MOBILE_BREAKPOINT };

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(true); // Always show full sidebar content in mobile overlay
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isExpanded, isMobile, isMobileOpen, toggleSidebar, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
