import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Wrench, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function SignInPage() {
  const clerkPublishableKey = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && !clerkPublishableKey.includes("pk_test_...");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Wrench className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
          Sign in to KaamSathi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-100 flex justify-center">
          {isClerkConfigured ? (
            <ClerkSignIn routing="path" path="/sign-in" afterSignInUrl="/role-selection" />
          ) : (
            <div className="text-center space-y-4 py-4 w-full">
              <p className="text-xs text-amber-600 font-semibold bg-amber-50 p-3 rounded-xl border border-amber-200">
                Clerk Publishable Key not configured in environment. Using preview simulation mode.
              </p>
              <button 
                onClick={() => {
                  localStorage.setItem("kaamsathi_mock_auth", "true");
                  window.location.href = "/role-selection";
                }}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
              >
                Simulate Successful Sign In
              </button>
            </div>
          )}
        </div>
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
