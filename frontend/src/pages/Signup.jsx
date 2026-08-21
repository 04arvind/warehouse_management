import { Navigate } from "react-router-dom";
import {
  SignUp,
  useAuth,
} from "@clerk/clerk-react";

export default function Signup() {
  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1efe9]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  // Already authenticated
  if (isSignedIn) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1efe9] p-5">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-10 w-10 items-center justify-center bg-black text-white">
            <span className="text-sm font-bold">
              S
            </span>
          </div>

          <h1 className="mt-4 text-xl font-bold">
            STOCKFLOW
          </h1>

          <p className="mt-2 text-[10px] text-[#77736b]">
            Warehouse Management System
          </p>

        </div>

        <div className="flex justify-center">

          <SignUp
            routing="path"
            path="/signup"
            signInUrl="/login"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",

                card:
                  "w-full shadow-none border border-[#d8d4cc] bg-[#fbfaf7]",

                headerTitle:
                  "text-black",

                headerSubtitle:
                  "text-[#77736b]",

                formButtonPrimary:
                  "bg-black hover:bg-[#262626] text-white",

                formFieldInput:
                  "border-[#d8d4cc] bg-[#f1efe9] text-black",

                formFieldLabel:
                  "text-black",

                footerActionLink:
                  "text-black hover:text-[#444]",
              },
            }}
          />

        </div>

        <p className="mt-5 text-center text-[9px] text-[#99958d]">
          StockFlow · Warehouse Operations
        </p>

      </div>

    </div>
  );
}