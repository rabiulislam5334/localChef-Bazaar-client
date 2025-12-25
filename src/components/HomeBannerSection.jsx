import React from "react";
import img from "../assets/dishShotsDesktop-463691e7.jpg";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HomeBannerSection = () => {
  return (
    // ব্যাকগ্রাউন্ড কালার এখন আপনার ব্র্যন্ডের ডার্ক টোন (#0F0736)
    <section className="bg-[#0F0736] py-20 px-4 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#422ad5] opacity-20 blur-[150px]"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-600 opacity-10 blur-[120px]"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* --- Heading Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div
            className="flex justify-center items-center gap-2 mb-6"
            data-aos="fade-down"
          >
            <Sparkles className="text-[#422ad5]" size={20} />
            <span className="text-white/60 tracking-[0.3em] uppercase text-xs font-bold">
              One Order. Total Variety.
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter">
            Multiple Chefs. <br />
            {/* এখানে আপনার ব্র্যন্ড ব্লু থেকে পার্পল গ্রেডিয়েন্ট */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#422ad5] to-fuchsia-500">
              One Delivery.
            </span>{" "}
            <br />
            Endless Variety.
          </h2>
        </motion.div>

        {/* --- Image Section --- */}
        <div className="relative group max-w-5xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)] mb-16 border border-white/5">
          <img
            src={img}
            alt="Endless Food Variety"
            className="w-full h-auto object-cover min-h-[450px]"
          />

          {/* Floating Labels (কালার আপডেট করা হয়েছে) */}
          <div className="hidden md:block">
            <LabelBox
              position="top-[20%] left-[8%]"
              chef="Chef ROY"
              dish="Steak Salad with Bleu Cheese"
            />
            <LabelBox
              position="top-[25%] right-[10%]"
              chef="Chef DENNIS"
              dish="Beef Bulgogi Plate"
            />
            <LabelBox
              position="bottom-[30%] right-[38%]"
              chef="Chef TAJAH"
              dish="Charred Haricot Vert Salad"
            />
          </div>
        </div>

        {/* --- Bottom Text & Button --- */}
        <div className="space-y-10">
          <p className="text-gray-300 text-xl md:text-2xl font-light italic max-w-2xl mx-auto">
            "Shop seasonal rotating menus with the freshest local ingredients,
            delivered together."
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 bg-[#422ad5] text-white px-12 py-5 rounded-full font-black text-xl shadow-[0_15px_30px_rgba(66,42,213,0.3)] hover:bg-[#3621b5] transition-all group"
          >
            Explore Weekly Delivery
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform"
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

// লেবেল কম্পোনেন্ট (কালার সামঞ্জস্যপূর্ণ করা হয়েছে)
const LabelBox = ({ position, chef, dish }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className={`absolute ${position} z-20 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl text-left border-l-4 border-[#422ad5]`}
  >
    <span className="text-[10px] font-black text-[#422ad5] uppercase tracking-widest">
      {chef}
    </span>
    <p className="text-[12px] font-bold text-gray-900 leading-tight mt-1">
      {dish}
    </p>
  </motion.div>
);

export default HomeBannerSection;
