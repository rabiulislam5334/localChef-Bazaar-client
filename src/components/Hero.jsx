import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, ChefHat, Play } from "lucide-react";
import { Link } from "react-router";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="hero min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* ================= Background Video ================= */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src="https://cdn.shef.com/assets/desktopBGVideo-7e4b60bd.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#422ad5]/20"></div>

      {/* ================= Content ================= */}
      <div className="hero-content relative z-20 px-4">
        <div className="max-w-4xl text-center">
          {/* Badge Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 text-white text-sm font-medium"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#422ad5] animate-ping"></span>
            Cooking Now in Your Neighborhood
          </motion.div>

          {/* Main Heading with Reveal Animation */}
          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-serif italic font-black text-white leading-[1.1] mb-8"
          >
            Authentic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#422ad5] to-gray-400">
              Home-Cooked
            </span>
            <span className="relative">
              {" "}
              Meals
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#422ad5]"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 7 Q 50 0 100 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light"
          >
            Skip the restaurant and taste the tradition. Discover thousands of
            talented local chefs bringing fresh, hygienic, and authentic flavors
            to your door.
          </p>

          {/* Buttons with Hover Effects */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link
              to="/meals"
              className="group relative px-8 py-4 bg-[#422ad5] text-white font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(66,42,213,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Fresh Meals{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </span>
            </Link>

            <Link
              to="/auth/register"
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg rounded-full flex items-center gap-2 hover:bg-white hover:text-black transition-all"
            >
              <ChefHat
                size={22}
                className="group-hover:rotate-12 transition-transform"
              />
              Become a Chef
            </Link>
          </div>

          {/* Bottom Floating Stats (Optional) */}
          <div
            data-aos="fade-in"
            data-aos-delay="800"
            className="mt-16 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70"
          >
            <div className="text-white">
              <b className="text-2xl block">500+</b> Trusted Chefs
            </div>
            <div className="text-white">
              <b className="text-2xl block">10k+</b> Happy Foodies
            </div>
            <div className="text-white">
              <b className="text-2xl block">4.9/5</b> Avg Rating
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
