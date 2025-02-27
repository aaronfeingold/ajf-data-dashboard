"use client";

import React from "react";
import { StoreProvider } from "@/components/Providers/StoreProvider";
import SidebarWrapper from "@/components/Sidebar/SidebarWrapper";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="flex h-screen">
        <SidebarWrapper>{children}</SidebarWrapper>
      </div>
    </StoreProvider>
  );
}
