"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginUser,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
} from "@/store/authSlice";
import CitySkylineLoading from "@/components/Loading/CitySkylineLoading";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { logger } from "@/utils/logger";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const redirectingRef = useRef(false);
  logger.info("Login page loaded", "authStatus", authStatus);

  useEffect(() => {
    // Prevent multiple redirects with the ref
    if (isAuthenticated && !redirectingRef.current) {
      console.log(
        "Login page detected authenticated state, redirecting to dashboard"
      );
      redirectingRef.current = true;

      // Add a small delay to avoid race conditions with middleware
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(loginUser({ username, password }));

      if (result.meta.requestStatus === "fulfilled") {
        router.push("/dashboard");
      } else {
        setError(authError?.message || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true);
  };

  return (
    <>
      <AlertDialog open={showGoogleModal} onOpenChange={setShowGoogleModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feature Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              Google Sign-in is not yet available. Please use email and password
              to sign in or create an account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-grow">
          {/* Header section */}
          <div className="w-full max-w-md mx-auto px-4 mt-20 mb-16">
            <div className="flex flex-col items-center space-y-4">
              <CitySkylineLoading animated={authStatus === "loading"} />
              {/* Ariba Logo */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-8 py-3 mb-16">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Ariba
                </h1>
              </div>
            </div>
          </div>

          {/* Auth Form section */}
          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-md mx-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Welcome back
                </h2>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center w-full mt-6 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <FcGoogle size={24} className="mr-3" />
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400"></span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={authStatus === "loading"}
                    className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {authStatus === "loading" ? "Processing..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
