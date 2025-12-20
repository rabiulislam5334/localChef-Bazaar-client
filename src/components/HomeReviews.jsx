import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquareQuote } from "lucide-react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useAxios from "../hooks/useAxios";

const HomeReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxios();

  useEffect(() => {
    axiosPublic
      .get("/all-reviews?limit=6")
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
          size={14}
          className={
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        Loading Reviews...
      </div>
    );

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[#422ad5] mb-4">
            What Our Foodies Say
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto italic">
            Real stories from real customers who enjoyed our chef-crafted meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 relative group"
            >
              <MessageSquareQuote
                className="absolute top-6 right-8 text-[#422ad5]/10 group-hover:text-[#422ad5]/20 transition-colors"
                size={60}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={
                      review.reviewerImage ||
                      "https://i.ibb.co/5r5z0Lq/user.png"
                    }
                    alt={review.reviewerName}
                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-[#422ad5]/5"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                      {review.reviewerName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-[10px] text-gray-400 font-medium">
                        {review.date
                          ? new Date(review.date).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic mb-4">
                  "{review.comment.substring(0, 120)}
                  {review.comment.length > 120 ? "..." : ""}"
                </p>

                {/* যদি রিভিউটি কোনো নির্দিষ্ট খাবারের হয়, তবে খাবারের নাম দেখাতে পারেন */}
                {review.mealName && (
                  <div className="text-xs font-bold text-[#422ad5] uppercase tracking-widest">
                    Ordered: {review.mealName}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeReviews;
