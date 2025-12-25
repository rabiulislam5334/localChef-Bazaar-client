import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"; // SweetAlert2 ইমপোর্ট করা হয়েছে
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
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const imgKey = import.meta.env.VITE_IMGBB_KEY;
  const imgUploadURL = `https://api.imgbb.com/1/upload?key=${imgKey}`;

  useEffect(() => {
    register("foodImage", { required: "Food image is required" });
  }, [register]);

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setValue("foodImage", [file], { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  };

  if (authLoading)
    return (
      <p className="text-center py-20 font-bold text-indigo-600 animate-pulse">
        Checking Chef Authentication...
      </p>
    );

  const onSubmit = async (data) => {
    // লোডিং টোস্ট শুরু
    const loadingToast = toast.loading("Uploading image and saving meal...");

    try {
      // ১. ইমেজ আপলোড করা
      const formData = new FormData();
      formData.append("image", data.foodImage[0]);

      const imgRes = await fetch(imgUploadURL, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (!imgRes.success) throw new Error("ImageBB upload failed");

      // ২. ডাটা অবজেক্ট তৈরি
      const mealData = {
        foodName: data.foodName.trim(),
        price: parseFloat(data.price),
        ingredients: data.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        estimatedDeliveryTime: data.estimatedDeliveryTime.trim(),
        chefExperience: data.chefExperience.trim(),
        foodImage: imgRes.data.display_url,
        chefName: user?.displayName || "Anonymous Chef",
        chefEmail: user?.email, // আপনার সার্ভার লজিক অনুযায়ী chefEmail পাঠানো হচ্ছে
        rating: 0,
        createdAt: new Date().toISOString(),
      };

      // ৩. ডাটাবেজে সেভ করা
      const res = await axiosSecure.post("/meals", mealData);

      if (res.status === 200 || res.status === 201) {
        toast.dismiss(loadingToast); // লোডিং টোস্ট বন্ধ করা

        // --- SweetAlert2 সাকসেস মেসেজ ---
        Swal.fire({
          title: "Meal Created Successfully!",
          text: `${mealData.foodName} has been added to your kitchen.`,
          icon: "success",
          confirmButtonColor: "#422ad5",
          confirmButtonText: "View My Meals",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            reset();
            setPreview(null);
            navigate("/dashboard/my-meals");
          }
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to create meal", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100">
        <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Add New Meal 👨‍🍳
            </h2>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Fill in the details to publish your signature dish
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("Validation Errors:", err);
            toast.error("Please fill all required fields correctly!");
          })}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2">
                <Utensils size={14} className="text-indigo-500" /> Food Name
              </label>
              <input
                {...register("foodName", { required: "Name is required" })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="e.g. Traditional Spicy Ramen"
              />
              {errors.foodName && (
                <p className="text-rose-500 text-xs mt-2 font-bold ml-1">
                  {errors.foodName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-indigo-500" /> Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="15.00"
              />
              {errors.price && (
                <p className="text-rose-500 text-xs mt-2 font-bold ml-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2">
                <ClipboardList size={14} className="text-indigo-500" />{" "}
                Ingredients
              </label>
              <textarea
                rows={4}
                {...register("ingredients", {
                  required: "Ingredients are required",
                })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none resize-none transition-all"
                placeholder="Noodles, Boiled Egg, Soy Sauce, Green Onion"
              />
              {errors.ingredients && (
                <p className="text-rose-500 text-xs mt-2 font-bold ml-1">
                  {errors.ingredients.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-indigo-500" /> Delivery
                </label>
                <input
                  {...register("estimatedDeliveryTime", {
                    required: "Required",
                  })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  placeholder="20-30 mins"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2 text-nowrap">
                  <ChefHat size={14} className="text-indigo-500" /> Experience
                </label>
                <input
                  {...register("chefExperience", { required: "Required" })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  placeholder="5 Years"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2 mb-2">
                <ImagePlus size={14} className="text-indigo-500" /> Food Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative h-[220px] border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center overflow-hidden ${
                  isDragging
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center group">
                    <UploadCloud
                      size={48}
                      className="mx-auto text-gray-300 group-hover:text-indigo-400 transition-colors"
                    />
                    <p className="font-black text-gray-400 mt-3 text-sm tracking-tight">
                      DROP IMAGE HERE
                    </p>
                    <p className="text-[10px] text-gray-300 uppercase mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {errors.foodImage && (
                <p className="text-rose-500 text-xs mt-3 font-bold ml-1">
                  {errors.foodImage.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="lg:col-span-2 w-full bg-[#422ad5] hover:bg-[#351fb3] text-white py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-indigo-100 mt-4"
          >
            Create & Publish Dish <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;
