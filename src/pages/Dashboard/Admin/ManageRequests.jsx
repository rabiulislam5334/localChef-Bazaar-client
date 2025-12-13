import React from "react";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageRequests = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: requests = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/requests");
      return res.data || [];
    },
  });

  const approve = async (id) => {
    if (!window.confirm("Approve this request?")) return;
    try {
      await axiosSecure.patch(`/admin/requests/${id}/approve`);
      toast.success("Request approved");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Approve failed");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await axiosSecure.patch(`/admin/requests/${id}/reject`);
      toast.success("Request rejected");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    }
  };

  if (isLoading) return <div className="p-6">Loading requests...</div>;
  if (isError) return <div className="p-6">Failed to load requests</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-semibold">Manage Requests</h2>
      {requests.length === 0 ? (
        <div>No requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Type</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.userName}</td>
                  <td>{r.userEmail}</td>
                  <td>{r.requestType}</td>
                  <td>
                    {r.requestTime
                      ? new Date(r.requestTime).toLocaleString()
                      : "-"}
                  </td>
                  <td>{r.requestStatus}</td>
                  <td className="flex flex-wrap gap-2">
                    {r.requestStatus === "pending" && (
                      <>
                        <button
                          onClick={() => approve(r._id)}
                          className="btn btn-sm btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(r._id)}
                          className="btn btn-sm btn-error"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
