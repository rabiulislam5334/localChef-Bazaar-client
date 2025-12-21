import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // স্ক্রল করলে নেভবার হালকা ঝাপসা (Blur) হবে
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyles = ({ isActive }) =>
    `relative px-3 py-2 transition-all duration-300 font-bold tracking-wide ${
      isActive ? "text-[#422ad5]" : "text-gray-600 hover:text-[#422ad5]"
    }`;

  const menuItems = (
    <>
      <NavLink to="/" className={navStyles}>
        Home
      </NavLink>
      <NavLink to="/meals" className={navStyles}>
        Meals
      </NavLink>
      {user && (
        <NavLink to="/dashboard" className={navStyles}>
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="w-11/12 max-w-7xl mx-auto flex items-center justify-between">
        {/* --- Logo Section --- */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#422ad5] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#422ad5]/20">
            <UtensilsCrossed size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 italic">
            LocalChef<span className="text-[#422ad5]">Bazaar</span>
          </span>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">{menuItems}</div>

          <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

          {!user ? (
            <Link
              to="/login"
              className="px-6 py-2.5 bg-[#422ad5] text-white rounded-full font-bold shadow-lg shadow-[#422ad5]/30 hover:bg-black transition-all active:scale-95"
            >
              Join Us
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="avatar">
                  <div className="w-10 rounded-full ring-2 ring-[#422ad5]/10 group-hover:ring-[#422ad5]/50 transition-all">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      alt="User"
                    />
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-400 group-hover:text-[#422ad5] transition-colors"
                />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-4 z-[1] p-3 shadow-2xl bg-white rounded-2xl w-56 border border-gray-50"
              >
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {user?.displayName || "User"}
                  </p>
                </div>
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors font-semibold text-gray-700"
                  >
                    <LayoutDashboard size={18} className="text-[#422ad5]" />{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logOut}
                    className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors font-semibold mt-1"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* --- Mobile Menu Button --- */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          onClick={() => setOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* --- Mobile Sidebar (Framer Motion) --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 w-72 h-full bg-white z-[120] p-8 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-[#422ad5]">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-xl">{menuItems}</div>

              <div className="mt-auto pt-10 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={logOut}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl transition-all"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full py-4 bg-[#422ad5] text-white font-bold rounded-2xl shadow-lg shadow-[#422ad5]/20"
                  >
                    Join Us
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
