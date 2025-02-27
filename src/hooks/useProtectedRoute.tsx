"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/authSlice";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  function AuthComponent(props: P) {
    const { status } = useSession();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (status !== "authenticated" && !isAuthenticated) {
        router.replace("/login");
      }
    }, [status, router, isAuthenticated]);

    return <Component {...props} />;
  }

  AuthComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthComponent;
}
