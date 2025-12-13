import React from "react";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PlatformStats = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading stats...</div>;
  if (isError) return <div className="p-6">Failed to load stats</div>;

  const paymentsData = [
    { name: "Total Payment", value: data?.totalPaymentAmount || 0 },
    { name: "Users", value: data?.totalUsers || 0 },
  ];

  const ordersData = (data?.orderStatusCounts || []).map((s) => ({
    name: s._id || "Unknown",
    value: s.count || 0,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Platform Statistics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Payments & Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Orders Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {ordersData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Payment</div>
          <div className="text-2xl font-bold">
            ${data?.totalPaymentAmount || 0}
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Orders Pending</div>
          <div className="text-2xl font-bold">{data?.ordersPending || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
