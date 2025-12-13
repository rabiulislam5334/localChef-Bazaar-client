import React from "react";
import { Outlet, NavLink } from "react-router";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-4">
        <label htmlFor="dashboard-drawer" className="btn btn-ghost lg:hidden">
          Open
        </label>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-200">
          <li>
            <NavLink to="/dashboard">My Orders</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">My Profile</NavLink>
          </li>

          {role === "admin" && (
            <li>
              <NavLink to="/dashboard/admin/manage-users">Manage Users</NavLink>
            </li>
          )}
          {/* chef */}
          {role === "chef" && (
            <li>
              <NavLink to="/dashboard/create-meal">Create Meal</NavLink>
            </li>
          )}
          {role === "chef" && (
            <li>
              <NavLink to="/dashboard/my-meals">My Meals</NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
