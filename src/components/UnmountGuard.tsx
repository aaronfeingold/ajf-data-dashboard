"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface UnmountGuardProps {
  children: React.ReactNode;
  onUnmount?: () => void;
}

/**
 * A component that ensures proper cleanup when unmounting
 * Helps with transitions between pages and prevents stuck states
 */
const UnmountGuard: React.FC<UnmountGuardProps> = ({
  children,
  onUnmount
}) => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  // Track path changes to detect unmounting
  useEffect(() => {
    if (pathname !== currentPath) {
      // Path has changed, component is about to unmount
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

  // Run cleanup on unmount
  useEffect(() => {
    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [onUnmount]);

  return <>{children}</>;
};

export default UnmountGuard;
