"use client";

import React, { useEffect } from "react";
import { StoreProvider } from "@/components/Providers/StoreProvider";
import SidebarWrapper from "@/components/Sidebar/SidebarWrapper";
import { usePathname } from "next/navigation";
import { logger } from "@/utils/logger";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Log page transitions for debugging
  useEffect(() => {
    logger.debug("ClientRootLayout", "Page changed", { pathname });
  }, [pathname]);

  return (
    <StoreProvider>
      <div className="flex h-screen">
        <SidebarWrapper>{children}</SidebarWrapper>
      </div>
    </StoreProvider>
  );
}
