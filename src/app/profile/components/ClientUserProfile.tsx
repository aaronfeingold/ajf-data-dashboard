"use client";

import UserProfile from "@/app/profile/components/UserProfile";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientUserProfile() {
  return <UserProfile />;
}

export default withAuth(ClientUserProfile);
