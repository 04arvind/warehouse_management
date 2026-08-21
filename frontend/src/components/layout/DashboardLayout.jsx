import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({
}) {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      <Sidebar />

      <Navbar />

      <main className="min-h-screen pt-16 lg:ml-60">
        <div className="p-7">
          <Outlet />
        </div>
      </main>

    </div>
  );
}