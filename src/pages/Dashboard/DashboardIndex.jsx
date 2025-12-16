import { Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function DashboardIndex() {
  const { userInfo, loading } = useAuth();

  if (loading) return null;

  if (userInfo?.role === "admin")
    return <Navigate to="/dashboard/admin/overview" />;

  if (userInfo?.role === "chef")
    return <Navigate to="/dashboard/chef/overview" />;

  return <Navigate to="/dashboard/user/overview" />;
}
