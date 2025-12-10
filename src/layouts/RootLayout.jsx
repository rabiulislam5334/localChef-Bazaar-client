import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Navber from "../pages/Shared/Navber";
import Footer from "../pages/Shared/Footer";
// example

const RootLayout = () => {
  const { appLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Page-level loading
  useEffect(() => {
    // setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // App OR Page loading
  if (appLoading || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={120} color="#4f46e5" />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header>
        <Navber />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <ToastContainer />
      <footer>
        <Footer />
      </footer>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default RootLayout;
