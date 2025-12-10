import React from "react";

import { Navigate } from "react-router";
import { useLocation } from "react-router";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";

const PrivetRouter = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <Loader></Loader>;
  }
  if (user && user?.email) {
    return children;
  }

  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};

export default PrivetRouter;
