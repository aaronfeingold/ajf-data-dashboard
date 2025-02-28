"use client";

import React, { useState, useEffect } from 'react';

interface TimeoutGuardProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  timeout?: number; // timeout in milliseconds
}

/**
 * A component that renders a fallback UI if loading takes too long
 *
 * @param children The content to render (usually a loading component)
 * @param fallback The fallback UI to render if the timeout is reached
 * @param timeout The timeout in milliseconds (default: 10000ms / 10s)
 */
const TimeoutGuard: React.FC<TimeoutGuardProps> = ({
  children,
  fallback,
  timeout = 10000
}) => {
  const [shouldShowFallback, setShouldShowFallback] = useState(false);

  useEffect(() => {
    // Only set a timeout if we're not already showing the fallback
    if (!shouldShowFallback) {
      const timer = setTimeout(() => {
        setShouldShowFallback(true);
        console.warn(`Loading timeout reached after ${timeout}ms`);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [shouldShowFallback, timeout]);

  return (
    <>
      {shouldShowFallback ? fallback : children}
    </>
  );
};

export default TimeoutGuard;
