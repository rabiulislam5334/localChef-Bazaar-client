import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import axios from "../../hooks/useAxios"; // public axios
import useAxiosSecure from "../../hooks/useAxiosSecure"; // authenticated axios
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import useAxios from "../../hooks/useAxios";

const MealDetails = () => {
  const { id } = useParams(); // meal id
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingMeal, setLoadingMeal] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);

  // react-hook-form for review
  const {
    register: registerReview,
    handleSubmit: handleSubmitReview,
    reset: resetReview,
    formState: { errors: reviewErrors, isSubmitting: reviewSubmitting },
  } = useForm();

  // react-hook-form for order
  const {
    register: registerOrder,
    handleSubmit: handleSubmitOrder,
    reset: resetOrder,
    formState: { errors: orderErrors, isSubmitting: orderSubmitting },
  } = useForm({
    defaultValues: { quantity: 1, userAddress: "" },
  });

  // Load meal
  useEffect(() => {
    let mounted = true;
    setLoadingMeal(true);
    axiosPublic
      .get(`/meals/${id}`)
      .then((res) => {
        if (mounted) setMeal(res.data);
      })
      .catch((err) => {
        console.error("Failed to load meal:", err);
        toast.error("Failed to load meal.");
      })
      .finally(() => mounted && setLoadingMeal(false));
    return () => (mounted = false);
  }, [id]);

  // Load reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axiosPublic.get(`/reviews/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Add to favorites
  const handleAddFavorite = async () => {
    if (!user?.email) {
      toast.error("Please login to add favorites.");
      navigate("/auth/login", { state: `/meals/${id}` });
      return;
    }

    const favoriteDoc = {
      mealId: id,
      mealName: meal?.foodName,
      chefId: meal?.chefId,
      chefName: meal?.chefName,
      price: meal?.price,
    };

    try {
      const res = await axiosSecure.post("/favorites", favoriteDoc);
      // backend returns 409 if exists; if success it returns insertedId
      if (res.data.insertedId || res.status === 200) {
        toast.success("Added to favorites!");
      } else {
        toast.success("Added to favorites!");
      }
    } catch (err) {
      // handle already exists or other errors
      const status = err?.response?.status;
      if (status === 409) {
        toast("Meal already in favorites.");
      } else {
        console.error(err);
        toast.error("Failed to add favorite.");
      }
    }
  };

  // Submit review
  const onSubmitReview = async (formData) => {
    if (!user?.email) {
      toast.error("Please login to submit a review.");
      navigate("/auth/login", { state: `/meals/${id}` });
      return;
    }

    const reviewPayload = {
      foodId: id,
      reviewerName: user.displayName || user.email.split("@")[0],
      reviewerImage: user.photoURL || "",
      rating: parseInt(formData.rating, 10),
      comment: formData.comment,
    };

    try {
      await axiosSecure.post("/reviews", reviewPayload);
      toast.success("Review submitted successfully!");
      resetReview();
      // immediately refresh reviews
      fetchReviews();
      // also refresh meal rating by reloading meal (optional)
      const mealRes = await axiosPublic.get(`/meals/${id}`);
      setMeal(mealRes.data);
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Failed to submit review.");
    }
  };

  // Place order
  const onSubmitOrder = async (formData) => {
    if (!user?.email) {
      toast.error("Please login to place an order.");
      navigate("/auth/login", { state: `/meals/${id}` });
      return;
    }

    const quantity = parseInt(formData.quantity, 10) || 1;
    const price = parseFloat(meal.price || 0);
    const total = Math.round((price * quantity + Number.EPSILON) * 100) / 100;

    // Confirm
    const ok = window.confirm(
      `Your total price is $${total}. Do you want to confirm the order?`
    );
    if (!ok) return;

    const orderPayload = {
      foodId: id,
      mealName: meal.foodName,
      price,
      quantity,
      chefId: meal.chefId,
      userAddress: formData.userAddress,
    };

    try {
      const res = await axiosSecure.post("/orders", orderPayload);
      if (res.data.insertedId || res.status === 200) {
        toast.success("Order placed successfully!");
        resetOrder();
        setOrderOpen(false);
      } else {
        toast.success("Order placed!");
        resetOrder();
        setOrderOpen(false);
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order.");
    }
  };

  if (loadingMeal)
    return (
      <div className="p-6">
        <Loader></Loader>
      </div>
    );

  if (!meal) return <div className="p-6">Meal not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="w-full h-96 object-cover rounded"
        />
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{meal.foodName}</h1>
          <p className="mt-2">
            Chef: {meal.chefName} ({meal.chefId})
          </p>
          <p className="mt-2">Price: ${meal.price}</p>
          <p className="mt-2">Rating: {meal.rating}</p>
          <p className="mt-4">
            Ingredients:{" "}
            {Array.isArray(meal.ingredients)
              ? meal.ingredients.join(", ")
              : meal.ingredients}
          </p>
          <p className="mt-2">
            Estimated Delivery Time: {meal.estimatedDeliveryTime}
          </p>
          <p className="mt-2">Chef Experience: {meal.chefExperience}</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setOrderOpen(true)}
              className="btn btn-primary"
            >
              Order Now
            </button>
            <button onClick={handleAddFavorite} className="btn btn-outline">
              Add to Favorite
            </button>
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
              className="btn"
            >
              See Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        {/* Review form */}
        <div className="mb-6 max-w-xl">
          <form
            onSubmit={handleSubmitReview(onSubmitReview)}
            className="space-y-3 bg-white p-4 rounded shadow"
          >
            <div>
              <label className="font-medium">Your Rating (1-5)</label>
              <select
                {...registerReview("rating", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              {reviewErrors.rating && (
                <p className="text-red-500 text-sm">Rating is required</p>
              )}
            </div>

            <div>
              <label className="font-medium">Comment</label>
              <textarea
                {...registerReview("comment", { required: true })}
                className="textarea textarea-bordered w-full"
                rows="3"
              ></textarea>
              {reviewErrors.comment && (
                <p className="text-red-500 text-sm">Comment is required</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Give Review"}
              </button>
            </div>
          </form>
        </div>

        {/* Reviews list */}
        <div>
          {loadingReviews ? (
            <div>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div>No reviews yet. Be the first to review!</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="p-4 bg-white rounded shadow">
                  <div className="flex items-center gap-3">
                    {r.reviewerImage ? (
                      <img
                        src={r.reviewerImage}
                        alt={r.reviewerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {r.reviewerName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{r.reviewerName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(r.date).toLocaleString()}
                      </div>
                    </div>
                    <div className="ml-auto font-medium">
                      Rating: {r.rating}
                    </div>
                  </div>
                  <p className="mt-2">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Modal (simple) */}
      {orderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="text-xl font-semibold mb-2">Confirm Order</h3>
            <p className="mb-4">
              Meal: <strong>{meal.foodName}</strong>
            </p>

            <form
              onSubmit={handleSubmitOrder(onSubmitOrder)}
              className="space-y-3"
            >
              <div>
                <label className="font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  {...registerOrder("quantity", { required: true, min: 1 })}
                  className="input input-bordered w-full"
                />
                {orderErrors.quantity && (
                  <p className="text-red-500 text-sm">
                    Quantity required (min 1)
                  </p>
                )}
              </div>

              <div>
                <label className="font-medium">Delivery Address</label>
                <textarea
                  {...registerOrder("userAddress", { required: true })}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                ></textarea>
                {orderErrors.userAddress && (
                  <p className="text-red-500 text-sm">Address is required</p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOrderOpen(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={orderSubmitting}
                >
                  {orderSubmitting ? "Placing..." : `Confirm Order`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealDetails;

/**
 * Meal Details page
 * - Shows meal detail (GET /meals/:id)
 * - Shows reviews (GET /reviews/:foodId)
 * - Add review (POST /reviews) -> requires auth
 * - Add favorite (POST /favorites) -> requires auth
 * - Place order (POST /orders) -> requires auth
 *
 * Backend endpoints used (from your server.js):
 * - GET /meals/:id
 * - GET /reviews/:foodId
 * - POST /reviews
 * - POST /favorites
 * - POST /orders
 *
 * Note: axiosSecure will use cookie or Authorization header depending on your setup.
 */
