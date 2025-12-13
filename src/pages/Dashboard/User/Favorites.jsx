import React from "react";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
    try {
      await axiosSecure.delete(`/favorites/${id}`);
      toast.success("Removed from favorites");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove");
    }
  };

  if (isLoading) return <div className="p-6">Loading favorites...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Favorites</h2>
      {favorites.length === 0 ? (
        <div>No favorites yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Meal</th>
                <th>Chef</th>
                <th>Price</th>
                <th>Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={f.mealImage || f.foodImage || ""}
                        alt={f.mealName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-semibold">{f.mealName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{f.chefName}</td>
                  <td>${f.price}</td>
                  <td>{new Date(f.addedTime).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
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

export default Favorites;
