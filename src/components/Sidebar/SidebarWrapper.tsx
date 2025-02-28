"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  signOutUser,
  forceLogout,
} from "@/store/authSlice";
import Sidebar from "@/components/Sidebar/components/Sidebar";
import LogoutAlert from "@/components/Sidebar/components/LogoutAlert";
import Navbar from "@/components/Navbar/Navbar";
import { PropertyDataProvider } from "@/components/Providers/PropertyDataProvider";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
import { signOut } from "next-auth/react";
import { logger } from "@/utils/logger";

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const dispatch = useAppDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [redirectAfterLogout, setRedirectAfterLogout] = useState(false);
  const { clearData } = usePropertyData();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle navigation after logout
  useEffect(() => {
    if (redirectAfterLogout) {
      const redirectTimeout = setTimeout(() => {
        setRedirectAfterLogout(false);
        setIsLoggingOut(false);

        // Using window.location directly prevents the flash of dashboard
        window.location.href = "/login";
      }, 1000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [redirectAfterLogout]);

  // Set up a timeout to prevent the logout screen from showing indefinitely
  useEffect(() => {
    if (isLoggingOut) {
      // Set a maximum timeout for logging out to prevent it from hanging
      const timeoutId = setTimeout(() => {
        logger.warn(
          "SidebarWrapper",
          "Logout timeout reached, forcing navigation to login"
        );
        setIsLoggingOut(false);
        window.location.href = "/login";
      }, 5000); // 5 seconds max for logout process

      return () => clearTimeout(timeoutId);
    }
  }, [isLoggingOut]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      logger.info("SidebarWrapper", "Starting logout process");
      setIsLoggingOut(true);
      setShowLogoutDialog(false);

      // First clear data
      await clearData();
      logger.debug("SidebarWrapper", "Data cleared");

      // Then sign out from Redux
      await dispatch(signOutUser());
      logger.debug("SidebarWrapper", "Redux auth state cleared");

      // Then sign out from NextAuth
      await signOut({ redirect: false });
      logger.debug("SidebarWrapper", "NextAuth session cleared");

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Important: Use a complete browser navigation instead of Next.js router
      // to avoid the flash of dashboard content due to middleware
      setRedirectAfterLogout(true);
    } catch (error) {
      logger.error("SidebarWrapper", "Logout failed", error);
      // If there's an error, still logout
      dispatch(forceLogout());
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
  };

  // Show loading animation during logout
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

  const isAuth = isAuthenticated && !isLoggingOut;

  return (
    <>
      {isAuth ? (
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
