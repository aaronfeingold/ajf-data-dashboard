"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectIsAuthenticated, forceLogout } from "@/store/authSlice";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
import { logger } from "@/utils/logger";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  function AuthComponent(props: P) {
    const { status } = useSession();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
      // Handle potential state inconsistencies
      if (status === "unauthenticated" && isAuthenticated) {
        logger.warn(
          "withAuth",
          "Session inconsistency detected - NextAuth says unauthenticated but Redux says authenticated"
        );
        dispatch(forceLogout());
      }

      if (status !== "loading") {
        setAuthChecked(true);
      }

      if (status !== "authenticated" && !isAuthenticated && authChecked) {
        // Only redirect if we're not already on the login page
        if (pathname !== "/login") {
          logger.info("withAuth", "Not authenticated, redirecting to login");
          setIsRedirecting(true);

          // Use window.location for a cleaner redirect
          window.location.href = "/login";
        }
      }
    }, [status, isAuthenticated, authChecked, router, pathname, dispatch]);

    // Show loading state while checking auth
    if (!authChecked || isRedirecting) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
          <div className="flex flex-col items-center">
            <CitySkylineLoading animated={true} />
            <p className="mt-4 text-white">
              {isRedirecting
                ? "Redirecting to login..."
                : "Checking authentication..."}
            </p>
          </div>
        </div>
      );
    }

    // If auth check passes, render the protected component
    return <Component {...props} />;
  }

  AuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthComponent;
}
