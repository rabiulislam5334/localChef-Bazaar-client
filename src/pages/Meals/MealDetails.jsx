import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence যোগ করা হয়েছে
import {
  Star,
  Heart,
  Clock,
  MapPin,
  User,
  ChefHat,
  ShoppingCart,
  X,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

/* ---------------- Skeleton Loader ---------------- */
const Skeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="h-[420px] bg-gray-200 dark:bg-gray-700 rounded-3xl" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ---------------- Star Rating ---------------- */
const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.08 }}
      >
        <Star
          size={20}
          className={
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      </motion.div>
    ))}
  </div>
);

/* ================= MAIN PAGE ================= */
const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mealRes = await axiosPublic.get(`/meals/${id}`);
        const reviewRes = await axiosPublic.get(`/reviews/${id}`);
        setMeal(mealRes.data);
        setReviews(reviewRes.data || []);
      } catch {
        toast.error("Failed to load meal");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, axiosPublic]);

  /* -------- Order Submission Logic -------- */
  // const handleOrderSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!user) {
  //     navigate("/auth/login", { state: `/meals/${id}` });
  //     return;
  //   }

  //   const form = e.target;
  //   const quantity = parseInt(form.quantity.value);
  //   const address = form.address.value;

  //   setOrderLoading(true);
  //   const orderData = {
  //     mealId: id,
  //     mealName: meal.foodName,
  //     price: meal.price,
  //     quantity: quantity,
  //     totalPrice: meal.price * quantity,
  //     address: address,
  //     customerEmail: user.email,
  //     customerName: user.displayName,
  //     chefEmail: meal.chefEmail, // আপনার ডাটাবেজে chefEmail থাকলে
  //     status: "pending",
  //   };

  //   try {
  //     const res = await axiosSecure.post("/orders", orderData);
  //     if (res.data.insertedId) {
  //       toast.success("Order initiated! Redirecting to payment...");
  //       setIsModalOpen(false);
  //       // পেমেন্ট পেজে Order ID নিয়ে যাওয়া হচ্ছে
  //       navigate(`payment/${res.data.insertedId}`);
  //     }
  //   } catch (err) {
  //     toast.error("Could not place order");
  //   } finally {
  //     setOrderLoading(false);
  //   }
  // };
  /* -------- Order Submission Logic -------- */
  const onSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/auth/login", { state: `/meals/${id}` });
      return;
    }

    const form = e.target;
    const quantity = parseInt(form.quantity.value);
    const userAddress = form.address.value; // আপনার ব্যাকএন্ড userAddress চায়
    const price = parseFloat(meal?.price);
    const total = price * quantity;

    // ৫. Order Payload (আপনার ওল্ড ফরম্যাট কিন্তু বর্তমান ডাটা অনুযায়ী)
    const orderPayload = {
      foodId: id,
      mealName: meal?.name || meal?.foodName, // আপনার DB-তে 'name' আছে
      price: price,
      quantity: quantity,
      total: total,
      chefId: meal?.chefEmail || meal?.chefId, // আপনার DB-তে 'chefEmail' আছে
      userAddress: userAddress,
    };

    // ডিব্যাগ করার জন্য (সাবমিট না হলে কনসোল চেক করবেন)
    console.log("Payload sending:", orderPayload);

    // ৬. Submit Order
    try {
      setOrderLoading(true);
      const res = await axiosSecure.post("/orders", orderPayload);

      // Backend থেকে insertedId আসবে
      const orderId = res?.data?.insertedId;

      if (!orderId) {
        toast.error("Order created but failed to get Order ID for payment.");
        return;
      }

      toast.success("Order placed successfully! Redirecting to payment...");
      setIsModalOpen(false); // ওল্ড কোডে setOrderOpen(false) ছিল, এখানে নামটা মিলিয়ে নিন

      // পেমেন্ট পেজে রিডাইরেক্ট
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Order Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setOrderLoading(false);
    }
  };
  /* -------- Favorite -------- */
  const addFavorite = async () => {
    if (!user) {
      navigate("/auth/login", { state: `/meals/${id}` });
      return;
    }

    try {
      await axiosSecure.post("/favorites", {
        mealId: id,
        mealName: meal.foodName,
        chefId: meal.chefId,
        chefName: meal.chefName,
        price: meal.price,
      });
      toast.success("Added to favorites ❤️");
    } catch (err) {
      if (err.response?.status === 409) {
        toast("Already in favorites");
      } else toast.error("Failed");
    }
  };

  if (loading) return <Skeleton />;
  if (!meal) return <div className="p-10 text-center">Meal not found</div>;

  return (
    <div className="bg-base-100 dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* ---------- TOP SECTION ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-10"
        >
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full h-[420px] object-cover rounded-3xl shadow-lg"
          />

          <div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#422ad5] mb-3">
              {meal.foodName}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={meal.rating} />
              <span className="text-sm text-gray-500">({meal.rating}/5)</span>
            </div>

            <p className="text-2xl font-extrabold text-[#422ad5] mb-4">
              ${meal.price}
            </p>

            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="flex gap-2">
                <ChefHat /> Chef: {meal.chefName}
              </p>
              <p className="flex gap-2">
                <Clock /> {meal.estimatedDeliveryTime}
              </p>
              {meal.deliveryArea && (
                <p className="flex gap-2">
                  <MapPin /> {meal.deliveryArea}
                </p>
              )}
              <p className="flex gap-2">
                <User /> Experience: {meal.chefExperience}
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(true)} // Modal ওপেন হবে
                className="btn bg-[#422ad5] hover:bg-[#341db8] text-white gap-2"
              >
                <ShoppingCart /> Order Now
              </button>

              <button
                onClick={addFavorite}
                className="btn btn-outline gap-2 border-[#422ad5] text-[#422ad5]"
              >
                <Heart /> Favorite
              </button>
            </div>
          </div>
        </motion.div>

        {/* ---------- INGREDIENTS ---------- */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-serif text-[#422ad5] mb-3">
            Ingredients
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {Array.isArray(meal.ingredients)
              ? meal.ingredients.join(", ")
              : meal.ingredients}
          </p>
        </div>

        {/* ---------- REVIEWS ---------- */}
        <div className="mt-14">
          <h2 className="text-3xl font-serif text-[#422ad5] mb-6">
            Customer Reviews
          </h2>
          {reviews.length === 0 && (
            <p className="text-gray-500">No reviews yet</p>
          )}
          <div className="space-y-5">
            {reviews.map((r) => (
              <motion.div
                key={r._id}
                data-aos="fade-up"
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow"
              >
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={r.reviewerImage || "https://i.ibb.co/5r5z0Lq/user.png"}
                    alt={r.reviewerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{r.reviewerName}</h4>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{r.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- ORDER MODAL ---------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-[#422ad5] mb-4">
                Complete Your Order
              </h2>
              <form onSubmit={onSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-[#422ad5] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-[#422ad5] outline-none"
                    placeholder="Enter your full address..."
                    required
                  ></textarea>
                </div>
                <button
                  disabled={orderLoading}
                  className="w-full bg-[#422ad5] text-white py-3 rounded-xl font-bold hover:bg-[#341db8] transition-all"
                >
                  {orderLoading ? "Processing..." : "Confirm & Pay"}
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
