import React from "react";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Star,
  CreditCard,
  ChefHat,
  Users,
  ClipboardList,
  Settings,
  X,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Load User Role
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data;
    },
  });

  const role = userInfo?.role;

  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 bg-base-100 w-64 h-full p-4 shadow-lg transition-transform 
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Close button for mobile */}
        <button
          className="btn btn-ghost mb-2 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        <ul className="menu">
          {/* COMMON USER ITEMS */}
          {(role === "user" || role === "chef" || role === "admin") && (
            <>
              <li>
                <NavLink to="/">
                  <Home size={16} /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-orders">
                  <Home size={16} /> My Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/favorites">
                  <Star size={16} /> Favorites
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/payment-history">
                  <CreditCard size={16} /> Payment History
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile">
                  <Settings size={16} /> Profile
                </NavLink>
              </li>
            </>
          )}

          {/* CHEF ONLY */}
          {role === "chef" && (
            <>
              <div className="divider">Chef Menu</div>
              <li>
                <NavLink to="/dashboard/create-meal">
                  <ChefHat size={16} /> Create Meal
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-meals">
                  <ClipboardList size={16} /> My Meals
                </NavLink>
              </li>
            </>
          )}

          {/* ADMIN ONLY */}
          {role === "admin" && (
            <>
              <div className="divider">Admin Controls</div>
              <li>
                <NavLink to="/admin/manage-requests">
                  <Users size={16} />
                  Manage Requests
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin/manage-users">
                  <ClipboardList size={16} /> Manage Users
                </NavLink>
              </li>

              <li>
                <NavLink to="/admin/platform-stats">
                  <Settings size={16} /> Platform Stats
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </aside>
    </>
  );
}
