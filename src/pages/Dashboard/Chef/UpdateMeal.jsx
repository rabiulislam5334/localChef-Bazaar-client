import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UpdateMeal = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);

  const imgKey = import.meta.env.VITE_IMGBB_KEY;
  const imgUploadURL = `https://api.imgbb.com/1/upload?key=${imgKey}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load existing meal
  useEffect(() => {
    const loadMeal = async () => {
      const res = await axiosSecure.get(`/meals/${id}`);

      const formData = {
        ...res.data,
        ingredients: Array.isArray(res.data.ingredients)
          ? res.data.ingredients.join(", ")
          : "",
      };

      setMeal(res.data);
      reset(formData);
    };

    loadMeal();
  }, [id, axiosSecure, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      // Normalize ingredients
      const ingredientsArray = data.ingredients
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean);

      if (ingredientsArray.length === 0) {
        toast.error("Please enter at least one ingredient");
        return;
      }

      let imageURL = meal.foodImage;

      // Upload new image if selected
      if (data.foodImage?.length === 1) {
        const formData = new FormData();
        formData.append("image", data.foodImage[0]);

        const res = await fetch(imgUploadURL, {
          method: "POST",
          body: formData,
        });

        const imgData = await res.json();

        if (!imgData.success) {
          toast.error(imgData?.error?.message || "Image upload failed");
          return;
        }

        imageURL = imgData.data.display_url;
      }

      const updatedMeal = {
        foodName: data.foodName.trim(),
        ingredients: ingredientsArray,
        estimatedDeliveryTime: data.estimatedDeliveryTime.trim(),
        chefExperience: data.chefExperience.trim(),
        price: Number(data.price),
        foodImage: imageURL,
      };

      const res = await axiosSecure.patch(`/meals/${id}`, updatedMeal);

      if (res.data.modifiedCount > 0) {
        toast.success("Meal updated successfully!");
        navigate("/dashboard/my-meals");
      } else {
        toast("No changes detected");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!meal) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Update Meal</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Food Name */}
        <div>
          <label className="font-medium">Food Name</label>
          <input
            {...register("foodName", { required: "Food name is required" })}
            className="input input-bordered w-full"
          />
          {errors.foodName && (
            <p className="text-red-500 text-sm">{errors.foodName.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="font-medium">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="font-medium">Ingredients (comma separated)</label>
          <input
            {...register("ingredients", {
              required: "Ingredients are required",
              validate: (v) =>
                v.split(",").some((i) => i.trim()) ||
                "Enter at least one ingredient",
            })}
            className="input input-bordered w-full"
            placeholder="rice, chicken, oil"
          />
          {errors.ingredients && (
            <p className="text-red-500 text-sm">{errors.ingredients.message}</p>
          )}
        </div>

        {/* Estimated Delivery Time */}
        <div>
          <label className="font-medium">Estimated Delivery Time</label>
          <input
            {...register("estimatedDeliveryTime", {
              required: "Delivery time required",
            })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Chef Experience */}
        <div>
          <label className="font-medium">Chef Experience</label>
          <textarea
            {...register("chefExperience", {
              required: "Chef experience required",
            })}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Image Preview */}
        <div>
          <p className="font-medium mb-1">Current Image</p>
          <img
            src={meal.foodImage}
            className="w-40 h-40 object-cover rounded"
            alt=""
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-medium">Replace Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            {...register("foodImage")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? "Updating..." : "Update Meal"}
        </button>
      </form>
    </div>
  );
};

export default UpdateMeal;
