import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Warehouse, ArrowRight, Shield } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

import Button from "../components/common/Button";
import { useAuth } from "../context";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Login() {
  const { login, isAuthenticated, isClerkActive } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1efe9] p-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center bg-black text-white">
            <Warehouse size={19} />
          </div>

          <h1 className="mt-4 text-xl font-bold">STOCKFLOW</h1>

          <p className="mt-2 text-[10px] text-[#77736b]">
            Warehouse Management System
          </p>
        </div>

        <div className="border border-[#d8d4cc] bg-[#fbfaf7] p-7">
          <h2 className="text-sm font-semibold">Sign in</h2>

          <p className="mt-1 text-[10px] text-[#77736b]">
            Access your warehouse operations dashboard.
          </p>

          {isClerkActive && (
            <div className="mt-5 space-y-2 border-b border-[#ddd9d1] pb-5">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="flex w-full items-center justify-center gap-2 bg-black py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#262626]">
                  <Shield size={14} />
                  Sign in with Clerk
                </button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="flex w-full items-center justify-center gap-2 border border-[#d8d4cc] bg-[#f1efe9] py-2 text-[10px] font-semibold text-black transition hover:bg-[#e4e1da]">
                  Create account with Clerk
                </button>
              </SignUpButton>

              <div className="relative my-4 text-center">
                <span className="bg-[#fbfaf7] px-2 text-[9px] uppercase text-[#77736b]">
                  or sign in with credentials
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
              <ArrowRight size={13} />
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-[9px] text-[#99958d]">
          StockFlow · Warehouse Operations
        </p>
      </div>
    </div>
  );
}