import React from "react";
import img from "../assets/dishShotsDesktop-463691e7.jpg";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HomeBannerSection = () => {
  return (
    <section className="bg-[#300E16] py-16 px-4 md:py-24">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
            Multiple Chefs. <br />
            One Delivery. <br />
            Endless Variety.
          </h2>
        </motion.div>

        {/* Main Image Container */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl mb-12">
          {/* Main Background Image */}
          <img
            src={img} // আপনার আপলোড করা ইমেজটি এখানে হোস্ট করে লিঙ্ক দিন
            alt="Endless Food Variety"
            className="w-full h-auto object-cover min-h-[400px]"
          />

          {/* Floating Tooltips (Desktop Only for Better UI) */}
          <div className="hidden md:block">
            {/* Steak Salad Label */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="absolute top-[15%] left-[10%] bg-white p-3 rounded-lg shadow-lg text-left"
            >
              <p className="text-[10px] font-bold text-gray-800 leading-tight">
                Steak Salad with <br /> Bleu Cheese Dressing <br />
                <span className="text-[#E91E63]">by Chef ROY</span>
              </p>
            </motion.div>

            {/* Beef Bulgogi Label */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="absolute top-[15%] right-[10%] bg-white p-3 rounded-lg shadow-lg text-left"
            >
              <p className="text-[10px] font-bold text-gray-800 leading-tight">
                Beef Bulgogi Plate <br />
                <span className="text-[#E91E63]">by Chef DENNIS</span>
              </p>
            </motion.div>

            {/* Green Beans Label */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="absolute bottom-[25%] right-[35%] bg-white p-3 rounded-lg shadow-lg text-left"
            >
              <p className="text-[10px] font-bold text-gray-800 leading-tight">
                Charred Haricot Vert <br /> & Red Onion Salad <br />
                <span className="text-[#E91E63]">by Chef TAJAH</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Text & Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <p className="text-white text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Shop seasonal rotating menus with the freshest local ingredients.
          </p>

          <button className="inline-flex items-center gap-2 bg-white text-[#300E16] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all group">
            Explore Weekly Delivery
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeBannerSection;
