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
  CartesianGrid,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Users,
  DollarSign,
  ShoppingBag,
  Activity,
  TrendingUp,
} from "lucide-react";

const PlatformStats = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load statistics.
      </div>
    );

  // Chart Data Preparation
  const paymentsData = [
    { name: "Revenue", value: data?.totalPaymentAmount || 0 },
    { name: "Users Count", value: (data?.totalUsers || 0) * 10 }, // Scaling for visibility if needed
  ];

  const ordersData = (data?.orderStatusCounts || []).map((s) => ({
    name: s._id || "Unknown",
    value: s.count || 0,
  }));

  const COLORS = ["#422ad5", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Activity className="text-[#422ad5]" size={32} /> Platform Insights
          </h2>
          <p className="text-gray-400 font-medium mt-1">
            Real-time overview of your platform's performance
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={data?.totalUsers || 0}
            icon={<Users className="text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Total Revenue"
            value={`$${data?.totalPaymentAmount || 0}`}
            icon={<DollarSign className="text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Pending Orders"
            value={data?.ordersPending || 0}
            icon={<ClockIcon className="text-amber-600" />}
            bgColor="bg-amber-50"
          />
          <StatCard
            title="Growth"
            value="+12.5%"
            icon={<TrendingUp className="text-purple-600" />}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-700 mb-6 flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#422ad5]" /> Revenue vs
              Users
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={paymentsData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#422ad5"
                  radius={[10, 10, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-700 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-[#422ad5]" /> Order
              Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {Array.isArray(ordersData) &&
                    ordersData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
    <div
      className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
        {title}
      </p>
      <h4 className="text-2xl font-black text-gray-800">{value}</h4>
    </div>
  </div>
);

// Helper Icon for Pending
const ClockIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default PlatformStats;
