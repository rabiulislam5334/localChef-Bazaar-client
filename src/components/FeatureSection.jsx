import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sandwich, Warehouse, Bike } from "lucide-react";
import TopCard from "./TopCard";

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      {
        y: 30, // কম movement
        scale: 0.98,
      },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true, // একবারই animate হবে
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, []);

  const features = [
    {
      id: 1,
      icon: <Sandwich size={64} strokeWidth={1.5} />,
      title: "Unique Taste",
      description: "A burger is more than just food — it is a wish fulfilled.",
    },
    {
      id: 2,
      icon: <Warehouse size={64} strokeWidth={1.5} />,
      title: "Certified Farm",
      description: "Fresh ingredients sourced from trusted local farms.",
    },
    {
      id: 3,
      icon: <Bike size={64} strokeWidth={1.5} />, // ✅ FIXED
      title: "Home Delivery",
      description: "Hot meals delivered straight to your doorstep.",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gray-100 py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-center text-[#422ad5]
          text-3xl sm:text-5xl md:text-5xl
          font-serif  mb-16"
        >
          Flipping Since '25
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={feature.id} ref={(el) => (cardsRef.current[index] = el)}>
              <TopCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
