import { motion } from "framer-motion";

const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: {
    rotate: 10,
    scale: 1.15,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
};

const TopCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-base-100 rounded-3xl p-8
      flex flex-col items-center text-center
      shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Icon */}
      <motion.div
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-primary mb-6"
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>

      <p className="text-gray-600 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default TopCard;
