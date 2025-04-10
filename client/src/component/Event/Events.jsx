import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MdEventBusy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingEvents } from "../../redux/reducers/eventSlice";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Events = ({ countries, states }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { upcomingEvents, loading, error } = useSelector(
    (state) => state.events
  );

  const { user } = useSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch(getUpcomingEvents()); // Fetch user events on component mount
  // }, [dispatch]);

  useEffect(() => {
    setFilteredEvents(upcomingEvents); // Initialize with all events
  }, [upcomingEvents]);

  if (loading.upcomingEvents) {
    return <Loader loading={loading.upcomingEvents} />;
  }
  if (error) return toast.error("error");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);

    if (!term) {
      setFilteredEvents(upcomingEvents); // Reset if search is empty
      return;
    }

    const filtered = upcomingEvents.filter((event) => {
      return (
        event?.title?.toLowerCase().includes(term) ||
        event?.category?.toLowerCase().includes(term) ||
        (event?.startDate &&
          new Date(event.startDate)
            .toLocaleDateString("en-US", { month: "short", day: "numeric" })
            .toLowerCase()
            .includes(term))
      );
    });

    setFilteredEvents(filtered);
  };

  const handleNavigate = (eventId) => {
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section>
      <div className="bg-orange-50 flex flex-col gap-10 pt-32 pb-20 items-center">
        {/* Search Bar */}
        <div className="w-full flex justify-center px-4 sm:px-0">
          <div className="bg-customGradient p-1 rounded-xl w-full sm:w-9/12">
            <div className="bg-orange-100 rounded-xl text-slate-500 p-3">
              <form className="flex gap-2 w-full">
                <button type="submit">
                  <IoIosSearch />
                </button>
                <input
                  type="text"
                  className="bg-transparent w-full outline-none"
                  placeholder="Search by event title, date or category"
                  onChange={handleSearchChange}
                  value={search}
                />
              </form>
            </div>
          </div>
        </div>

        {/* Event Section */}
        {[{ title: "Upcoming events", events: filteredEvents }].map(
          ({ title, events }, idx) => (
            <div
              key={idx}
              className="relative w-full px-4 sm:px-10 lg:px-20 space-y-6"
            >
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-orange-500 py-4 px-4 sm:px-6 shadow-md rounded-xl font-inter"
                  >
                    <p className="font-medium text-lg text-gray-700 mb-4">
                      {event.startDate
                        ? formatDate(event.startDate)
                        : "Date not available"}
                    </p>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center bg-orange-300 bg-opacity-50 rounded-xl p-4">
                      {/* Text Content */}
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-lg text-gray-700">
                            {formatTime(event.startTime)}
                          </p>
                          <p className="text-sm capitalize">
                            {event.eventType}
                          </p>
                          <p className="font-semibold text-xl">{event.title}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-[25px] h-[25px] overflow-hidden rounded-full bg-white">
                            <img
                              src={event.organizer.photo.imageUrl}
                              alt="User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm">
                            Hosted by {event.organizer.name}{" "}
                            {user?._id === event?.organizer?._id && "(you)"}
                          </p>
                        </div>

                        <div className="flex gap-2 items-center text-sm">
                          {event.eventType === "virtual" ? (
                            <>
                              <IoVideocamOutline size={20} />
                              <a
                                href={event.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                Join Meeting
                              </a>
                            </>
                          ) : (
                            <>
                              <IoLocationOutline size={20} />
                              <p>{`${event.location[2]}, ${event.location[1]}`}</p>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleNavigate(event._id)}
                          className="px-6 py-2 mt-3 bg-slate-500 text-white rounded-lg text-sm hover:bg-slate-600 transition duration-300 max-w-fit"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Image */}
                      <div className="min-w-[200px] max-w-[300px] w-full h-[180px] overflow-hidden rounded-lg">
                        <img
                          src={event.image.imageUrl}
                          alt="Event"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-4 py-10 text-gray-700">
                  <MdEventBusy size={60} className="text-orange-500" />
                  <div className="text-center flex flex-col gap-1">
                    <p className="font-medium text-xl">
                      No {title.toLowerCase()} available!
                    </p>
                    <p className="font-normal text-base">
                      <Link to="/login">
                        <span className="hover:border-b-2 border-orange-500 text-orange-500">
                          Log in
                        </span>
                      </Link>{" "}
                      to create events of your choice!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Events;
