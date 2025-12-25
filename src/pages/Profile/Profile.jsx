import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  User,
  MapPin,
  BadgeCheck,
  Camera,
  Send,
  ShieldCheck,
  Mail,
  Fingerprint,
} from "lucide-react";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, setUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  const { register, handleSubmit, reset, watch } = useForm();

  // ইমেজ প্রিভিউ দেখার জন্য watch ব্যবহার করা হয়েছে
  const photoPreview = watch("photoURL");

  const loadProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/me");
      if (res.data) {
        setProfile(res.data);
        reset({
          name: res.data.name || user?.displayName || "",
          address: res.data.address || "",
          photoURL: res.data.imageUrl || user?.photoURL || "",
        });
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  // 🔹 প্রোফাইল আপডেটে SweetAlert2 যোগ করা হয়েছে
  const onUpdateProfile = async (data) => {
    try {
      // Firebase আপডেট
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      });

      // DB আপডেট
      const res = await axiosSecure.patch("/users/me", {
        name: data.name,
        address: data.address,
        imageUrl: data.photoURL,
      });

      if (res.data) {
        setUser((prev) => ({
          ...prev,
          displayName: data.name,
          photoURL: data.photoURL,
        }));

        // সাকসেস মেসেজ SweetAlert2 দিয়ে
        Swal.fire({
          title: "Profile Updated!",
          text: "Your information has been saved successfully.",
          icon: "success",
          confirmButtonColor: "#422ad5",
        });

        loadProfile();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const handleRoleRequest = (type) => {
    Swal.fire({
      title: `Apply for ${type.toUpperCase()}?`,
      text: "Admin will review your request.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      confirmButtonText: "Yes, Send!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const requestData = {
            userId: profile._id,
            userName: profile.name,
            userEmail: profile.email,
            requestType: type,
            requestStatus: "pending",
            requestTime: new Date().toISOString(),
          };
          await axiosSecure.post("/requests", requestData);
          Swal.fire("Sent!", `Your request is now pending.`, "success");
        } catch (err) {
          Swal.fire("Error", "Request already exists or failed.", "error");
        }
      }
    });
  };

  if (!profile)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-[#422ad5] to-[#a294f9]" />

        <div className="px-8 pb-10">
          <div className="relative flex flex-wrap items-end -mt-12 gap-6 mb-12">
            {/* ইমেজটি এখন লাইভ প্রিভিউ দেখাবে */}
            <div className="relative group">
              <img
                src={
                  photoPreview ||
                  profile.imageUrl ||
                  "https://i.ibb.co/2kRkYwL/default-avatar.png"
                }
                className="w-40 h-40 rounded-[2rem] object-cover ring-8 ring-white shadow-xl transition-all"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={30} />
              </div>
            </div>

            <div className="flex-1 min-w-[200px] mb-4">
              <h2 className="text-4xl font-black text-gray-800 flex items-center gap-2">
                {profile.name} <BadgeCheck className="text-[#422ad5] w-8 h-8" />
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-50 text-[#422ad5] text-xs font-black uppercase rounded-full">
                  Role: {profile.role}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-black uppercase rounded-full ${
                    profile.status === "fraud"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  Status: {profile.status || "Active"}
                </span>
                {profile.role === "chef" && profile.chefId && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black uppercase rounded-full flex items-center gap-1 border border-orange-100">
                    <Fingerprint size={12} /> ID: {profile.chefId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Information Column */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b pb-2">
                User Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-indigo-400" size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Email
                    </p>
                    <p className="font-bold text-sm text-gray-700">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-indigo-400" size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Address
                    </p>
                    <p className="font-bold text-sm text-gray-700">
                      {profile.address || "Not set yet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b pb-2">
                  Apply for Rank
                </h3>
                {profile.role !== "admin" && (
                  <>
                    {profile.role !== "chef" && (
                      <button
                        onClick={() => handleRoleRequest("chef")}
                        className="btn btn-sm w-full bg-white border-2 border-indigo-100 text-[#422ad5] hover:bg-indigo-50 rounded-xl font-bold"
                      >
                        <Send size={14} /> Be a Chef
                      </button>
                    )}
                    <button
                      onClick={() => handleRoleRequest("admin")}
                      className="btn btn-sm w-full bg-[#422ad5] text-white hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-100"
                    >
                      <ShieldCheck size={14} /> Be an Admin
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Update Form Column */}
            <div className="lg:col-span-2 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b pb-4 mb-6">
                Edit Profile Information
              </h3>
              <form
                onSubmit={handleSubmit(onUpdateProfile)}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="form-control">
                  <label className="label text-[11px] font-black text-gray-400 uppercase">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    className="input input-bordered rounded-xl bg-white focus:ring-2 ring-indigo-200 border-none shadow-sm"
                  />
                </div>
                <div className="form-control">
                  <label className="label text-[11px] font-black text-gray-400 uppercase">
                    Profile Photo URL
                  </label>
                  <input
                    {...register("photoURL")}
                    placeholder="https://image-link.com"
                    className="input input-bordered rounded-xl bg-white focus:ring-2 ring-indigo-200 border-none shadow-sm"
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label text-[11px] font-black text-gray-400 uppercase">
                    Home Address
                  </label>
                  <textarea
                    {...register("address")}
                    className="textarea textarea-bordered rounded-xl bg-white focus:ring-2 ring-indigo-200 border-none shadow-sm h-24"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="btn bg-slate-900 text-white w-full rounded-xl font-black uppercase tracking-widest hover:bg-black border-none shadow-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
