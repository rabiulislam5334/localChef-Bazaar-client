import React, { useEffect, useState } from "react";

import { Link } from "react-router";
import { ArrowRight, Flame } from "lucide-react";
import useAxios from "../hooks/useAxios";

const HomeMeals = () => {
  const axios = useAxios();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get("/meals?limit=6");
        setMeals(res.data.meals || []);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axios]);

  return (
    <section className="mt-20 container mx-auto px-4">
      {/* ---------- Heading ---------- */}
      <div
        className="flex justify-between items-center mb-12"
        data-aos="fade-up"
      >
        <h2 className="font-serif sm:text-5xl md:text-5xl  text-[#422ad5] flex items-center gap-3">
          <Flame size={36} className="text-[#422ad5]" />
          Today’s Picks
        </h2>

        <Link
          to="/meals"
          className="flex items-center gap-2 font-semibold text-[#422ad5] hover:underline"
        >
          See All
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* ---------- Loading ---------- */}
      {loading ? (
        <div className="text-center text-xl">Loading meals...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meals.map((m, index) => (
            <div
              key={m._id}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="bg-white rounded-[2rem] overflow-hidden
              shadow-[0_8px_30px_rgb(0,0,0,0.12)]
              hover:shadow-[0_8px_30px_rgb(0,0,0,0.22)]
              transition-all duration-300 group"
            >
              {/* ---------- Image ---------- */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={m.foodImage}
                  alt={m.foodName}
                  className="w-full h-full object-cover
                  transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />

                {/* Price */}
                <div
                  className="absolute bottom-5 right-5 bg-white
                text-[#422ad5] text-2xl font-extrabold
                px-5 py-2 rounded-full shadow-lg"
                >
                  ${m.price}
                </div>
              </div>

              {/* ---------- Content ---------- */}
              <div className="p-8">
                <h3 className="text-2xl font-extrabold mb-3 line-clamp-2">
                  {m.foodName}
                </h3>

                <p className="text-gray-600 mb-6">
                  By <span className="font-semibold">{m.chefName}</span>
                </p>

                <Link
                  to={`/meals/${m._id}`}
                  className="inline-flex items-center justify-center gap-2
                  w-full px-6 py-4 border-2 border-[#422ad5]
                  text-[#422ad5] font-bold text-lg rounded-full
                  hover:bg-[#422ad5] hover:text-white transition-all"
                >
                  See Details
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeMeals;
