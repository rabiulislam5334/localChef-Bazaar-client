import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ChefHat,
  Star,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
/* -----------------------------
   Active NavLink Style
-------------------------------- */
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
   ${
     isActive
       ? "bg-primary text-primary-content font-semibold"
       : "hover:bg-base-300"
   }`;

export default function DashboardLayout() {
  const { loading, logOut, user, userInfo } = useAuth();
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* -----------------------------
     Global Loading State
  -------------------------------- */
  if (loading || roleLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div data-theme={dark ? "dark" : "light"} className="min-h-screen">
      <div className="flex min-h-screen bg-base-200">
        {/* ================= Mobile Overlay ================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= Sidebar ================= */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-lg
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 flex flex-col`}
        >
          {/* ---- Sidebar Header ---- */}
          <div className="p-5 flex justify-between items-center ">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard size={26} />
              Dashboard
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>

          {/* ---- Navigation ---- */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {/* ================= ADMIN ================= */}
              {role === "admin" && (
                <>
                  <li>
                    <NavLink to="admin/overview" className={navLinkClass}>
                      <LayoutDashboard size={20} />
                      Overview
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="admin/manage-users" className={navLinkClass}>
                      <Users size={20} />
                      Manage Users
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="admin/manage-requests"
                      className={navLinkClass}
                    >
                      <ClipboardList size={20} />
                      Manage Requests
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="admin/platform-stats" className={navLinkClass}>
                      <Star size={20} />
                      Platform Stats
                    </NavLink>
                  </li>
                </>
              )}

              {/* ================= CHEF ================= */}
              {role === "chef" && (
                <>
                  <li>
                    <NavLink to="chef/overview" className={navLinkClass}>
                      <LayoutDashboard size={20} />
                      Overview
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="create-meal" className={navLinkClass}>
                      <ChefHat size={20} />
                      Add Meal
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="my-meals" className={navLinkClass}>
                      <ClipboardList size={20} />
                      My Meals
                    </NavLink>
                  </li>
                </>
              )}

              {/* ================= USER ================= */}
              {role === "user" && (
                <>
                  <li>
                    <NavLink to="user/overview" className={navLinkClass}>
                      <LayoutDashboard size={20} />
                      Overview
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="user/orders" className={navLinkClass}>
                      <ClipboardList size={20} />
                      My Orders
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="user/favorites" className={navLinkClass}>
                      <Star size={20} />
                      Favorites
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="payment-history" className={navLinkClass}>
                      <ClipboardList size={20} />
                      Payment History
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* ---- Logout ---- */}
          <div className="p-4 border-t">
            <button
              onClick={async () => {
                await logOut();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
              hover:bg-base-300 text-error"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* ================= Main Content ================= */}
        <div className="flex-1 flex flex-col">
          {/* ---- Header ---- */}
          <header className="bg-base-100 shadow px-4 py-3 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} />
            </button>
            {/* Home icon */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `btn btn-sm btn-ghost ${isActive ? "text-primary" : ""}`
              }
              title="Home"
            >
              <Home size={20} />
            </NavLink>

            <div className="flex items-center gap-2">
              <img
                src={
                  userInfo?.photo ||
                  user?.photoURL ||
                  "https://i.ibb.co/2kRkYwL/default-avatar.png"
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />

              <span className="font-medium hidden sm:block">
                Welcome,{userInfo?.name || user?.displayName || user?.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark(!dark)}
                className="btn btn-sm btn-ghost"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={logOut}
                className="btn btn-sm btn-outline btn-error hidden sm:flex gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </header>

          {/* ---- Page Content ---- */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
