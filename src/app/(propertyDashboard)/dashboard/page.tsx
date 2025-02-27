"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import { withAuth } from "@/hooks/useProtectedRoute";

function Page() {
  return <Dashboard />;
}

export default withAuth(Page);
