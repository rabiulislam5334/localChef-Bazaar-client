import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      // backend should provide GET /payments/my which uses req.serverUser.email (cookie) to filter
      const res = await axiosSecure.get("/payments/my");
      return res.data || [];
    },
  });

  if (isLoading) return <div className="p-6">Loading payments...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      {payments.length === 0 ? (
        <div>No payment records found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Order ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(payments) &&
                payments.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    <td>{p.transactionId}</td>
                    <td>${p.amount}</td>
                    <td>{p.orderId}</td>
                    <td>{new Date(p.paymentTime).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
