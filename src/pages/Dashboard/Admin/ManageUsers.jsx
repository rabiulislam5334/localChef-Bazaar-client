import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Users,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  ChefHat,
  Search,
  Mail,
  Ban,
} from "lucide-react";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch Data
  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data || [];
    },
  });

  // Action: Make Fraud
  const handleMakeFraud = async (id, name) => {
    Swal.fire({
      title: `Mark ${name} as Fraud?`,
      text: "User will be restricted from ordering or creating meals!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Mark Fraud!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/admin/users/${id}/fraud`);
          if (res.data.modifiedCount > 0) {
            Swal.fire("Success!", "User is now marked as fraud.", "success");
            refetch();
          }
        } catch (err) {
          toast.error("Failed to restrict user");
        }
      }
    });
  };

  // Action: Change Role
  const handleRoleChange = async (id, role, name) => {
    Swal.fire({
      title: `Update Role?`,
      text: `Promote ${name} to ${role.toUpperCase()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/admin/users/${id}/role`, {
            role,
          });
          if (res.data.modifiedCount > 0) {
            Swal.fire("Role Updated!", `${name} is now a ${role}.`, "success");
            refetch();
          } else {
            Swal.fire("No Change", "User already has this role.", "info");
          }
        } catch (err) {
          toast.error("Role update failed");
        }
      }
    });
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-indigo-600" size={36} /> Manage Users
          </h2>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 rounded-xl bg-slate-50 border-none font-bold text-slate-600 outline-none"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="chef">Chefs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 uppercase text-[11px] font-black tracking-widest">
                  <th className="px-6 py-5">User Identity</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.imageUrl ||
                            "https://i.ibb.co/xqVVXQBs/Rabiul-photo.jpg"
                          }
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-600"
                            : u.role === "chef"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold text-sm ${
                          u.status === "fraud"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {u.status === "fraud" ? "Fraud" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Requirement: Only show Fraud button if not admin AND status is active */}
                        {u.role !== "admin" && u.status !== "fraud" && (
                          <button
                            onClick={() => handleMakeFraud(u._id, u.name)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Make Fraud"
                          >
                            <ShieldAlert size={20} />
                          </button>
                        )}

                        {/* Role Change Logic */}
                        {u.status !== "fraud" && (
                          <div className="flex gap-1">
                            {u.role !== "chef" && (
                              <button
                                onClick={() =>
                                  handleRoleChange(u._id, "chef", u.name)
                                }
                                className="btn btn-xs bg-orange-500 text-white border-none"
                              >
                                Chef
                              </button>
                            )}
                            {u.role !== "admin" && (
                              <button
                                onClick={() =>
                                  handleRoleChange(u._id, "admin", u.name)
                                }
                                className="btn btn-xs bg-indigo-600 text-white border-none"
                              >
                                Admin
                              </button>
                            )}
                          </div>
                        )}

                        {u.status === "fraud" && (
                          <Ban size={20} className="text-slate-300" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
