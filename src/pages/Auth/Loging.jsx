import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router"; //
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  Chrome,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { signInUser, signInWithGoogle } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // 🔥 রিডাইরেক্ট পাথ সেফ করা
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const email = data.email.trim().toLowerCase(); // lowercase ও ভালো
      const password = data.password.trim();

      await signInUser(email, password);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err.code);
      toast.error("ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(() => {
        toast.success("Google Login Successful!");
        navigate(from, { replace: true });
      })
      .catch(() => toast.error("Google login failed"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
            <LogIn size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-gray-400 mt-2 font-medium">
            Please enter your details to continue
          </p>
        </div>

        {/* Social Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-600 mb-6"
        >
          <Chrome size={20} className="text-red-500" />
          Continue with Google
        </button>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-4 bg-white text-xs font-bold text-gray-400 uppercase tracking-widest">
            Or login with email
          </span>
          <br /> <br />
          <span className="relative px-1 bg-white text-xs font-bold text-gray-400  tracking-widest">
            Demo credentials <br />
            <div>
              Admin:rabiulislam@gmail.com <br />
              Chef:riya@khan.com <br />
              User:robin@khan.com <br />
              All password:Rabiul@5334 <br />
            </div>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widener">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                autoComplete="email" // 🔥 অটো-ফিল ফিক্স
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                autoComplete="current-password" // 🔥 অটো-ফিল ফিক্স
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-indigo-600 font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-gray-300"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-gray-500">
          Don’t have an account?{" "}
          <Link
            className="text-indigo-600 font-bold hover:underline"
            to="/auth/register"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <ShieldCheck size={14} className="text-green-500" />
          Secure Encryption Enabled
        </div>
      </motion.div>
    </div>
  );
}
