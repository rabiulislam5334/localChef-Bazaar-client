import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Flame, Star, Clock } from "lucide-react";
import useAxios from "../hooks/useAxios";
import AOS from "aos";
import "aos/dist/aos.css";

const HomeMeals = () => {
  const axios = useAxios();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const fetchMeals = async () => {
      try {
        const res = await axios.get("/meals?limit=8");
        setMeals(res.data.meals || []);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axios]);

  return (
    <section className="py-24 bg-[#FDFCFB] overflow-hidden">
      <div className="max-w-7xl w-[92%]  mx-auto px-4">
        {/* ---------- Heading Section ---------- */}
        <div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          data-aos="fade-up"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-1 mb-4">
              <span className="h-[2px] w-12 bg-[#422ad5]"></span>
              <span className="text-[#422ad5] font-bold uppercase tracking-widest text-sm">
                Chef's Special
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Today’s{" "}
              <span className="text-[#422ad5] relative">
                Picks
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 25 0 50 5 T 100 5"
                    stroke="#422ad5"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <Link
            to="/meals"
            className="group flex items-center gap-3 font-bold text-lg text-[#422ad5] hover:gap-5 transition-all duration-300"
          >
            Explore Full Menu
            <div className="bg-[#422ad5] p-2 rounded-full text-white group-hover:rotate-[-45deg] transition-all">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        {/* ---------- Content ---------- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-1">
            {Array.isArray(meals) &&
              meals.map((m, index) => (
                <div
                  key={m._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  className="group relative bg-white rounded-[2.5rem] p-4 shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(66,42,213,0.12)] transition-all duration-500 border border-gray-50"
                >
                  {/* Image Section */}
                  <div className="relative h-72 rounded-[2rem] overflow-hidden mb-6">
                    <img
                      src={m.foodImage}
                      alt={m.foodName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-xs font-black">
                          {m.rating || "New"}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs">
                        <Clock size={14} />
                        <span>{m.deliveryTime || "25-30 min"}</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-0 right-0 bg-[#422ad5] text-white px-8 py-4 rounded-tl-[2rem] font-black text-2xl shadow-xl">
                      ${m.price}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-[#422ad5] gray-800 line-clamp-1 group-hover:text-transition-colors">
                        {m.foodName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-white shadow-sm overflow-hidden">
                        <img
                          src={
                            m.chefImage || "https://i.ibb.co/5r5z0Lq/user.png"
                          }
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Crafted by{" "}
                        <span className="font-bold text-gray-800">
                          {m.chefName}
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/meals/${m._id}`}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#422ad5] text-white font-bold rounded-2xl group-hover:bg-gray-900 transition-all duration-300 shadow-lg active:scale-95"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeMeals;
