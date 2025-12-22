import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
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
  UserCircle,
  ShoppingBag,
  MessageSquare,
  Utensils,
} from "lucide-react";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group ${
    isActive
      ? "bg-[#422ad5] text-white shadow-lg shadow-[#422ad5]/30"
      : "text-gray-500 hover:bg-gray-100 hover:text-[#422ad5]"
  }`;

export default function DashboardLayout() {
  const { loading, logOut, user, userInfo } = useAuth();
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || roleLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
        <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">
          Preparing Dashboard
        </p>
      </div>
    );
  }

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      className={`min-h-screen ${dark ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <div className="flex min-h-screen">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
        >
          {/* Brand Logo */}
          <div className="p-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#422ad5] p-1.5 rounded-lg text-white">
                <Utensils size={20} />
              </div>
              <h2 className="text-xl font-black tracking-tighter">
                LocalChef<span className="text-[#422ad5]">Bazaar</span>
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links (As per your requirements) */}
          <nav className="flex-1 px-6 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
              Menu
            </p>

            <ul className="space-y-2">
              {/* Common Profile for All */}
              <li>
                <NavLink to="profile" className={navLinkClass}>
                  <UserCircle size={20} /> My Profile
                </NavLink>
              </li>

              {/* ADMIN Dashboard Links */}
              {role === "admin" && (
                <>
                  <li>
                    <NavLink to="admin/manage-users" className={navLinkClass}>
                      <Users size={20} /> Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="admin/manage-requests"
                      className={navLinkClass}
                    >
                      <ClipboardList size={20} /> Manage Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="admin/platform-stats" className={navLinkClass}>
                      <LayoutDashboard size={20} /> Platform Stats
                    </NavLink>
                  </li>
                </>
              )}

              {/* CHEF Dashboard Links */}
              {role === "chef" && (
                <>
                  <li>
                    <NavLink to="create-meal" className={navLinkClass}>
                      <ChefHat size={20} /> Create Meal
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="my-meals" className={navLinkClass}>
                      <Utensils size={20} /> My Meals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="order-requests" className={navLinkClass}>
                      <ShoppingBag size={20} /> Order Requests
                    </NavLink>
                  </li>
                </>
              )}

              {/* USER Dashboard Links */}
              {role === "user" && (
                <>
                  <li>
                    <NavLink to="user/orders" className={navLinkClass}>
                      <ShoppingBag size={20} /> My Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="user/my-review" className={navLinkClass}>
                      <MessageSquare size={20} /> My Reviews
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="user/favorites" className={navLinkClass}>
                      <Star size={20} /> Favorite Meal
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Sidebar Footer (Logout) */}
          <div className="p-6 mt-auto">
            <button
              onClick={async () => {
                await logOut();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header
            className={`sticky top-0 z-30 px-6 py-4 flex justify-between items-center transition-all ${
              dark ? "bg-slate-900/80" : "bg-white/80"
            } backdrop-blur-md border-b border-gray-100 dark:border-slate-800`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
              >
                <Menu size={24} />
              </button>
              <NavLink
                to="/"
                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-[#422ad5]"
                title="Go Home"
              >
                <Home size={22} />
              </NavLink>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
              >
                {dark ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-slate-600" />
                )}
              </button>

              <div className="h-8 w-[1px] bg-gray-200"></div>

              {/* Profile Brief */}
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                    {userInfo?.name || user?.displayName}
                  </p>
                  <p className="text-[10px] text-[#422ad5] font-black uppercase mt-1 tracking-tighter">
                    {role}
                  </p>
                </div>
                <img
                  src={
                    userInfo?.photo ||
                    user?.photoURL ||
                    "https://i.ibb.co/2kRkYwL/default-avatar.png"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100 shadow-sm"
                />
              </div>
            </div>
          </header>

          {/* Viewport for Child Components */}
          <main className="flex-1 p-6 md:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
