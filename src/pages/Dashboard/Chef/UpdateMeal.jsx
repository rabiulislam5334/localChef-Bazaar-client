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
    formState: { errors },
  } = useForm();

  // Load existing meal data
  useEffect(() => {
    axiosSecure.get(`/meals/${id}`).then((res) => {
      setMeal(res.data);
      reset(res.data);
    });
  }, [id, axiosSecure, reset]);

  const onSubmit = async (data) => {
    try {
      let imageURL = meal.foodImage;

      // If user uploads a new image → upload to imgbb
      if (data.foodImage && data.foodImage.length > 0) {
        const imgForm = new FormData();
        imgForm.append("image", data.foodImage[0]);

        const imgRes = await fetch(imgUploadURL, {
          method: "POST",
          body: imgForm,
        }).then((res) => res.json());

        if (!imgRes.success) {
          toast.error("Image upload failed!");
          return;
        }

        imageURL = imgRes.data.display_url;
      }

      const updatedMeal = {
        foodName: data.foodName,
        ingredients: data.ingredients.split(",").map((i) => i.trim()),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        price: parseFloat(data.price),
        foodImage: imageURL,
      };

      const res = await axiosSecure.patch(`/meals/${id}`, updatedMeal);

      if (res.data.modifiedCount > 0) {
        toast.success("Meal updated successfully!");
        navigate("/dashboard/my-meals");
      } else {
        toast("No changes made!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed!");
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
            type="text"
            {...register("foodName", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.foodName && <p className="text-red-500">Required</p>}
        </div>

        {/* Price */}
        <div>
          <label className="font-medium">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="font-medium">Ingredients (comma separated)</label>
          <input
            type="text"
            {...register("ingredients", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Estimated Delivery Time */}
        <div>
          <label className="font-medium">Estimated Delivery Time</label>
          <input
            type="text"
            {...register("estimatedDeliveryTime", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Chef Experience */}
        <div>
          <label className="font-medium">Chef Experience</label>
          <textarea
            {...register("chefExperience", { required: true })}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        {/* Existing Image Preview */}
        <div>
          <p className="font-medium mb-1">Current Image</p>
          <img
            src={meal.foodImage}
            alt=""
            className="w-40 h-40 object-cover rounded"
          />
        </div>

        {/* New Image Upload */}
        <div>
          <label className="font-medium">Replace Image (optional)</label>
          <input
            type="file"
            {...register("foodImage")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-full" type="submit">
          Update Meal
        </button>
      </form>
    </div>
  );
};

export default UpdateMeal;
