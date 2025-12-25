import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Trash2, CreditCard, ChefHat } from "lucide-react"; // ChefHat যোগ করা হয়েছে
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: orders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/my?email=${user.email}`);
      return res.data;
    },
  });

  const handlePay = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  const handleCancel = async (orderId) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/orders/cancel/${orderId}`);
          if (res.data.modifiedCount > 0) {
            Swal.fire("Cancelled!", "Your order is cancelled.", "success");
            refetch();
          }
        } catch (err) {
          Swal.fire("Error!", "Failed to cancel order.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="text-center py-20 animate-pulse font-bold text-indigo-600">
        Loading your orders...
      </div>
    );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-[2.5rem] p-8 border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          My Culinary Orders{" "}
          <span className="bg-indigo-50 text-indigo-600 text-sm px-4 py-1 rounded-full">
            {orders.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o) => (
            <motion.div
              layout
              key={o._id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-800 leading-tight">
                    {o.mealName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Order ID: #{o._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    o.orderStatus === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : o.orderStatus === "accepted"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {o.orderStatus}
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Price:</span>
                  <span className="font-bold text-slate-700">
                    ${o.price} × {o.quantity}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-dashed pt-2">
                  <span className="text-slate-400 font-medium">Chef:</span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <ChefHat size={14} /> {o.chefName || "Assigned Soon"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  Chef ID: {o.chefId || "N/A"}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="text-xl font-black text-slate-900">
                  ${(o.price * o.quantity).toFixed(2)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Eye size={20} />
                  </button>

                  {/* Requirement Check: Pay button shows only if orderStatus === 'accepted' and paymentStatus === 'pending' */}
                  {o.orderStatus === "accepted" &&
                    o.paymentStatus === "pending" && (
                      <button
                        onClick={() => handlePay(o._id)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                      >
                        <CreditCard size={14} /> PAY NOW
                      </button>
                    )}

                  {/* Cancel button: Only if pending & unpaid */}
                  {o.orderStatus === "pending" &&
                    o.paymentStatus !== "paid" && (
                      <button
                        onClick={() => handleCancel(o._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                </div>
              </div>

              {/* Payment Badge */}
              {o.paymentStatus === "paid" && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-4 py-1 rotate-45 translate-x-3 translate-y-2 uppercase shadow-sm">
                  Paid
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Modal (Keeping your existing logic) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-5 right-5 p-2 hover:bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-black text-slate-900 mb-6">
                Order Summary
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <p className="flex justify-between border-b pb-2">
                  <span>Meal</span>{" "}
                  <span className="text-slate-900">
                    {selectedOrder.mealName}
                  </span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span>Delivery Time</span>{" "}
                  <span className="text-slate-900">
                    {selectedOrder.deliveryTime || "ASAP"}
                  </span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span>Chef Name</span>{" "}
                  <span className="text-slate-900">
                    {selectedOrder.chefName}
                  </span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span>Address</span>{" "}
                  <span className="text-slate-900 text-right">
                    {selectedOrder.userAddress}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
