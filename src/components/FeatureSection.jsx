import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UtensilsCrossed, Leaf, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    // Title Animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -30 },
      {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );

    // Cards staggered animation
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 50,
        rotateX: -15,
      },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
      }
    );
  }, []);

  const features = [
    {
      id: 1,
      icon: <UtensilsCrossed size={40} />,
      title: "Unique Taste",
      description:
        "A chef-crafted meal is more than just food — it's an experience delivered to your soul.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 2,
      icon: <Leaf size={40} />,
      title: "Certified Farm",
      description:
        "We source 100% organic and fresh ingredients directly from our local certified farms.",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      icon: <Truck size={40} />,
      title: "Fast Delivery",
      description:
        "Our logistics ensure your meals arrive piping hot and fresh within 30 minutes.",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <p className="text-[#422ad5] font-bold tracking-[0.2em] uppercase text-sm mb-4">
            Our Excellence
          </p>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 italic">
            Flipping Since '25
          </h2>
          <div className="h-1.5 w-24 bg-[#422ad5] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {Array.isArray(features) &&
            features.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative p-10 rounded-[3rem] bg-gray-50 hover:bg-white hover:shadow-[0_30px_60px_rgba(66,42,213,0.1)] transition-all duration-500 border border-transparent hover:border-gray-100"
              >
                {/* Icon Container with Animated Background */}
                <div
                  className={`relative w-20 h-20 flex items-center justify-center rounded-3xl mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.color}`}
                >
                  <div className="absolute inset-0 bg-current opacity-10 rounded-3xl animate-pulse"></div>
                  {feature.icon}
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-[#422ad5] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Decorative Circle */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[#422ad5]/5 rounded-full blur-2xl group-hover:bg-[#422ad5]/10 transition-all"></div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
