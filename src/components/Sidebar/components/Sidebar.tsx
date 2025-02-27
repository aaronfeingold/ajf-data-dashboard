"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import BuildingLogo from "@/components/Icons/BuildingLogo";
import SidebarLinks from "@/components/Sidebar/components/SidebarLinks";
interface SidebarProps {
  handleLogoutClick: () => void;
  onCollapsedChange?: (isCollapsed: boolean) => void;
}

const Sidebar = React.memo(function Sidebar({
  handleLogoutClick,
  onCollapsedChange,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [forceOpen, setForceOpen] = useState(false);
  console.log("Sidebar mounted");

  const handleMouseEnter = useCallback(() => {
    if (!forceOpen) {
      setIsCollapsed(false);
      onCollapsedChange?.(false);
    }
  }, [forceOpen, onCollapsedChange]);

  const handleMouseLeave = useCallback(() => {
    if (!forceOpen) {
      setIsCollapsed(true);
      onCollapsedChange?.(true);
    }
  }, [forceOpen, onCollapsedChange]);

  const toggleForceOpen = useCallback(() => {
    const newForceOpen = !forceOpen;
    setForceOpen(newForceOpen);
    setIsCollapsed(false);
    onCollapsedChange?.(false);
  }, [forceOpen, onCollapsedChange]);
  return (
    <div
      className={`bg-sidebar min-h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link
          href="/dashboard"
          onClick={toggleForceOpen}
          className="flex items-center cursor-pointer"
        >
          <BuildingLogo />
          {!isCollapsed && <span className="ml-2 font-bold">Ariba</span>}
        </Link>
      </div>

      <nav className="p-4">
        <ul>
          <SidebarLinks
            isCollapsed={isCollapsed}
            handleLogoutClick={handleLogoutClick}
          />
        </ul>
      </nav>
    </div>
  );
});

export default Sidebar;
