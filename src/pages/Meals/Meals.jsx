import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Star,
  MapPin,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  UtensilsCrossed,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import AOS from "aos";
import "aos/dist/aos.css";

const Meals = () => {
  const axios = useAxios();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const fetchAllMeals = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/meals?limit=1000");
        const data = Array.isArray(res.data) ? res.data : res.data.meals || [];
        setAllData(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMeals();
  }, [axios]);

  const filteredMeals = useMemo(() => {
    let temp = [...allData];
    if (search.trim()) {
      temp = temp.filter((m) =>
        m.foodName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sort === "price_asc")
      temp.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price_desc")
      temp.sort((a, b) => Number(b.price) - Number(a.price));
    return temp;
  }, [allData, search, sort]);

  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const currentMeals = filteredMeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [search, sort]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
        <p className="text-indigo-600 font-bold animate-pulse">
          Preparing your menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="bg-gray-100 pt-32 pb-48 px-6 text-center text-slate-900 border-b border-gray-200">
        <div data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full text-sm font-bold mb-6 text-indigo-700">
            <UtensilsCrossed size={16} /> <span>Premium Food Selection</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
            Our Daily Menu
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Explore our curated list of delicious meals delivered straight to
            you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between mb-16">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder="Search by food name..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-800 transition-all placeholder:text-gray-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-56 px-6 py-4 rounded-2xl bg-white border-2 border-gray-100 font-bold text-slate-700 outline-none cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
            >
              <option value="">Price Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentMeals.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm flex flex-col h-full group"
            >
              {/* Image Section - Zoom effect enabled */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={m.foodImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={m.foodName}
                />
                <div className="absolute top-6 left-6 bg-white/95 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-indigo-600 shadow-md">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />{" "}
                  {m.rating || "0"}
                </div>
                <div className="absolute bottom-6 right-6 bg-indigo-600 text-white font-black px-6 py-2 rounded-2xl text-2xl">
                  ${m.price}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-3xl font-black text-slate-800 mb-6 leading-tight uppercase">
                  {m.foodName}
                </h3>

                <div className="space-y-4 mb-10 flex-grow">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="p-2.5 bg-gray-100 rounded-xl text-slate-600">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-slate-700">
                      Chef: {m.chefName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="p-2.5 bg-gray-100 rounded-xl text-slate-600">
                      <MapPin size={20} />
                    </div>
                    <span className="font-bold text-slate-700">
                      Area: {m.deliveryArea || "All Over City"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/meals/${m._id}`}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                  See Details <ArrowRight size={22} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-24">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => p - 1);
                window.scrollTo(0, 0);
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:border-indigo-600 disabled:opacity-20 shadow-md"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo(0, 0);
                  }}
                  className={`w-14 h-14 rounded-2xl font-bold text-lg ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => p + 1);
                window.scrollTo(0, 0);
              }}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:border-indigo-600 disabled:opacity-20 shadow-md"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;
