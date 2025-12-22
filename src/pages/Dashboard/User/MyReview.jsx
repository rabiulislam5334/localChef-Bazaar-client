import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Edit3, Trash2, Star, Calendar, Utensils } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyReviews = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH MY REVIEWS ---------------- */
  useEffect(() => {
    // ইউজার ইমেইল লোড হওয়া পর্যন্ত অপেক্ষা করা
    if (user?.email) {
      fetchReviews();
    }
  }, [user?.email, axiosSecure]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // সার্ভার এখন হেডার থেকে টোকেন নিয়ে ইমেইল অনুযায়ী ফিল্টার করবে
      const res = await axiosSecure.get("/reviews/my");
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // ৪০১ এরর হলে হুক নিজেই লগআউট করাবে, এখানে শুধু মেসেজ দেখানো
      if (error.response?.status !== 401) {
        toast.error("Failed to load reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE REVIEW ---------------- */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/reviews/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Review deleted successfully");
            // ডাটাবেজ থেকে ডিলিট হলে লোকাল স্টেট থেকেও সরিয়ে ফেলা
            setReviews((prev) => prev.filter((r) => r._id !== id));
          }
        } catch (err) {
          toast.error("Failed to delete review");
        }
      }
    });
  };

  /* ---------------- UPDATE REVIEW ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = Number(form.rating.value);
    const comment = form.comment.value.trim();

    if (rating < 1 || rating > 5) {
      return toast.error("Rating must be between 1 and 5");
    }

    try {
      const res = await axiosSecure.patch(`/reviews/${selectedReview._id}`, {
        rating,
        comment,
      });

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        toast.success("Review updated!");
        setSelectedReview(null);
        fetchReviews(); // লেটেস্ট ডাটা দেখানোর জন্য রিফ্রেশ
      }
    } catch (err) {
      toast.error("Update failed. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-bars loading-lg text-indigo-600"></span>
        <p className="ml-4 font-bold text-gray-500">Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black border-l-4 border-indigo-600 pl-4">
          My Reviews{" "}
          <span className="text-indigo-600 ml-2">({reviews.length})</span>
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
          <Utensils className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 text-lg font-medium">
            You haven't written any reviews yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] uppercase tracking-wider font-bold mb-1">
                    <Utensils size={12} /> Meal Feedback
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {review.mealTitle || "Unnamed Meal"}
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                  <Star size={14} fill="currentColor" />
                  {review.rating}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl mb-6 min-h-[80px]">
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                  <Calendar size={13} />
                  {new Date(review.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                    title="Edit Review"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors duration-200"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- UPDATE MODAL ---------------- */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-2 text-gray-800 text-center">
              Update Your Review
            </h3>
            <p className="text-sm text-center text-gray-400 mb-6">
              Editing for: {selectedReview.mealTitle}
            </p>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  Rating (1 to 5 Stars)
                </label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  defaultValue={selectedReview.rating}
                  className="w-full bg-gray-50 rounded-2xl p-4 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  Your Comment
                </label>
                <textarea
                  name="comment"
                  defaultValue={selectedReview.comment}
                  className="w-full bg-gray-50 rounded-2xl p-4 h-36 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none resize-none transition-all text-gray-600"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 py-4 font-bold rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
