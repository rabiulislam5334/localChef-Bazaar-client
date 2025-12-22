import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; // লিঙ্কের জন্য এটি প্রয়োজন
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Trash2, User, ExternalLink, Calendar, HeartOff } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Favorites = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: favorites = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["favorites", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/favorites/my");
      return res.data || [];
    },
  });

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this from favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/favorites/${id}`);
          toast.success("Removed successfully");
          refetch();
        } catch (err) {
          toast.error("Failed to remove");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-dots loading-lg text-indigo-600"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            My Favorites
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Manage your saved delicious meals ({favorites.length})
          </p>
        </div>
        <div className="h-1 flex-1 max-w-[100px] bg-indigo-600 rounded-full hidden md:block mb-2"></div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
          <HeartOff size={48} className="text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium text-lg">
            No items in your favorites yet!
          </p>
          <Link
            to="/meals"
            className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Browse Meals
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2 px-4">
              {/* Table Head */}
              <thead className="bg-gray-50/50">
                <tr className="border-none text-gray-600 uppercase text-[11px] font-bold tracking-widest">
                  <th className="rounded-l-2xl py-5 pl-8">#</th>
                  <th>Meal Details</th>
                  <th>Chef</th>
                  <th>Price</th>
                  <th>Added Date</th>
                  <th className="rounded-r-2xl text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="before:block before:h-2">
                {favorites.map((f, i) => (
                  <tr
                    key={f._id}
                    className="group hover:bg-indigo-50/30 transition-all duration-300"
                  >
                    <td className="pl-8 font-bold text-gray-400 group-hover:text-indigo-600">
                      {String(i + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle w-16 h-16 shadow-md group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={
                                f.mealImage ||
                                f.foodImage ||
                                "https://via.placeholder.com/150"
                              }
                              alt={f.mealName}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-base">
                            {f.mealName || "Untitled Meal"}
                          </div>
                          <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-tighter">
                            Favorite Item
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-indigo-300" />
                        {f.chefName || "Guest Chef"}
                      </div>
                    </td>

                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-black text-sm">
                        ${f.price || 0}
                      </span>
                    </td>

                    <td className="text-gray-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {f.addedTime
                          ? new Date(f.addedTime).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>

                    <td className="text-center pr-8">
                      <div className="flex justify-center gap-3">
                        {/* Details Page Link */}
                        <Link
                          to={`/meals/${f.mealId}`}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                          title="View Details"
                        >
                          <ExternalLink size={18} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(f._id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                          title="Delete"
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

export default Favorites;
