"use client";

import React, { Suspense } from "react";
import ContentLoading from "@/components/Loading/ContentLoading";
import PageLoading from "@/components/Loading/PageLoading";
import TimeoutGuard from "@/components/Loading/TimeoutGuard";
import LoadingTimeoutFallback from "@/components/Loading/LoadingTimeoutFallback";

type LoadingType = "content" | "page" | "custom";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  type?: LoadingType;
  loadingComponent?: React.ReactNode;
  message?: string;
  size?: "small" | "medium" | "large";
  containerClassName?: string;
  timeout?: number; // timeout in milliseconds
  onRetry?: () => void;
}

/**
 * A wrapper component that provides suspense functionality with different loading states
 * and timeout protection for loading states
 *
 * @param type - The type of loading to display ('content', 'page', or 'custom')
 * @param loadingComponent - Custom loading component to display (only when type='custom')
 * @param message - Optional message to display in the loading component
 * @param size - Size of the loading component (for ContentLoading)
 * @param containerClassName - Additional className for the ContentLoading container
 * @param timeout - Timeout in milliseconds before showing an error (default: none)
 * @param onRetry - Callback function to retry loading when timeout occurs
 */
const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  type = "content",
  loadingComponent,
  message,
  size = "medium",
  containerClassName,
  timeout,
  onRetry,
}) => {
  const getLoadingComponent = () => {
    switch (type) {
      case "page":
        return <PageLoading message={message} />;
      case "custom":
        return loadingComponent;
      case "content":
      default:
        return (
          <ContentLoading
            message={message}
            size={size}
            containerClassName={containerClassName}
          />
        );
    }
  };

  const loadingElement = getLoadingComponent();

  // If timeout is specified, wrap the loading component with a TimeoutGuard
  const fallbackComponent = timeout ? (
    <TimeoutGuard
      fallback={<LoadingTimeoutFallback message={message} onRetry={onRetry} />}
      timeout={timeout}
    >
      {loadingElement}
    </TimeoutGuard>
  ) : (
    loadingElement
  );

  return <Suspense fallback={fallbackComponent}>{children}</Suspense>;
};

export default SuspenseWrapper;
