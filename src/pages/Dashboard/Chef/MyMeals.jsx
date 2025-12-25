import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"; // SweetAlert2 ইমপোর্ট
import toast from "react-hot-toast";
import {
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Star,
  UtensilsCrossed,
  Clock,
  ChefHat,
  Hash,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyMeals = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: meals = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-meals", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef/my-meals`, {
        params: { email: user?.email },
      });
      return res.data;
    },
  });

  // --- ডিলিট হ্যান্ডলার উইথ SweetAlert2 ---
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This dish will be removed from your menu forever!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // rose-600
      cancelButtonColor: "#6B7280", // gray-500
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 font-bold",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/meals/${id}`);
          if (res.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "The meal has been removed.",
              icon: "success",
              confirmButtonColor: "#4F46E5", // indigo-600
            });
            refetch();
          }
        } catch (err) {
          Swal.fire(
            "Error!",
            err.response?.data?.message || "Failed to delete.",
            "error"
          );
        }
      }
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
          Loading Menu...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 min-h-screen bg-[#FDFCFB]">
      {/* --- Header --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <span className="text-indigo-600 font-black uppercase tracking-wider text-xs">
              Chef Dashboard
            </span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">
            My Kitchen
          </h2>
          <p className="text-gray-500 mt-2 font-medium italic">
            Managing {meals.length} signature dishes
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => refetch()}
            className="p-4 bg-white hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => navigate("/dashboard/create-meal")}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={22} /> Add New Dish
          </button>
        </div>
      </div>

      {/* --- Table --- */}
      {meals.length === 0 ? (
        <div className="max-w-xl mx-auto mt-20 text-center p-16 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
          <UtensilsCrossed size={60} className="text-gray-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-gray-800">No Meals Found</h3>
          <p className="text-gray-500 mt-2 mb-8 font-medium">
            Your menu is empty.
          </p>
          <button
            onClick={() => navigate("/dashboard/create-meal")}
            className="btn btn-ghost text-indigo-600 font-black"
          >
            Create Your First Meal &rarr;
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full border-none">
              <thead className="bg-gray-50/50">
                <tr className="text-gray-400 border-none uppercase text-[11px] font-black tracking-widest">
                  <th className="py-8 px-10">Dish Details</th>
                  <th className="py-8">Pricing & Rating</th>
                  <th className="py-8">Chef Info</th>
                  <th className="py-8">Ingredients</th>
                  <th className="py-8 px-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {meals.map((meal) => (
                  <tr
                    key={meal._id}
                    className="hover:bg-indigo-50/10 transition-colors group"
                  >
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-md">
                          <img
                            src={meal.foodImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-xl mb-1">
                            {meal.foodName}
                          </p>
                          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                            <Clock size={14} className="text-indigo-400" />{" "}
                            {meal.estimatedDeliveryTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-gray-800">
                          ${meal.price}
                        </p>
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full w-fit text-xs font-black">
                          <Star size={12} fill="currentColor" />{" "}
                          {meal.rating || "5.0"}
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                          <ChefHat size={16} className="text-indigo-500" />{" "}
                          {meal.chefName || "You"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase opacity-60 font-black">
                          <Hash size={12} /> ID:{" "}
                          {meal._id.slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      <p className="text-xs text-gray-400 max-w-[150px] line-clamp-2 font-medium italic">
                        {Array.isArray(meal.ingredients)
                          ? meal.ingredients.join(", ")
                          : meal.ingredients}
                      </p>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/update-meal/${meal._id}`)
                          }
                          className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(meal._id)}
                          className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
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
  );
};

export default MyMeals;
