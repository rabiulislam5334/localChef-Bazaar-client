import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { Menu, X, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/meals">Meals</NavLink>
      </li>

      {user && (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className=" bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="w-11/12 navbar mx-auto">
        {/* Left side */}
        <div className="navbar-start">
          {/* Mobile menu button */}
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="text-xl font-bold">
            LocalChefBazaar
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">{menuItems}</ul>
        </div>

        {/* Right side */}
        <div className="navbar-end">
          {!user ? (
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="avatar cursor-pointer">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-200 rounded-box w-48 p-2 shadow"
              >
                <li>
                  <Link to="/dashboard">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={logOut}>
                    <X size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile drawer menu */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute left-0 top-0 w-64 bg-base-100 h-full shadow-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-sm mb-4"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>

              <ul className="menu gap-1">{menuItems}</ul>

              {user ? (
                <div className="mt-4">
                  <button
                    onClick={logOut}
                    className="btn btn-error btn-sm w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="btn btn-primary btn-sm w-full mt-4"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
