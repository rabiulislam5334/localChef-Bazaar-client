import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Check, X, Clock, User, Shield, ChefHat } from "lucide-react";

const ManageRequests = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: requests = [],
    refetch,
    isLoading,
    // isError,
  } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/requests");
      return res.data || [];
    },
  });

  const handleApprove = async (id, type) => {
    Swal.fire({
      title: "Approve Request?",
      text: `Are you sure you want to promote this user to ${type}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Backend will handle role update and ChefID generation
          await axiosSecure.patch(`/admin/requests/${id}/approve`);

          Swal.fire("Approved!", `User is now a ${type}.`, "success");
          refetch();
        } catch (err) {
          console.log(err);
          toast.error("Approve failed");
        }
      }
    });
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: "Reject Request?",
      text: "This user will not be promoted.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Reject!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/admin/requests/${id}/reject`);
          Swal.fire("Rejected", "The request has been declined.", "info");
          refetch();
        } catch (err) {
          toast.error("Reject failed");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Shield className="text-[#422ad5]" /> Manage Requests
          </h2>
          <span className="badge badge-lg bg-[#422ad5] text-white p-4 font-bold">
            Total: {requests.length}
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-dashed border-gray-300">
            <Clock className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-bold">
              No pending requests found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest font-black">
                  <tr>
                    <th className="py-5 pl-8">User Info</th>
                    <th>Request Type</th>
                    <th>Submitted Time</th>
                    <th>Status</th>
                    <th className="text-right pr-8">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {requests.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-gray-50/50 transition-colors border-b border-gray-50"
                    >
                      <td className="py-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-2 rounded-xl text-[#422ad5]">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-black text-gray-800">
                              {r.userName}
                            </div>
                            <div className="text-[11px] text-gray-400 font-medium">
                              {r.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                            r.requestType === "chef"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {r.requestType === "chef" ? (
                            <ChefHat size={12} />
                          ) : (
                            <Shield size={12} />
                          )}
                          {r.requestType}
                        </span>
                      </td>
                      <td className="text-gray-500 font-medium">
                        {r.requestTime
                          ? new Date(r.requestTime).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`font-bold capitalize ${
                            r.requestStatus === "approved"
                              ? "text-green-500"
                              : r.requestStatus === "rejected"
                              ? "text-red-400"
                              : "text-amber-500"
                          }`}
                        >
                          • {r.requestStatus}
                        </span>
                      </td>
                      <td className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          {r.requestStatus === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleApprove(r._id, r.requestType)
                                }
                                className="btn btn-sm bg-green-500 hover:bg-green-600 border-none text-white rounded-lg shadow-sm shadow-green-200"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(r._id)}
                                className="btn btn-sm bg-red-50 hover:bg-red-100 border-none text-red-500 rounded-lg"
                              >
                                <X size={16} /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-300 italic font-medium">
                              Processed
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
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
