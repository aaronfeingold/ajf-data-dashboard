"use client";

import ReportsDashboard from "@/app/reportsDashboard/components/ReportsDashboard";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientReportsDashboard() {
  return <ReportsDashboard />;
}

export default withAuth(ClientReportsDashboard);
