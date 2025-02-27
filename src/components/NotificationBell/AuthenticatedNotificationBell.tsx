"use client";

import { useAppSelector } from "@/store/hooks";
import NotificationBell from "@/components/NotificationBell/NotificationBell";
import { selectIsAuthenticated } from "@/store/authSlice";

export default function AuthenticatedNotificationBell() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return <NotificationBell />;
}
