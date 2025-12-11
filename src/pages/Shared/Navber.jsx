import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";

import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const Navber = () => {
  const { user, logOut } = useAuth();
  const [theme, setTheme] = useState("light");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Logout handler
  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Sign-out successful!", {
          style: {
            border: "1px solid #f97316",
            padding: "12px 16px",
            color: "#333",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#f97316",
            secondary: "#FFFAEE",
          },
        });
      })
      .catch((error) => console.log(error));
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Conditional Nav Links
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-green-700 border-b-2 border-green-500 font-semibold"
              : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/all_crops"
          className={({ isActive }) =>
            isActive
              ? "text-green-700 border-b-2 border-green-500 font-semibold"
              : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
          }
        >
          All Crops
        </NavLink>
      </li>

      {!user ? (
        <>
          <li>
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
              }
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auth/register"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
              }
            >
              Register
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink
              to="/my_profile"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
              }
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add_crops"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-600 hover:border-b-2 hover:border-green-500"
              }
            >
              Add Crops
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my_posts"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-600 hover:border-b-2 hover:border-green-500"
              }
            >
              My Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/interests"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 border-b-2 border-green-500 font-semibold"
                  : "hover:text-green-500 hover:border-b-2 hover:border-green-500"
              }
            >
              My Interests
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="bg-base-100 shadow-sm">
      <div className="w-11/12 mx-auto">
        <div className="navbar">
          {/* Left side */}
          <div className="navbar-start">
            {/* Dropdown for Mobile */}
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-8 6h8"
                  />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow absolute z-[1000]"
              >
                {navLinks}
              </ul>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex mx-auto justify-center items-center gap-0"
              >
                <img src={logo} alt="Logo" className="w-20 h-20" />
                <h1 className="text-2xl text-green-700 font-bold">
                  Krishi Link
                </h1>
              </Link>
            </div>
          </div>

          {/* Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu gap-4 text-lg menu-horizontal px-1">
              {navLinks}
            </ul>
          </div>

          {/* Right side */}
          <div className="navbar-end gap-5 items-center relative" ref={menuRef}>
            {user ? (
              <div className="relative">
                <img
                  className="w-12 h-12 rounded-full border-2 border-green-500 cursor-pointer object-cover"
                  src={
                    user?.photoURL
                      ? user.photoURL
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User Avatar"
                  onClick={() => setOpenMenu(!openMenu)}
                />

                {/* Dropdown */}
                {openMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-base-100 shadow-xl rounded-xl p-4 z-50 border border-gray-200 animate-fade-in">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={
                          user?.photoURL
                            ? user.photoURL
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="avatar"
                        className="w-16 h-16 rounded-full border-2 border-orange-500 mb-2"
                      />
                      <h3 className="font-semibold text-lg">
                        {user?.displayName}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <div className="divider my-2"></div>

                    <Link
                      to="/my_profile"
                      className="btn btn-sm w-full mb-2 bg-green-700 hover:bg-green-400 text-white font-semibold"
                    >
                      View Profile
                    </Link>

                    <button
                      onClick={toggleTheme}
                      className="btn btn-sm w-full mb-2 border border-gray-400"
                    >
                      Toggle {theme === "light" ? "Dark" : "Light"} Mode
                    </button>

                    <button
                      onClick={handleLogOut}
                      className="btn btn-sm w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navber;
