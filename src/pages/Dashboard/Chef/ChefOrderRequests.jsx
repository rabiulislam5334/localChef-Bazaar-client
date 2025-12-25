import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  ShoppingBag,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  Loader2,
  Phone,
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
    isError,
  } = useQuery({
    queryKey: ["chef-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef/order-requests`);
      return res.data || [];
    },
  });

  // SweetAlert2 ব্যবহার করে স্ট্যাটাস আপডেট
  const updateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to mark this order as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus}!`,
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/orders/${id}/status`, {
          status: newStatus,
        });

        if (res.data.success || res.status === 200) {
          Swal.fire({
            icon: "success",
            title: `Order ${newStatus}`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message || "Something went wrong!",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-gray-500 font-bold">
          Loading your kitchen orders...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#fbfbfd] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic">
            <ShoppingBag className="text-indigo-600" size={32} />
            ACTIVE ORDERS
          </h2>
          <div className="h-1 w-20 bg-indigo-600 rounded-full mt-2"></div>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ShoppingBag className="mx-auto text-gray-200 mb-4" size={60} />
            <p className="text-gray-400 font-bold text-xl">
              No active requests right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col border-b-4 border-b-indigo-500 transition-transform hover:scale-[1.02]"
              >
                {/* Header: Status & Time */}
                <div className="p-5 pb-0 flex justify-between items-center">
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "accepted"
                        ? "bg-blue-100 text-blue-600"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                    <Clock size={14} />{" "}
                    {new Date(order.orderTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="p-6 space-y-5 flex-1">
                  {/* Food Details */}
                  <div>
                    <h3 className="text-xl font-black text-gray-800 leading-tight">
                      {order.mealName || order.foodName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-gray-400">
                        Qty: {order.quantity}
                      </span>
                      <span className="text-indigo-600 font-black tracking-tight underline">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-400 mt-1" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                          Customer
                        </p>
                        <p className="text-xs font-bold text-gray-700 truncate">
                          {order.userEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                          Delivery To
                        </p>
                        <p className="text-xs font-bold text-gray-600 leading-snug">
                          {order.userAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50/50 grid grid-cols-3 gap-2">
                  <button
                    disabled={order.orderStatus !== "pending"}
                    onClick={() => updateStatus(order._id, "cancelled")}
                    className="py-3 rounded-xl bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-30 flex flex-col items-center gap-1 transition-all"
                  >
                    <XCircle size={18} />
                    <span className="text-[9px] font-black uppercase">
                      Cancel
                    </span>
                  </button>

                  <button
                    disabled={order.orderStatus !== "pending"}
                    onClick={() => updateStatus(order._id, "accepted")}
                    className="py-3 rounded-xl bg-white border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-30 flex flex-col items-center gap-1 transition-all"
                  >
                    <CheckCircle2 size={18} />
                    <span className="text-[9px] font-black uppercase">
                      Accept
                    </span>
                  </button>

                  <button
                    disabled={order.orderStatus !== "accepted"}
                    onClick={() => updateStatus(order._id, "delivered")}
                    className="py-3 rounded-xl bg-white border border-green-100 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-30 flex flex-col items-center gap-1 transition-all"
                  >
                    <Truck size={18} />
                    <span className="text-[9px] font-black uppercase">
                      Deliver
                    </span>
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
