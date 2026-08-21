import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, User as UserIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

import { useAuth } from "../../context";
import { getInitials } from "../../utils/helpers";
import { ROLE_LABELS } from "../../utils/constants";

export default function Navbar() {
  const { user, logout, isClerkActive } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/transfers/${searchQuery.trim()}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = getInitials(user?.name || "Admin");
  const roleLabel = ROLE_LABELS[user?.role] || user?.role || "Staff";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-[#ddd9d1] bg-[#f7f5f0] lg:left-60">
      <div className="flex h-full items-center justify-between px-7">
        {/* Search */}
        <div className="relative w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858179]"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search Transfer ID... (Press Enter)"
            className="h-9 w-full border border-[#ddd9d1] bg-[#f1efe9] pl-9 pr-3 text-[11px] outline-none placeholder:text-[#96928a] focus:border-black"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <button className="relative text-[#44413c]">
            <Bell size={17} />
            <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-black" />
          </button>

          {isClerkActive ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[11px] font-semibold">
                  {user?.name || "User"}
                </p>
                <p className="text-[8px] uppercase tracking-wide text-[#77736b]">
                  {roleLabel}
                </p>
              </div>

              <SignedIn>
                <UserButton afterSignOutUrl="/login" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="border border-black bg-black px-3 py-1.5 text-[10px] font-semibold text-white">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex items-center gap-2 outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                  {initials}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-[11px] font-semibold">
                    {user?.name || "User"}
                  </p>

                  <p className="mt-0.5 text-[8px] uppercase tracking-wide text-[#77736b]">
                    {roleLabel}
                  </p>
                </div>
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 border border-[#ddd9d1] bg-[#fbfaf7] py-1 shadow-lg"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <div className="border-b border-[#ddd9d1] px-4 py-2 sm:hidden">
                    <p className="text-[11px] font-semibold">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[9px] text-[#77736b]">{roleLabel}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[11px] text-[#333] hover:bg-[#f1efe9]"
                  >
                    <UserIcon size={13} />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[11px] text-[#5c3932] hover:bg-[#f1efe9]"
                  >
                    <LogOut size={13} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}