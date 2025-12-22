import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const password = watch("password");

  /* ---------------- Image Change ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ---------------- Register ---------------- */
  const handleRegistration = async (data) => {
    const toastId = toast.loading("Creating your account...");
    let firebaseUser = null;

    try {
      // 1️⃣ Firebase register
      const result = await registerUser(data.email, data.password);
      firebaseUser = result.user;

      // 2️⃣ Upload image
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const photoURL = imgRes.data?.data?.display_url;
      if (!photoURL) throw new Error("Image upload failed");

      // 🔥 3️⃣ UPDATE PROFILE (FIXED)
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      // 4️⃣ Backend save
      const idToken = await firebaseUser.getIdToken();
      await axiosInstance.post("/auth/firebase-login", {
        idToken,
        name: data.name,
        imageUrl: photoURL,
        address: data.address,
      });

      toast.success("Registration successful!", { id: toastId });
      navigate("/");
    } catch (error) {
      console.error(error);

      if (firebaseUser) {
        await firebaseUser.delete().catch(() => {});
      }

      toast.error(error.message || "Registration failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow p-8">
        <h2 className="text-3xl font-black text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
          {/* Photo */}
          <div className="flex items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-2 border-dashed flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={30} className="text-indigo-300" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("photo", { required: true })}
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Name */}
          <Input
            icon={<User />}
            {...register("name", { required: true })}
            placeholder="Full Name"
          />

          {/* Email */}
          <Input
            icon={<Mail />}
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
          />

          {/* Address */}
          <textarea
            {...register("address", { required: true })}
            placeholder="Address"
            className="w-full bg-gray-50 rounded-2xl p-4"
          />

          {/* Password */}
          <PasswordInput
            show={showPass}
            toggle={() => setShowPass(!showPass)}
            {...register("password", { required: true })}
            placeholder="Password"
          />

          {/* Confirm Password */}
          <PasswordInput
            show={showConfirmPass}
            toggle={() => setShowConfirmPass(!showConfirmPass)}
            {...register("confirmPassword", {
              validate: (v) => v === password,
            })}
            placeholder="Confirm Password"
          />

          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">
            Create Account <ArrowRight className="inline ml-2" />
          </button>

          <p className="text-center">
            Already have account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Reusable Inputs ---------------- */

const Input = React.forwardRef(({ icon, ...props }, ref) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      ref={ref}
      {...props}
      className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4"
    />
  </div>
));

const PasswordInput = React.forwardRef(({ show, toggle, ...props }, ref) => (
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      ref={ref}
      type={show ? "text" : "password"}
      {...props}
      className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-12"
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      {show ? <EyeOff /> : <Eye />}
    </button>
  </div>
));

export default Register;
