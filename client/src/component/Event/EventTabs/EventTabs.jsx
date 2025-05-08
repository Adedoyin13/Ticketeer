import React, { useEffect, useState } from "react";
import PastEvents from "../EventView/PastEvents";
import FavouriteEvents from "../EventView/FavouriteEvents";
import UpcomingEvents from "../EventView/UpcomingEvents";
import { AnimatePresence, motion } from "framer-motion";

const tabVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

const buttonVariants = {
  active: { scale: 1.05 },
  inactive: { scale: 1 },
};

const tabList = ["upcoming", "past", "favorites"];

const EventTabs = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Load saved tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("activeEventTab");
    if (savedTab && tabList.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save tab to localStorage on change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeEventTab", tab);
  };

  return (
    <div className="font-inter w-full px-4 sm:px-6 md:px-10">
      {/* Tab Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <p className="font-semibold text-xl text-zinc-900 dark:text-white">
          My Events
        </p>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-1 shadow-inner dark:shadow-none w-max">
            {tabList.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => handleTabChange(tab)}
                variants={buttonVariants}
                animate={activeTab === tab ? "active" : "inactive"}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300
              ${
                activeTab === tab
                  ? "bg-orange-400 text-white shadow-md"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Tab Content */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" && (
            <motion.div
              key="upcoming"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <UpcomingEvents />
            </motion.div>
          )}

          {activeTab === "past" && (
            <motion.div
              key="past"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <PastEvents />
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <FavouriteEvents />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventTabs;