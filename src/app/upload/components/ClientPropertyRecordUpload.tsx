"use client";

import PropertyUpload from "@/app/upload/components/PropertyUpload";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientPropertyUpload() {
  return <PropertyUpload />;
}

export default withAuth(ClientPropertyUpload);
