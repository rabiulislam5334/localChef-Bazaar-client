import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Image as ImageIcon,
  ChevronLeft,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UpdateMeal = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const imgKey = import.meta.env.VITE_IMGBB_KEY;
  const imgUploadURL = `https://api.imgbb.com/1/upload?key=${imgKey}`;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // ফাইল ইনপুট ওয়াচ করা (প্রিভিউ এর জন্য)
  const imageFile = watch("foodImage");

  useEffect(() => {
    if (imageFile && imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setImgPreview(objectUrl);

      // মেমোরি ক্লিনআপ
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  // ডাটা লোড করা
  useEffect(() => {
    const loadMeal = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/meals/${id}`);

        // ইনগ্রেডিয়েন্টস অ্যারে থেকে কমা সেপারেটেড স্ট্রিং এ রূপান্তর
        const initialData = {
          ...res.data,
          ingredients: Array.isArray(res.data.ingredients)
            ? res.data.ingredients.join(", ")
            : res.data.ingredients,
        };

        setMeal(res.data);
        reset(initialData);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not find the meal.");
      } finally {
        setLoading(false);
      }
    };
    loadMeal();
  }, [id, axiosSecure, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Saving changes...");
    try {
      let imageURL = meal.foodImage;

      // ১) ছবি আপলোড লজিক (নিখুঁত চেক)
      const newImage = data.foodImage?.[0]; // প্রথম ফাইলটি ধরুন

      if (newImage && newImage instanceof File) {
        const formData = new FormData();
        formData.append("image", newImage);

        const imgRes = await fetch(imgUploadURL, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        if (imgRes.success) {
          imageURL = imgRes.data.display_url;
        } else {
          throw new Error("Image upload failed. Please try again.");
        }
      }

      // ২) ডেটা অবজেক্ট
      const updatedMeal = {
        foodName: data.foodName,
        ingredients:
          typeof data.ingredients === "string"
            ? data.ingredients.split(",").map((i) => i.trim())
            : data.ingredients,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        price: parseFloat(data.price),
        foodImage: imageURL,
      };

      // ৩) PATCH রিকোয়েস্ট
      const res = await axiosSecure.patch(`/meals/${id}`, updatedMeal);

      if (res.data.modifiedCount > 0 || res.status === 200) {
        toast.success("Dish updated successfully! ✨", { id: toastId });
        navigate("/dashboard/my-meals");
      } else {
        toast("No changes detected.", { id: toastId, icon: "ℹ️" });
      }
    } catch (err) {
      console.error("Update Error:", err);
      // যদি এরর মেসেজে '401' বা '403' থাকে, তার মানে আপনার টোকেন সমস্যা
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-600 mb-2" size={32} />
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-bold mb-6 transition-all"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-10 text-white">
            <h2 className="text-3xl font-black tracking-tight">Update Meal</h2>
            <p className="opacity-70 font-medium">
              Refine your recipe and pricing details
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="form-control">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Food Name
                  </label>
                  <input
                    {...register("foodName", { required: "Name is required" })}
                    className="input input-bordered w-full rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-600 py-6"
                  />
                  {errors.foodName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.foodName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", { required: true })}
                      className="input input-bordered w-full rounded-2xl bg-gray-50 border-none py-6"
                    />
                  </div>
                  <div className="form-control">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                      Time
                    </label>
                    <input
                      {...register("estimatedDeliveryTime", { required: true })}
                      className="input input-bordered w-full rounded-2xl bg-gray-50 border-none py-6"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Ingredients
                  </label>
                  <textarea
                    {...register("ingredients", { required: true })}
                    placeholder="Comma separated list..."
                    className="textarea textarea-bordered w-full rounded-2xl bg-gray-50 border-none h-40 pt-4"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="form-control">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Meal Image
                  </label>
                  <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group">
                    <img
                      src={imgPreview || meal?.foodImage}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <ImageIcon className="text-white mb-2" size={32} />
                      <span className="text-white text-xs font-bold uppercase tracking-widest">
                        Change Photo
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("foodImage")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Chef Note / Experience
                  </label>
                  <textarea
                    {...register("chefExperience", { required: true })}
                    className="textarea textarea-bordered w-full rounded-2xl bg-gray-50 border-none h-40 pt-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-2xl h-16 text-lg font-black shadow-xl shadow-indigo-100 mt-4"
                >
                  {isSubmitting ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save size={20} /> Update Meal
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMeal;
