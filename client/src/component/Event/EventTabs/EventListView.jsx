import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import EventGrid from "../EventDisplay/EventGrid";
import EventList from "../EventDisplay/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingEvents } from "../../../redux/reducers/eventSlice";

const EventListView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  const { upcomingEvents } = useSelector((state) => state.events);
  console.log(upcomingEvents);

  useEffect(() => {
    dispatch(getUpcomingEvents()); // Fetch upcoming events on component mount
  }, [dispatch]);

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

  return (
    <div className="font-inter w-full">
      {/* Search Bar */}
      <div className="border-b border-gray-300 px-4">
        <div className="bg-customGradient p-1 rounded-xl mb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4 bg-orange-100 rounded-xl text-slate-500">
            <form
              className="flex items-center gap-2 w-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <button type="submit">
                <IoIosSearch size={20} />
              </button>
              <input
                type="text"
                className="bg-transparent w-full outline-none text-sm text-gray-800 placeholder-gray-500"
                placeholder="Search by event name, location, date, or category"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 p-4 gap-4">
        <div className="flex gap-2  px-3">
          {["list", "grid"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-2 text-sm font-medium h-10 rounded-md transition duration-300
                ${
                  activeTab === tab
                    ? "border-orange-300 border-b-2 bg-opacity-50 text-black"
                    : "bg-transparent text-gray-800 hover:bg-orange-100"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "list" && <EventList events={filteredEvents} />}
        {activeTab === "grid" && <EventGrid events={filteredEvents} />}
      </div>
    </div>
  );
};

export default EventListView;
