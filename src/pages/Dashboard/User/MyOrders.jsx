import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleCancel = async (orderId) => {
    try {
      await axiosSecure.patch(`/orders/${orderId}/status`, {
        newStatus: "cancelled",
      });
      toast.success("Order cancelled");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Cancel failed");
    }
  };

  const handlePay = (orderId) => {
    navigate(`/payment?orderId=${orderId}`);
  };

  if (isLoading) return <div className="p-6">Loading orders...</div>;
  if (isError) return <div className="p-6">Failed to load orders</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Meal</th>
                <th>Chef</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={o._id}>
                  <td>{i + 1}</td>
                  <td>{o.mealName}</td>
                  <td>{o.chefName || "N/A"}</td>
                  <td>{o.quantity}</td>
                  <td>${o.price * o.quantity}</td>
                  <td>{o.orderStatus}</td>
                  <td>{o.paymentStatus || "unpaid"}</td>

                  <td className="flex gap-2">
                    {o.orderStatus === "accepted" &&
                      o.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handlePay(o._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Pay
                        </button>
                      )}

                    {o.orderStatus === "pending" &&
                      o.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleCancel(o._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Cancel
                        </button>
                      )}

                    <button
                      onClick={() => toast("Details coming soon")}
                      className="btn btn-sm"
                    >
                      Details
                    </button>
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

export default MyOrders;
