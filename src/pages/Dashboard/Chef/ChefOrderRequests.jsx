import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  ShoppingBag,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const ChefOrderRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["chef-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef/order-requests`);
      return res.data || [];
    },
  });

  const updateStatus = async (id, newStatus) => {
    const toastId = toast.loading(`Updating to ${newStatus}...`);
    try {
      await axiosSecure.patch(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Order ${newStatus} successfully!`, { id: toastId });
      refetch();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update status";
      toast.error(errorMsg, { id: toastId });
    }
  };

  if (isLoading)
    return <div className="p-10 text-center font-bold">Loading Orders...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <ShoppingBag className="text-[#422ad5]" size={32} /> Order Requests
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Manage your incoming food orders and delivery status
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed">
            <ShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold">
              No orders found for you yet!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md"
              >
                <div
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest flex justify-between items-center ${
                    order.orderStatus === "delivered"
                      ? "bg-green-50 text-green-600"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-indigo-50 text-[#422ad5]"
                  }`}
                >
                  <span>Status: {order.orderStatus}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {new Date(order.orderTime).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-6 flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-800">
                      {order.foodName}
                    </h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm font-bold text-gray-500 flex items-center gap-1">
                        Qty:{" "}
                        <span className="text-gray-800">{order.quantity}</span>
                      </span>
                      <span className="text-sm font-bold text-gray-500 flex items-center gap-1">
                        Price:{" "}
                        <span className="text-green-600">${order.price}</span>
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-50" />

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <User size={16} className="text-gray-400 mt-1" />
                      <div>
                        <p className="font-bold text-gray-700">
                          {order.userEmail}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <DollarSign size={12} /> Payment:{" "}
                          <span className="uppercase">
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-gray-400 mt-1" />
                      <p className="text-xs leading-relaxed">
                        {order.userAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 grid grid-cols-3 gap-2">
                  <button
                    disabled={order.orderStatus !== "pending"}
                    onClick={() => updateStatus(order._id, "cancelled")}
                    className="btn btn-sm bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white disabled:bg-gray-50 disabled:text-gray-300 rounded-xl"
                  >
                    <XCircle size={16} /> Cancel
                  </button>

                  <button
                    disabled={order.orderStatus !== "pending"}
                    onClick={() => updateStatus(order._id, "accepted")}
                    className="btn btn-sm bg-blue-50 text-blue-600 border-none hover:bg-blue-600 hover:text-white disabled:bg-gray-50 disabled:text-gray-300 rounded-xl"
                  >
                    <CheckCircle2 size={16} /> Accept
                  </button>

                  <button
                    disabled={order.orderStatus !== "accepted"}
                    onClick={() => updateStatus(order._id, "delivered")}
                    className="btn btn-sm bg-green-50 text-green-600 border-none hover:bg-green-600 hover:text-white disabled:bg-gray-50 disabled:text-gray-300 rounded-xl"
                  >
                    <Truck size={16} /> Deliver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefOrderRequests;
