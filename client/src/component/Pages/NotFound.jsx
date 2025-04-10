import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-6xl font-extrabold text-red-600 mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        404
      </motion.h1>
      <span role="img" aria-label="sad" className="text-4xl mb-2">😢</span>
      <motion.p
        className="text-xl text-gray-700 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Uh-oh! We couldn't find that page.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/"
          className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-300"
        >
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;