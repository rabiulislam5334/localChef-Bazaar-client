import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import AOS from "aos";
import "aos/dist/aos.css";

const Meals = () => {
  const axios = useAxios();
  const [allMeals, setAllMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 6; // প্রতি পেজে ৬টি করে খাবার দেখাবে

  useEffect(() => {
    // AOS Initialize
    AOS.init({ duration: 1000, once: true });

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/meals");
        const data = res.data.meals || res.data || [];
        setAllMeals(data);
        setFilteredMeals(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [axios]);

  // সার্চ এবং সর্ট লজিক
  useEffect(() => {
    let tempMeals = [...allMeals];
    if (search) {
      tempMeals = tempMeals.filter((m) =>
        String(m?.foodName || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    if (sort === "price_asc")
      tempMeals.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_desc")
      tempMeals.sort((a, b) => (b.price || 0) - (a.price || 0));

    setFilteredMeals(tempMeals);
    setCurrentPage(1); // সার্চ বা সর্ট করলে ১ম পেজে ফিরে যাবে
    AOS.refresh(); // নতুন ডাটা আসলে AOS রিফ্রেশ হবে
  }, [search, sort, allMeals]);

  // Pagination Calculation
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12">
      <div className="container mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="mb-12" data-aos="fade-down">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-[#422ad5] mb-4">
              Our Daily Menu
            </h1>
            <p className="text-gray-500 italic">
              Discover the best home-cooked meals near you.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search meals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-gray-50 focus:border-[#422ad5]/30 outline-none bg-gray-50/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full md:w-auto px-8 py-4 rounded-full border-2 border-gray-50 font-bold text-gray-600 bg-white outline-none"
              >
                <option value="">Sort by: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Meals Grid --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentMeals.map((m, index) => (
                <div
                  key={m._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={m.foodImage}
                      alt={m.foodName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 font-bold text-sm">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />{" "}
                      {m.rating || "New"}
                    </div>
                    <div className="absolute bottom-6 right-6 bg-[#422ad5] text-white text-2xl font-black px-6 py-2 rounded-2xl shadow-xl">
                      ${m.price}
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-black mb-4 line-clamp-1 group-hover:text-[#422ad5] transition-colors">
                      {m.foodName}
                    </h3>
                    <div className="space-y-3 mb-8 text-gray-500">
                      <p className="flex items-center gap-3">
                        <User size={18} className="text-[#422ad5]" /> Chef:{" "}
                        <b>{m.chefName}</b>
                      </p>
                      <p className="flex items-center gap-3">
                        <MapPin size={18} className="text-[#422ad5]" /> Area:{" "}
                        <b>{m.deliveryArea}</b>
                      </p>
                    </div>
                    <Link
                      to={`/meals/${m._id}`}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#422ad5]/5 text-[#422ad5] font-black text-lg rounded-[1.5rem] hover:bg-[#422ad5] hover:text-white transition-all duration-300"
                    >
                      See Details <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Custom Pagination --- */}
            {totalPages > 1 && (
              <div
                className="flex justify-center items-center gap-3 mt-16"
                data-aos="fade-up"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-4 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 text-[#422ad5] hover:bg-[#422ad5] hover:text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-14 h-14 rounded-2xl font-bold transition-all ${
                      currentPage === idx + 1
                        ? "bg-[#422ad5] text-white shadow-lg"
                        : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-4 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 text-[#422ad5] hover:bg-[#422ad5] hover:text-white transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Meals;
