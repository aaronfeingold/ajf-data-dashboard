"use client";

import Settings from "@/app/settings/components/Settings";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientSettings() {
  return <Settings />;
}

export default withAuth(ClientSettings);
