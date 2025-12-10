import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="bg-base-200 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white shadow-lg my-10 rounded-xl border-2 border-gray-300">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
