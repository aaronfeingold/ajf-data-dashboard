import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserProfile,
  selectPasswordResetStatus,
  selectUserError,
  resetPassword,
  clearPasswordResetStatus,
} from "@/store/userSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppDispatch } from "@/store/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Phone, Briefcase, Key } from "lucide-react";

const ProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const resetStatus = useSelector(selectPasswordResetStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (resetStatus === "succeeded" || resetStatus === "failed") {
      const timer = setTimeout(() => {
        dispatch(clearPasswordResetStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resetStatus, dispatch]);

  const handleResetPassword = () => {
    dispatch(resetPassword());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>

        <div className="grid gap-6">
          <div className="flex items-center space-x-4 text-gray-200">
            <User className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="font-medium">{profile.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-200">
            <Mail className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-200">
            <Phone className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium">504-555-1234</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-200">
            <Briefcase className="w-5 h-5" />
            <div>
              <p className="text-sm text-gray-400">Job Title</p>
              <p className="font-medium">Jack of All Trades</p>
            </div>
          </div>

          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  <Key className="w-4 h-4" />
                  <span>Reset Password</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Password</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This will send a password reset link to your email address.
                    Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetPassword}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {resetStatus === "succeeded" && (
            <Alert className="bg-green-900 border-green-600 text-green-100">
              <AlertDescription>
                Password reset email sent successfully!
              </AlertDescription>
            </Alert>
          )}

          {resetStatus === "failed" && (
            <Alert className="bg-red-900 border-red-600 text-red-100">
              <AlertDescription>
                {error?.message || "Failed to reset password"}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
