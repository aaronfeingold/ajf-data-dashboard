import React from "react";
import {
  FiUser,
  FiUpload,
  FiSettings,
  FiHelpCircle,
  FiBarChart2,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { Gauge } from "lucide-react";
import Link from "next/link";

interface Props {
  isCollapsed: boolean;
  handleLogoutClick: () => void;
}

interface SidebarLink {
  href: string;
  icon: React.ElementType;
  name: string;
}

const links: SidebarLink[] = [
  { href: "/dashboard", icon: Gauge, name: "Dashboard" },
  { href: "/chat", icon: FiMessageSquare, name: "Chat" },
  { href: "/reportsDashboard", icon: FiBarChart2, name: "Reports Dashboard" },
  { href: "/upload", icon: FiUpload, name: "Upload" },
  { href: "/profile", icon: FiUser, name: "Profile" },
  { href: "/settings", icon: FiSettings, name: "Settings" },
  { href: "/help", icon: FiHelpCircle, name: "Help" },
];

export default function SidebarLinks({
  isCollapsed,
  handleLogoutClick,
}: Props) {
  const className = isCollapsed ? "mb-6" : "mb-4";

  return (
    <>
      {links.map(({ href, icon, name }) => (
        <li className={className} key={href}>
          <Link href={href} className="flex items-center hover:text-gray-300">
            {React.createElement(icon, { size: 20 })}
            {!isCollapsed && <span className="ml-3">{name}</span>}
          </Link>
        </li>
      ))}
      {/* Logout button */}
      <li>
        <button
          onClick={handleLogoutClick}
          className={`flex items-center hover:text-gray-300 text-red-400${
            !isCollapsed ? " w-full" : ""
          }`}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </li>
    </>
  );
}
