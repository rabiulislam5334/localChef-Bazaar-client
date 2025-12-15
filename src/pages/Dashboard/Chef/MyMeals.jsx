import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Navigate, useNavigate } from "react-router";
const MyMeals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [deleteId, setDeleteId] = useState(null);

  const { data: meals = [], refetch } = useQuery({
    queryKey: ["my-meals", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/chef/my-meals?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async () => {
    try {
      const res = await axiosSecure.delete(`/meals/${deleteId}`);
      if (res.data.deletedCount > 0) {
        toast.success("Meal deleted!");
        setDeleteId(null);
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Meals</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Meal</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {meals.map((meal, i) => (
              <tr key={meal._id}>
                <td>{i + 1}</td>

                <td className="flex items-center gap-3">
                  <img
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{meal.foodName}</p>
                    <p className="text-sm text-gray-500">
                      {meal.ingredients?.slice(0, 2).join(", ")}...
                    </p>
                  </div>
                </td>

                <td>${meal.price}</td>
                <td>{meal.rating}</td>

                <td>
                  <span
                    className={`badge ${
                      meal.status === "approved"
                        ? "badge-success"
                        : meal.status === "pending"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {meal.status || "pending"}
                  </span>
                </td>

                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/update-meal/${meal._id}`)
                      }
                      className="btn btn-sm btn-info"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => setDeleteId(meal._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this meal?</p>

            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeals;
