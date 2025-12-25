import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; // Fixed: react-router instead of react-router
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
    if (!file) {
      setPhotoPreview(null);
      return;
    }

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
      // 🔥 Trim & Clean Data 🔥
      const email = data.email.trim().toLowerCase();
      const password = data.password.trim();
      const name = data.name.trim();
      const address = data.address.trim();

      // Extra validation for spaces in password
      if (password !== data.password) {
        throw new Error("Password cannot have leading or trailing spaces");
      }

      // Validate photo exists
      if (!data.photo || !data.photo[0]) {
        throw new Error("Please upload a profile photo");
      }

      // 1️⃣ Firebase register
      const result = await registerUser(email, password);
      firebaseUser = result.user;

      // 2️⃣ Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const photoURL = imgRes.data?.data?.display_url;
      if (!photoURL) throw new Error("Image upload failed");

      // 3️⃣ Update Firebase profile
      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      // 4️⃣ Save to your backend (address now properly sent)
      const idToken = await firebaseUser.getIdToken();
      await axiosInstance.post("/auth/firebase-login", {
        idToken,
        name,
        imageUrl: photoURL,
        address, // Cleaned & trimmed
      });

      toast.success("Registration successful!", { id: toastId });
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);

      // Cleanup Firebase user if created
      if (firebaseUser) {
        await firebaseUser.delete().catch(() => {});
      }

      const errorMsg =
        error.message || "Registration failed. Please try again.";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-black text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-indigo-50 border-4 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={36} className="text-indigo-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("photo", {
                  required: "Profile photo is required",
                })}
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          {errors.photo && (
            <p className="text-red-500 text-sm text-center">
              {errors.photo.message}
            </p>
          )}

          {/* Name */}
          <div>
            <Input
              icon={<User />}
              autoComplete="name"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              icon={<Mail />}
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />
              <textarea
                {...register("address", {
                  required: "Address is required",
                })}
                placeholder="Full Address"
                rows={3}
                className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <PasswordInput
              show={showPass}
              toggle={() => setShowPass(!showPass)}
              autoComplete="new-password"
              placeholder="Password (min 6 characters)"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordInput
              show={showConfirmPass}
              toggle={() => setShowConfirmPass(!showConfirmPass)}
              autoComplete="new-password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight size={20} />
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Reusable Inputs (Updated with autoComplete) ---------------- */
const Input = React.forwardRef(({ icon, autoComplete, ...props }, ref) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      ref={ref}
      autoComplete={autoComplete}
      className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      {...props}
    />
  </div>
));

const PasswordInput = React.forwardRef(
  ({ show, toggle, autoComplete, ...props }, ref) => (
    <div className="relative">
      <Lock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        ref={ref}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className="w-full bg-gray-50 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        {...props}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
);

export default Register;
