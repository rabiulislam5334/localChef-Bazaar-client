import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, ChefHat } from "lucide-react";
import { Link } from "react-router";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="hero min-h-screen relative overflow-hidden">
      {/* ================= Background Video ================= */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://cdn.shef.com/assets/desktopBGVideo-7e4b60bd.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="hero-overlay bg-black/60 absolute inset-0"></div>

      {/* ================= Content ================= */}
      <div className="hero-content relative z-10 text-neutral-content text-center">
        <motion.div
          data-aos="fade-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-11/12 max-w-xl  text-base-content
          "
        >
          <h1 className="mb-5 text-3xl sm:text-4xl md:text-5xl text-white font-bold">
            Home-cooked meals
            <span className=" text-white"> near you</span>
          </h1>

          <p className="mb-6 text-white">
            Discover delicious meals prepared by trusted local chefs. Fresh,
            hygienic, and made with love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/meals" className="btn btn-primary gap-2">
              Browse Meals
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/auth/register"
              className="btn btn-outline gap-2 text-white"
            >
              Become a Chef
              <ChefHat size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
