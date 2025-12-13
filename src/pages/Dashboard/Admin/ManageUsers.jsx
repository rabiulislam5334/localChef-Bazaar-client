import React from "react";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data || [];
    },
  });

  const makeFraud = async (id, name) => {
    if (!window.confirm(`Mark ${name} as fraud?`)) return;
    try {
      await axiosSecure.patch(`/users/${id}/fraud`);
      toast.success("User marked as fraud");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark fraud");
    }
  };

  const changeRole = async (id, role, name) => {
    if (!window.confirm(`Change ${name}'s role to ${role}?`)) return;
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role });
      toast.success("Role updated");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Role update failed");
    }
  };

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError) return <div className="p-6">Failed to load users</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td className="flex flex-wrap gap-2">
                  {u.status !== "fraud" && u.role !== "admin" && (
                    <button
                      onClick={() => makeFraud(u._id, u.name)}
                      className="btn btn-sm btn-error"
                    >
                      Make Fraud
                    </button>
                  )}

                  {u.status !== "fraud" && u.role !== "chef" && (
                    <button
                      onClick={() => changeRole(u._id, "chef", u.name)}
                      className="btn btn-sm"
                    >
                      Make Chef
                    </button>
                  )}

                  {u.status !== "fraud" && u.role !== "admin" && (
                    <button
                      onClick={() => changeRole(u._id, "admin", u.name)}
                      className="btn btn-sm"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
