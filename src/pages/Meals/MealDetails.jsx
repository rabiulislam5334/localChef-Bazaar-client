import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  Clock,
  MapPin,
  User,
  ChefHat,
  ShoppingCart,
  X,
  Plus,
  Minus,
  MessageSquare,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

/* ---------------- Skeleton Loader ---------------- */
const Skeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="h-[450px] bg-gray-200 dark:bg-gray-700 rounded-3xl" />
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ---------------- Star Rating Display ---------------- */
const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={18}
        className={
          i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ))}
  </div>
);

/* ---------------- Interactive Star Input ---------------- */
const RatingInput = ({ rating, setRating }) => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setRating(i)}
        type="button"
      >
        <Star
          size={32}
          className={
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      </motion.button>
    ))}
  </div>
);

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Order States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);

  // Review States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const loadData = async () => {
      try {
        const [mealRes, reviewRes] = await Promise.all([
          axiosPublic.get(`/meals/${id}`),
          axiosPublic.get(`/reviews/${id}`),
        ]);
        setMeal(mealRes.data);
        setReviews(reviewRes.data || []);
      } catch (err) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, axiosPublic]);

  // Live Price Calculation
  const totalPrice = meal ? (orderQty * Number(meal.price)).toFixed(2) : 0;

  /* -------- Handle Order with SweetAlert -------- */
  const onSubmitOrder = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login", { state: `/meals/${id}` });

    const address = e.target.address.value;

    Swal.fire({
      title: "Confirm Your Order",
      text: `Total price is $${totalPrice}. Confirm order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm!",
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          foodId: id,
          mealName: meal.foodName,
          price: Number(meal.price),
          quantity: orderQty,
          total: Number(totalPrice),
          chefId: meal.chefId,
          userAddress: address,
          userEmail: user.email,
        };

        try {
          setOrderLoading(true);
          const res = await axiosSecure.post("/orders", payload);
          Swal.fire("Success!", "Order placed successfully!", "success");
          setIsOrderModalOpen(false);
          navigate(`/payment/${res.data.insertedId}`);
        } catch (err) {
          toast.error(err.response?.data?.message || "Order failed");
        } finally {
          setOrderLoading(false);
        }
      }
    });
  };

  /* -------- Handle Review Submission -------- */
  /* -------- Handle Review Submission (Rewritten) -------- */
  const onSubmitReview = async (e) => {
    e.preventDefault();

    // ১. ইউজার লগইন না থাকলে লগইন পেজে পাঠানো
    if (!user) {
      toast.error("Please login to post a review");
      return navigate("/login", { state: `/meals/${id}` });
    }

    // ২. রেটিং সিলেক্ট করা হয়েছে কিনা চেক করা
    if (reviewRating === 0) {
      return toast.error("Please select a rating star");
    }

    // ৩. কমেন্ট খালি কিনা চেক করা (অপশনাল কিন্তু ভালো)
    if (!reviewText.trim()) {
      return toast.error("Please write a comment");
    }

    try {
      setReviewLoading(true);

      const reviewPayload = {
        foodId: id,
        mealTitle: meal?.foodName || "Unknown Meal", // সার্ভারের জন্য মিলের নাম
        rating: reviewRating,
        comment: reviewText,
        reviewerName: user?.displayName || "Anonymous",
        reviewerImage: user?.photoURL || "",
        reviewerEmail: user?.email, // সার্ভারে ফিল্টার করার জন্য ইমেইল অবশ্যই লাগবে
        date: new Date(),
      };

      const res = await axiosSecure.post("/reviews", reviewPayload);

      // সাকসেস হলে লোকাল স্টেট আপডেট করা
      if (res.data.review) {
        setReviews([res.data.review, ...reviews]);
        toast.success("Thank you! Review posted successfully.");

        // ফর্ম এবং মোডাল রিসেট করা
        setIsReviewModalOpen(false);
        setReviewText("");
        setReviewRating(0);
      }
    } catch (err) {
      console.error("Review Error:", err);

      const errMsg = err.response?.data?.message || "Failed to post review";
      toast.error(errMsg);
    } finally {
      setReviewLoading(false);
    }
  };

  /* -------- Add to Favorite -------- */
  const addFavorite = async () => {
    if (!user) return navigate("/login", { state: `/meals/${id}` });
    try {
      await axiosSecure.post("/favorites", {
        mealId: id,
        mealName: meal.foodName,
        price: meal.price,
      });
      toast.success("Added to favorites ❤️");
    } catch (err) {
      toast.error(
        err.response?.status === 409 ? "Already in favorites" : "Failed"
      );
    }
  };

  if (loading) return <Skeleton />;
  if (!meal) return <div className="p-20 text-center">Meal not found</div>;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* --- TOP SECTION --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-2 gap-10"
        >
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full h-[450px] object-cover rounded-3xl shadow-xl"
          />

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-[#422ad5] mb-4">
              {meal.foodName}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={meal.rating} />
              <span className="text-gray-500">({meal.rating}/5)</span>
            </div>
            <p className="text-3xl font-black text-[#422ad5] mb-6">
              ${meal.price}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-gray-600 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <ChefHat size={18} /> {meal.chefName}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={18} /> {meal.estimatedDeliveryTime}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} /> {meal.deliveryArea}
              </p>
              <p className="flex items-center gap-2">
                <User size={18} /> {meal.chefExperience} Exp
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="btn bg-[#422ad5] text-white px-8 h-14 rounded-2xl border-none"
              >
                <ShoppingCart className="mr-2" /> Order Now
              </button>
              <button
                onClick={addFavorite}
                className="btn btn-outline border-[#422ad5] text-[#422ad5] h-14 rounded-2xl"
              >
                <Heart />
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- INGREDIENTS --- */}
        <div
          className="mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl"
          data-aos="fade-up"
        >
          <h2 className="text-xl font-bold text-[#422ad5] mb-3">Ingredients</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {Array.isArray(meal.ingredients)
              ? meal.ingredients.join(" • ")
              : meal.ingredients}
          </p>
        </div>

        {/* --- REVIEWS --- */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#422ad5]">
              Customer Reviews ({reviews.length})
            </h2>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-sm bg-[#422ad5] text-white"
            >
              <MessageSquare size={16} className="mr-1" /> Write Review
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <img
                          src={
                            r.reviewerImage ||
                            "https://i.ibb.co/5r5z0Lq/user.png"
                          }
                          className="w-12 h-12 rounded-xl object-cover"
                          alt=""
                        />
                        <div>
                          <h4 className="font-bold">{r.reviewerName}</h4>
                          <StarRating rating={r.rating} />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 italic">
                        {r.date
                          ? new Date(r.date).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      "{r.comment}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- ORDER MODAL --- */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-[2rem] relative"
            >
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold text-[#422ad5] mb-6">
                Complete Order
              </h2>
              <form onSubmit={onSubmitOrder} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 w-fit p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                      className="p-2 bg-white dark:bg-gray-600 rounded-lg"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-bold w-6 text-center">
                      {orderQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQty(orderQty + 1)}
                      className="p-2 bg-[#422ad5] text-white rounded-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    required
                    className="w-full p-4 rounded-xl border dark:bg-gray-700 outline-none focus:ring-2 focus:ring-[#422ad5]"
                  ></textarea>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <span className="font-medium">Total:</span>
                  <span className="text-2xl font-black text-[#422ad5]">
                    ${totalPrice}
                  </span>
                </div>
                <button
                  disabled={orderLoading}
                  className="w-full bg-[#422ad5] text-white py-4 rounded-xl font-bold shadow-lg"
                >
                  {orderLoading ? "Processing..." : "Confirm & Pay Now"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-[2rem] relative"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400"
              >
                <X />
              </button>
              <h2 className="text-2xl font-bold text-[#422ad5] mb-6">
                Write a Review
              </h2>
              <form onSubmit={onSubmitReview} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">
                    Rating
                  </label>
                  <RatingInput
                    rating={reviewRating}
                    setRating={setReviewRating}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">
                    Comment
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                    required
                    className="w-full p-4 rounded-xl border dark:bg-gray-700 outline-none focus:ring-2 focus:ring-[#422ad5]"
                  ></textarea>
                </div>
                <button
                  disabled={reviewLoading}
                  className="w-full bg-[#422ad5] text-white py-4 rounded-xl font-bold"
                >
                  {reviewLoading ? "Posting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealDetails;
