"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "../hooks/useProtectedRoute";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}

export default withAuth(Home);
