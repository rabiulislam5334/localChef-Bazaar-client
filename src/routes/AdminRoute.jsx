import React from "react";
// import Forbidden from "../components/Forbidden/Forbidden";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loader></Loader>;
  }

  if (role !== "admin") {
    //  return <Forbidden></Forbidden>;
  }

  return children;
};

export default AdminRoute;
