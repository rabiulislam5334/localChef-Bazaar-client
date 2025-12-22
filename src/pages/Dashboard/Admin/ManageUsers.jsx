import React from "react";
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
  Trash2,
  Mail,
} from "lucide-react";

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

  // --- Fraud Action ---
  const makeFraud = async (id, name) => {
    Swal.fire({
      title: `Mark ${name} as Fraud?`,
      text: "This user will be restricted from many actions!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Mark Fraud!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/users/${id}/fraud`);
          Swal.fire("Success!", "User marked as fraud.", "success");
          refetch();
        } catch (err) {
          toast.error("Failed to mark fraud");
        }
      }
    });
  };

  // --- Change Role Action ---
  const changeRole = async (id, role, name) => {
    Swal.fire({
      title: `Make ${name} an ${role.toUpperCase()}?`,
      text: "User permissions will change immediately.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, Make ${role}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/users/${id}/role`, { role });
          Swal.fire("Role Updated!", `${name} is now an ${role}.`, "success");
          refetch();
        } catch (err) {
          toast.error("Role update failed");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Users className="text-[#422ad5]" size={32} /> Manage Users
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Control user roles and platform security
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 font-bold text-gray-600">
            Total Users: <span className="text-[#422ad5]">{users.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Head */}
              <thead className="bg-gray-50/50">
                <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-none">
                  <th className="py-5 pl-8">#</th>
                  <th>User Details</th>
                  <th>Current Role</th>
                  <th>Account Status</th>
                  <th className="text-right pr-8">Management Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="text-sm">
                {users.map((u, i) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50/40 transition-colors border-b border-gray-50"
                  >
                    <td className="pl-8 text-gray-300 font-bold">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#422ad5]">
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <p className="font-black text-gray-800">{u.name}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : u.role === "chef"
                            ? "bg-orange-50 text-orange-600 border border-orange-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck size={12} />
                        ) : u.role === "chef" ? (
                          <ChefHat size={12} />
                        ) : (
                          <UserCheck size={12} />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          u.status === "fraud"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.status === "fraud"
                              ? "bg-red-500 animate-pulse"
                              : "bg-green-500"
                          }`}
                        ></span>
                        {u.status === "fraud" ? "Fraudulent" : "Active"}
                      </span>
                    </td>
                    <td className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        {u.status !== "fraud" ? (
                          <>
                            {u.role !== "admin" && (
                              <button
                                onClick={() => makeFraud(u._id, u.name)}
                                className="btn btn-sm bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border-none rounded-lg transition-all"
                                title="Mark as Fraud"
                              >
                                <ShieldAlert size={16} />
                              </button>
                            )}

                            {u.role !== "chef" && u.role !== "admin" && (
                              <button
                                onClick={() =>
                                  changeRole(u._id, "chef", u.name)
                                }
                                className="btn btn-sm bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 border-none rounded-lg font-bold"
                              >
                                Make Chef
                              </button>
                            )}

                            {u.role !== "admin" && (
                              <button
                                onClick={() =>
                                  changeRole(u._id, "admin", u.name)
                                }
                                className="btn btn-sm bg-[#422ad5] hover:bg-black text-white border-none rounded-lg font-bold"
                              >
                                Make Admin
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-red-300 font-bold italic px-3 py-1 bg-red-50 rounded-lg">
                            RESTRICTED USER
                          </span>
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
