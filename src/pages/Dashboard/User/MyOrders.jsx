import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Trash2, CreditCard } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null); // Details Modal এর জন্য

  const {
    data: orders = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/my?email=${user.email}`);
      return res.data;
    },
  });

  /* -------- Cancel Order with SweetAlert2 -------- */
  const handleCancel = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // আপনার নতুন ইউজার ক্যানসেল রাউট
          const res = await axiosSecure.patch(`/orders/cancel/${orderId}`);
          if (res.data.modifiedCount > 0) {
            Swal.fire({
              title: "Cancelled!",
              text: "Your order has been cancelled.",
              icon: "success",
              confirmButtonColor: "#422ad5",
            });
            refetch();
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message || "Failed to cancel order",
            icon: "error",
          });
        }
      }
    });
  };

  /* -------- Pay Order -------- */
  const handlePay = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse text-lg">
        Loading your orders...
      </div>
    );
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load orders. Please refresh.
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-6">
        <h2 className="text-3xl font-bold text-[#422ad5] mb-8 flex items-center gap-2">
          My Orders{" "}
          <span className="text-sm bg-[#422ad5]/10 px-3 py-1 rounded-full">
            {orders.length}
          </span>
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-500 text-sm uppercase">
                  <th className="bg-transparent">Meal</th>
                  <th className="bg-transparent">Qty</th>
                  <th className="bg-transparent">Total</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent">Payment</th>
                  <th className="bg-transparent text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    className="bg-gray-50 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <td className="rounded-l-2xl font-semibold text-gray-700">
                      {o.mealName}
                    </td>
                    <td>{o.quantity}</td>
                    <td className="font-bold text-[#422ad5]">
                      ${o.price * o.quantity}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          o.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : o.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          o.paymentStatus === "paid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {o.paymentStatus || "unpaid"}
                      </span>
                    </td>

                    <td className="rounded-r-2xl">
                      <div className="flex justify-center gap-2">
                        {/* PAY BUTTON */}
                        {o.orderStatus !== "cancelled" &&
                          o.paymentStatus !== "paid" && (
                            <button
                              onClick={() => handlePay(o._id)}
                              className="btn btn-sm bg-[#422ad5] border-none text-white hover:bg-black tooltip"
                              data-tip="Pay Now"
                            >
                              <CreditCard size={16} />
                            </button>
                          )}

                        {/* DETAILS BUTTON */}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50 tooltip"
                          data-tip="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        {/* CANCEL BUTTON */}
                        {o.orderStatus === "pending" &&
                          o.paymentStatus !== "paid" && (
                            <button
                              onClick={() => handleCancel(o._id)}
                              className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 tooltip"
                              data-tip="Cancel Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------- DETAILS MODAL ---------------- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Order Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span className="text-gray-500">Meal Name:</span>
                  <span className="font-semibold">
                    {selectedOrder.mealName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono text-xs">{selectedOrder._id}</span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span className="text-gray-500">Chef Email:</span>
                  <span className="font-semibold text-blue-600">
                    {selectedOrder.chefId}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-b border-dashed pb-2">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="font-semibold text-gray-700">
                    {selectedOrder.userAddress}
                  </span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-lg font-bold">Total Price:</span>
                  <span className="text-lg font-bold text-[#422ad5]">
                    ${selectedOrder.price * selectedOrder.quantity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
