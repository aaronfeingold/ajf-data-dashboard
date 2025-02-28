"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "../hooks/useProtectedRoute";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/authSlice";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
import { logger } from "@/utils/logger";

function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    logger.debug("RootPage", "Checking auth state for redirection", {
      isAuthenticated,
    });

    if (isAuthenticated) {
      // If authenticated, redirect to dashboard
      router.replace("/dashboard");
    } else {
      // If not authenticated, redirect to login
      router.replace("/login");
    }

    // Set a timeout to prevent infinite loading if something goes wrong
    const timeoutId = setTimeout(() => {
      logger.warn("RootPage", "Redirect timeout reached, forcing navigation");
      setRedirecting(false);

      // Force navigation to login if the router redirection fails
      window.location.href = isAuthenticated ? "/dashboard" : "/login";
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [router, isAuthenticated]);

  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <CitySkylineLoading animated={true} />
          <p className="mt-4 text-white">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default withAuth(Home);
