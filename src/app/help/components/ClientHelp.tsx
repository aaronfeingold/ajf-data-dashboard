"use client";

import Help from "@/app/help/components/Help";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientHelp() {
  return <Help />;
}

export default withAuth(ClientHelp);
