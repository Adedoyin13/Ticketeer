import React, { useEffect, useState } from "react";
import { IoIosCloseCircle, IoIosSearch } from "react-icons/io";
import EventGrid from "../EventDisplay/EventGrid";
import EventList from "../EventDisplay/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingEvents } from "../../../redux/reducers/eventSlice";
import { motion } from "framer-motion";
import Loader from "../../Spinners/Loader";

const viewTabs = ["list", "grid"];

const EventListView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  const { upcomingEvents, loading } = useSelector((state) => state.events);
  console.log(upcomingEvents);

  useEffect(() => {
    dispatch(getUpcomingEvents()); // Fetch upcoming events on component mount
  }, [dispatch]);

  // if (loading.upcomingEvents) {
  //   return <Loader loading={loading.upcomingEvents} />;
  // }

  const filteredEvents = upcomingEvents.filter((event) => {
    const query = searchQuery.toLowerCase();

    return (
      event?.title?.toLowerCase().includes(query) ||
      (Array.isArray(event?.categories)
        ? event?.categories.join(" ").toLowerCase().includes(query) // If it's an array
        : event?.categories?.toLowerCase().includes(query)) || // If it's a single string
      event?.location?.join(" ")?.toLowerCase().includes(query) ||
      event?.startDate?.toLowerCase().includes(query)
    );
  });

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="font-inter w-full">
      {/* Search Bar */}
      <div className="border-b border-gray-200 dark:border-zinc-700">
        <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-white dark:from-orange-300/10 dark:via-orange-200/5 dark:to-zinc-900 p-1 rounded-2xl shadow-sm my-6">
          <div className="flex items-center w-full py-2.5 px-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-inner">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative w-full flex items-center"
            >
              <IoIosSearch
                size={22}
                className="text-gray-500 dark:text-zinc-400 absolute left-3"
              />
              <input
                type="text"
                className="pl-10 pr-9 py-2 w-full bg-transparent outline-none text-sm text-gray-700 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded-md transition"
                placeholder="Search by event name, location, date, or category"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <IoIosCloseCircle
                  size={20}
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-500 dark:text-zinc-400 hover:text-orange-400 cursor-pointer transition"
                />
              )}
            </form>
          </div>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 dark:border-zinc-700 px-4 sm:px-6 md:px-10 py-4 gap-4">
        <div className="flex gap-2 bg-gray-100 dark:bg-zinc-700 rounded-full p-1 shadow-inner">
          {viewTabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300
            ${
              activeTab === tab
                ? "bg-orange-400 text-white shadow-md"
                : "text-gray-600 dark:text-zinc-300 hover:bg-orange-100 dark:hover:bg-orange-200/10"
            }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:px-6 md:px-10">
        {activeTab === "list" && <EventList events={filteredEvents} />}
        {activeTab === "grid" && <EventGrid events={filteredEvents} />}
      </div>
    </div>
  );
};

export default EventListView;
