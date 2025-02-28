"use client";

import React, { Suspense, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageLoading from "@/components/Loading/PageLoading";
import LoadingTimeoutFallback from "@/components/Loading/LoadingTimeoutFallback";
import TimeoutGuard from "@/components/Loading/TimeoutGuard";
import { logger } from "@/utils/logger";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // When the pathname changes, trigger the loading state
    if (pathname !== prevPathname) {
      setIsChanging(true);
      setShowContent(false);

      // Store the new pathname
      setPrevPathname(pathname);

      // Set a minimum transition time for better UX
      const minTimer = setTimeout(() => {
        logger.debug("PageTransition", "Minimum transition time reached");
      }, 600);

      // Set a maximum transition time to ensure we don't get stuck
      const maxTimer = setTimeout(() => {
        logger.debug(
          "PageTransition",
          "Maximum transition time reached, showing content"
        );
        setIsChanging(false);
      }, 3000); // Maximum 3 second transition

      return () => {
        clearTimeout(minTimer);
        clearTimeout(maxTimer);
      };
    }
  }, [pathname, prevPathname]);

  // Set up a timer to auto-transition after the minimum display time
  useEffect(() => {
    if (isChanging) {
      // After 1 second, stop showing the loading screen
      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 1000); // Minimum 1 second transition

      return () => clearTimeout(timer);
    } else {
      // When we're no longer changing, show the content after a very brief delay
      // This prevents immediate flashes and provides smoother transitions
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 100);

      return () => clearTimeout(contentTimer);
    }
  }, [isChanging]);

  // Handler for timeouts during navigation
  const handleNavigationTimeout = () => {
    // Force refresh the current page
    router.refresh();
  };

  // Get the page name for loading message
  const pageName = pathname.split("/").pop() || "page";
  const loadingMessage = `Loading ${pageName}...`;

  // If we're changing routes or it's the initial load, and haven't reached the minimum display time
  if (isChanging) {
    return (
      <TimeoutGuard
        timeout={15000} // 15 seconds timeout for navigation
        fallback={
          <LoadingTimeoutFallback
            message="Navigation is taking longer than expected"
            onRetry={handleNavigationTimeout}
          />
        }
      >
        <PageLoading message={loadingMessage} />
      </TimeoutGuard>
    );
  }

  // If we've reached the minimum display time but content isn't ready to show yet
  if (!showContent) {
    return null; // Brief moment of nothing to avoid flickering
  }

  // Wrap children in Suspense for any data loading
  return (
    <Suspense
      fallback={
        <TimeoutGuard
          timeout={10000} // 10 seconds timeout for data loading
          fallback={
            <LoadingTimeoutFallback
              message="Content loading is taking longer than expected"
              onRetry={() => router.refresh()}
            />
          }
        >
          <PageLoading message={loadingMessage} />
        </TimeoutGuard>
      }
    >
      {children}
    </Suspense>
  );
};

export default PageTransition;
