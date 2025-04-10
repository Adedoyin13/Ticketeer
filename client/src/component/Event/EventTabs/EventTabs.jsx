import React, { useState } from "react";
import PastEvents from "../EventView/PastEvents";
import FavouriteEvents from "../EventView/FavouriteEvents";
import UpcomingEvents from "../EventView/UpcomingEvents";

const EventTabs = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="font-inter w-full px-4 sm:px-6 md:px-10">
    {/* Tab Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <p className="font-semibold text-lg sm:text-xl text-gray-800">Events</p>
  
      <div className="overflow-x-auto scrollbar-hide">
  <div className="flex flex-nowrap gap-2 border border-black rounded-full p-1 sm:p-2 w-max">
  {["upcoming", "past", "favorites"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-2 text-sm font-medium h-10 rounded-full transition-all duration-300
            ${
              activeTab === tab
                ? "bg-orange-300 bg-opacity-50 text-black"
                : "bg-transparent text-gray-700 hover:bg-orange-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
  </div>
</div>

      {/* <div className="flex flex-wrap gap-2 border border-black rounded-full p-1 sm:p-2">
        {["upcoming", "past", "favorites"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-2 text-sm font-medium h-10 rounded-full transition-all duration-300
            ${
              activeTab === tab
                ? "bg-orange-300 bg-opacity-50 text-black"
                : "bg-transparent text-gray-700 hover:bg-orange-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div> */}
    </div>
  
    {/* Tab Content */}
    <div>
      {activeTab === "upcoming" && <UpcomingEvents />}
      {activeTab === "past" && <PastEvents />}
      {activeTab === "favorites" && <FavouriteEvents />}
    </div>
  </div>  
  );
};

export default EventTabs;