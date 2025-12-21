import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useAxios from "../hooks/useAxios";

const HomeReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxios();

  useEffect(() => {
    axiosPublic
      .get("/all-reviews?limit=10")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading home reviews", err);
        setLoading(false);
      });
  }, [axiosPublic]);

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }
        />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
      </div>
    );

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-[#422ad5]/10 rounded-2xl text-[#422ad5] mb-4"
          >
            <Quote size={32} />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-4">
            Hear from our <span className="text-[#422ad5]">Foodies</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Real experiences from people who love authentic home-cooked meals.
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="relative group px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              nextEl: ".next-btn",
              prevEl: ".prev-btn",
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="h-full bg-gray-50/50 hover:bg-white p-10 rounded-[3rem] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between group">
                  <div>
                    <StarRating rating={review.rating} />
                    <p className="mt-6 text-gray-600 text-lg leading-relaxed italic line-clamp-4">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-8">
                    <div className="relative">
                      <img
                        src={
                          review.reviewerImage ||
                          "https://i.ibb.co/5r5z0Lq/user.png"
                        }
                        alt={review.reviewerName}
                        className="w-14 h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#422ad5] p-1 rounded-full text-white">
                        <Star size={10} fill="currentColor" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-none mb-1 text-lg">
                        {review.reviewerName}
                      </h4>
                      <p className="text-sm text-gray-400 font-medium">
                        {review.date
                          ? new Date(review.date).toDateString()
                          : "Verified Customer"}
                      </p>
                    </div>
                  </div>

                  {review.mealName && (
                    <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] bg-[#422ad5] text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        {review.mealName}
                      </span>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="prev-btn absolute top-1/2 -left-4 md:-left-8 z-20 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-[#422ad5] hover:bg-[#422ad5] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
            <ChevronLeft size={28} />
          </button>
          <button className="next-btn absolute top-1/2 -right-4 md:-right-8 z-20 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-[#422ad5] hover:bg-[#422ad5] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeReviews;
