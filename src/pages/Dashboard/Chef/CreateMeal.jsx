import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  Utensils,
  DollarSign,
  Clock,
  ClipboardList,
  ChefHat,
  ImagePlus,
  Send,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CreateMeal = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false); // ড্র্যাগ স্টেট
  const [preview, setPreview] = useState(null); // ইমেজ প্রিভিউ

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const imgKey = import.meta.env.VITE_IMGBB_KEY;
  const imgUploadURL = `https://api.imgbb.com/1/upload?key=${imgKey}`;

  // ড্র্যাগ ইভেন্ট হ্যান্ডলার
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  const handleFileChange = (file) => {
    setValue("foodImage", [file]); // react-hook-form এ ভ্যালু সেট করা
    setPreview(URL.createObjectURL(file)); // প্রিভিউ দেখানো
  };

  if (loading) return null;

  const onSubmit = async (data) => {
    const toastId = toast.loading("Processing...");
    try {
      const formData = new FormData();
      formData.append("image", data.foodImage[0]);

      const imgRes = await fetch(imgUploadURL, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (!imgRes.success) return toast.error("Upload failed", { id: toastId });

      const mealData = {
        foodName: data.foodName,
        price: Number(data.price),
        ingredients: data.ingredients.split(",").map((i) => i.trim()),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        foodImage: imgRes.data.display_url,
        chefName: user.displayName || "Chef",
        userEmail: user.email,
        rating: 0,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/meals", mealData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Meal published! 🍽️", { id: toastId });
        reset();
        setPreview(null);
        navigate("/dashboard/my-meals");
      }
    } catch (err) {
      toast.error("Error occurred", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black text-gray-800">Add New Meal 👨‍🍳</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* ... আগের ইনপুটগুলো (Name, Price, etc.) এখানে থাকবে ... */}

          {/* Drag & Drop Image Upload Section */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImagePlus size={14} /> Food Image
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer overflow-hidden
                ${
                  isDragging
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud
                    size={40}
                    className={`mb-3 ${
                      isDragging
                        ? "text-indigo-600 animate-bounce"
                        : "text-gray-400"
                    }`}
                  />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold font-black">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or WebP (MAX. 5MB)
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg">
              Publish Meal <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;
