import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../hooks/useAxios";
import { Link } from "react-router";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [sampleReviews, setSampleReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // request first page with 6 items
        const res = await axios.get(`/meals?page=1&limit=6`);
        setMeals(res.data.meals || []);
        // try load reviews for first meal to show sample reviews
        if (res.data.meals && res.data.meals.length > 0) {
          const firstId = res.data.meals[0]._id;
          const rev = await axios.get(`/reviews/${firstId}`);
          setSampleReviews(rev.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-6 items-center bg-base-100 p-8 rounded shadow"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">
            LocalChefBazaar — Home-cooked meals from your neighborhood
          </h1>
          <p className="mb-6 text-gray-600">
            Discover daily menus from talented local chefs. Fresh, delicious,
            and made with love.
          </p>
          <div className="flex gap-3">
            <Link to="/meals" className="btn btn-primary">
              Browse Meals
            </Link>
            <Link to="/auth/register" className="btn btn-ghost">
              Become a Chef
            </Link>
          </div>
        </div>
        <div>
          <img
            src={meals[0]?.foodImage || "https://via.placeholder.com/600x360"}
            alt="hero"
            className="w-full rounded object-cover shadow"
          />
        </div>
      </motion.section>

      {/* Top Meals */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Today's Picks</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {meals.map((m) => (
              <div key={m._id} className="card p-4 border rounded">
                <img
                  src={m.foodImage}
                  alt={m.foodName}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{m.foodName}</h3>
                <p className="text-sm text-gray-500">
                  By {m.chefName} • {m.chefId}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">${m.price}</span>
                  <Link to={`/meals/${m._id}`} className="btn btn-sm">
                    See Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews (sample) */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">What customers say</h2>
        {sampleReviews.length === 0 ? (
          <div>No reviews yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sampleReviews.slice(0, 4).map((r) => (
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
                      {new Date(r.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-auto font-medium">⭐ {r.rating}</div>
                </div>
                <p className="mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
