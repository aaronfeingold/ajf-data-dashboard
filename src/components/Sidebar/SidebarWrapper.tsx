"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, signOutUser } from "@/store/authSlice";
import Sidebar from "@/components/Sidebar/components/Sidebar";
import LogoutAlert from "@/components/Sidebar/components/LogoutAlert";
import Navbar from "@/components/Navbar/Navbar";
import { PropertyDataProvider } from "@/components/Providers/PropertyDataProvider";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
import { signOut } from "next-auth/react";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearData } = usePropertyData();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      setShowLogoutDialog(false);
      await clearData();
      dispatch(signOutUser());
      await signOut({ redirect: false });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsLoggingOut(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <CitySkylineLoading animated={true} />
          <p className="mt-4 text-white">Logging out...</p>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return <main className="flex-1 p-4 overflow-auto"></main>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <LogoutAlert
            showLogoutDialog={showLogoutDialog}
            setShowLogoutDialog={setShowLogoutDialog}
            handleLogoutConfirm={handleLogoutConfirm}
          />
          <Sidebar
            handleLogoutClick={handleLogoutClick}
            onCollapsedChange={setIsCollapsed}
          />
          <div className="flex flex-1 flex-col">
            <Navbar isCollapsed={isCollapsed} />
            <PropertyDataProvider>
              <main className="flex-1 p-4 overflow-auto">{children}</main>
            </PropertyDataProvider>
          </div>
        </>
      ) : (
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      )}
    </>
  );
}
