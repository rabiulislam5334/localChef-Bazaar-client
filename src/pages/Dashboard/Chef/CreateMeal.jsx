import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CreateMeal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const imgKey = import.meta.env.VITE_IMGBB_KEY;
  const imgUploadURL = `https://api.imgbb.com/1/upload?key=${imgKey}`;

  const onSubmit = async (data) => {
    try {
      // 1) Upload image to imgbb
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

      const mealData = {
        foodName: data.foodName,
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        price: parseFloat(data.price),
        rating: 0,
        foodImage: imgRes.data.display_url,
        chefName: user?.displayName,
        userEmail: user?.email,
      };

      // 2) Save meal to DB
      const res = await axiosSecure.post("/meals", mealData);
      if (res.data.insertedId) {
        toast.success("Meal created successfully!");
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create meal!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Create a New Meal</h2>

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
          {errors.price && <p className="text-red-500">Required</p>}
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

        {/* Image Upload */}
        <div>
          <label className="font-medium">Food Image</label>
          <input
            type="file"
            {...register("foodImage", { required: true })}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-full" type="submit">
          Create Meal
        </button>
      </form>
    </div>
  );
};

export default CreateMeal;
