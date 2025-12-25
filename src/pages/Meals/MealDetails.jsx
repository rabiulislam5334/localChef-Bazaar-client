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

/* ---------------- Components ---------------- */
const Skeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse pt-32">
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="h-[500px] bg-gray-200 rounded-[3rem]" />
      <div className="space-y-8">
        <div className="h-16 w-3/4 bg-gray-200 rounded-2xl" />
        <div className="h-32 w-full bg-gray-200 rounded-3xl" />
        <div className="h-16 w-1/2 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

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

const RatingInput = ({ rating, setRating }) => (
  <div className="flex gap-2 justify-center py-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setRating(i)}
        type="button"
      >
        <Star
          size={36}
          className={
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
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
  const [isFavorite, setIsFavorite] = useState(false); // Favorite State

  // Order & Review States
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const totalPrice = meal ? (orderQty * Number(meal.price)).toFixed(2) : 0;

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
      confirmButtonText: "Yes, Confirm!",
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
          toast.error("Order failed");
        } finally {
          setOrderLoading(false);
        }
      }
    });
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login", { state: `/meals/${id}` });
    if (reviewRating === 0) return toast.error("Please select a star");

    try {
      setReviewLoading(true);
      const reviewPayload = {
        foodId: id,
        mealTitle: meal?.foodName,
        rating: reviewRating,
        comment: reviewText,
        reviewerName: user?.displayName,
        reviewerImage: user?.photoURL,
        reviewerEmail: user?.email,
        date: new Date(),
      };
      const res = await axiosSecure.post("/reviews", reviewPayload);
      if (res.data.review) {
        setReviews([res.data.review, ...reviews]);
        toast.success("Review posted!");
        setIsReviewModalOpen(false);
        setReviewText("");
        setReviewRating(0);
      }
    } catch (err) {
      toast.error("Failed to post review");
    } finally {
      setReviewLoading(false);
    }
  };

  const addFavorite = async () => {
    if (!user) return navigate("/login", { state: `/meals/${id}` });

    try {
      const favoritePayload = {
        mealId: id,
        mealName: meal.foodName,
        mealImage: meal.foodImage,
        chefName: meal.chefName,
        price: Number(meal.price),
      };

      const res = await axiosSecure.post("/favorites", favoritePayload);
      if (res.data) {
        setIsFavorite(true); // বাটন লাল করার জন্য স্টেট আপডেট
        toast.success("Added to favorites ❤️");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setIsFavorite(true);
        toast.error("Already in favorites");
      }
    }
  };

  if (loading) return <Skeleton />;
  if (!meal) return <div className="p-20 text-center">Meal not found</div>;

  return (
    <div className="bg-[#FDFCFB] dark:bg-gray-900 min-h-screen pb-20">
      {/* Container: Width 11/12 via w-[92%] and top padding pt-32 */}
      <div className="max-w-7xl w-[92%] mx-auto pt-32">
        {/* --- MAIN PRODUCT SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-lg">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              {meal.rating} Rating
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-black text-[#422ad5] leading-tight">
              {meal.foodName}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#422ad5]">
                ${meal.price}
              </span>
              <span className="text-gray-400 line-through text-xl font-medium">
                ${(meal.price * 1.2).toFixed(2)}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              Experience the authentic taste of <b>{meal.foodName}</b>,
              specially prepared by Chef <b>{meal.chefName}</b> with fresh
              ingredients.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-gray-600">
                <ChefHat className="text-[#422ad5]" />{" "}
                <span className="font-bold">{meal.chefName}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-gray-600">
                <Clock className="text-[#422ad5]" />{" "}
                <span className="font-bold">{meal.estimatedDeliveryTime}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="flex-1 btn bg-[#422ad5] hover:bg-[#331eb3] text-white h-16 rounded-[1.5rem] border-none text-lg font-bold shadow-xl shadow-indigo-100"
              >
                <ShoppingCart className="mr-2" /> Order Now
              </button>
              <button
                onClick={addFavorite}
                className={`btn h-16 w-16 rounded-[1.5rem] border-2 transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-50 border-red-500 text-red-500 shadow-red-100"
                    : "bg-white border-gray-100 text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart className={isFavorite ? "fill-red-500" : ""} size={28} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- INGREDIENTS & REVIEWS SECTION --- */}
        <div className="mt-20 grid lg:grid-cols-3 gap-12">
          {/* Ingredients */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-black text-gray-800">Ingredients</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <ul className="space-y-4">
                {(Array.isArray(meal.ingredients)
                  ? meal.ingredients
                  : meal.ingredients?.split(",")
                ).map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-600 font-medium capitalize"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#422ad5]" />{" "}
                    {ing.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800">
                Reviews ({reviews.length})
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="btn btn-ghost text-[#422ad5] font-black hover:bg-[#422ad5]/5"
              >
                <MessageSquare size={20} className="mr-2" /> Write Review
              </button>
            </div>

            <div className="grid gap-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-50 flex gap-6"
                  >
                    <img
                      src={
                        r.reviewerImage || "https://i.ibb.co/5r5z0Lq/user.png"
                      }
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-indigo-50"
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-lg">{r.reviewerName}</h4>
                        <span className="text-xs text-gray-400 font-medium">
                          {r.date
                            ? new Date(r.date).toLocaleDateString()
                            : "Recent"}
                        </span>
                      </div>
                      <StarRating rating={r.rating} />
                      <p className="mt-4 text-gray-600 italic">"{r.comment}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- ORDER MODAL (Standard UI) --- */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md p-10 rounded-[3rem] relative shadow-2xl"
            >
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
              >
                <X />
              </button>
              <h2 className="text-3xl font-black text-[#422ad5] mb-8">
                Confirm Order
              </h2>
              <form onSubmit={onSubmitOrder} className="space-y-6">
                <div>
                  <label className="text-sm font-black uppercase text-gray-400 mb-3 block">
                    Order Quantity
                  </label>
                  <div className="flex items-center gap-6 bg-gray-50 w-fit p-2 rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                      className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center font-bold"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-black w-6 text-center">
                      {orderQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQty(orderQty + 1)}
                      className="w-10 h-10 bg-[#422ad5] text-white rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-black uppercase text-gray-400 mb-3 block">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    required
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#422ad5]/20 font-medium"
                    placeholder="Enter your full address..."
                  ></textarea>
                </div>
                <div className="flex justify-between items-center p-6 bg-indigo-50/50 rounded-2xl">
                  <span className="font-bold text-gray-500 uppercase text-xs">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-[#422ad5]">
                    ${totalPrice}
                  </span>
                </div>
                <button
                  disabled={orderLoading}
                  className="w-full bg-[#422ad5] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-[#331eb3] transition-all"
                >
                  {orderLoading ? "Processing..." : "Confirm & Pay Now"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REVIEW MODAL (Standard UI) --- */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-md p-10 rounded-[3rem] relative shadow-2xl"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-black"
              >
                <X />
              </button>
              <h2 className="text-3xl font-black text-[#422ad5] mb-8">
                Write a Review
              </h2>
              <form onSubmit={onSubmitReview} className="space-y-6 text-center">
                <div>
                  <label className="text-sm font-black uppercase text-gray-400 mb-3 block">
                    Rate this Meal
                  </label>
                  <RatingInput
                    rating={reviewRating}
                    setRating={setReviewRating}
                  />
                </div>
                <div className="text-left">
                  <label className="text-sm font-black uppercase text-gray-400 mb-3 block">
                    Your Feedback
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                    required
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#422ad5]/20 font-medium"
                    placeholder="How was the food?"
                  ></textarea>
                </div>
                <button
                  disabled={reviewLoading}
                  className="w-full bg-[#422ad5] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#331eb3] transition-all"
                >
                  {reviewLoading ? "Posting..." : "Post Review"}
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
