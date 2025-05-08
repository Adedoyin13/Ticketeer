import React, { useEffect, useState } from "react";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserTickets } from "../../redux/reducers/eventSlice";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import Ticket from "../Modals/TicketModal/Ticket";
import EventView from "../Event/EventView";

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

const MyTickets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.user);
  const { userTickets, loading, error } = useSelector((state) => state.events);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (error) {
      return toast.error("error");
    }
  }, [error]);
  if (loading.userTickets) {
    return <Loader loading={loading.userTickets} />;
  }
  console.log({ error });

  const handleNavigate = (ticketId) => {
    navigate(`/ticket-page/${ticketId}`, {
      state: { from: location.pathname },
    });
  };

  // Filter tickets based on search query
  const filteredTickets = userTickets.filter((ticket) =>
    ticket?.eventId?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear search query function
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section className="mt-6 py-10 md:py-20 px-4 md:px-16 lg:px-20 bg-orange-100 dark:bg-zinc-900 min-h-screen font-inter">
      <div className="flex flex-col gap-8">
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

        {Array.isArray(filteredTickets) && filteredTickets.length > 0 ? (
          filteredTickets.map((upcoming, index) => (
            <div
              key={index}
              className="border-l-4 border-orange-500 bg-white dark:bg-zinc-800 shadow-lg rounded-2xl p-6 sm:p-8 transition duration-300 hover:shadow-xl"
            >
              {/* Date Header */}
              <p className="text-sm font-semibold text-orange-600 mb-2">
                {upcoming?.eventId?.startDate
                  ? formatDate(upcoming?.eventId?.startDate)
                  : "Date not available"}
              </p>

              {/* Card Body */}
              <div className="flex flex-col lg:flex-row gap-6 bg-orange-50 dark:bg-zinc-700 bg-opacity-50 rounded-xl p-4">
                {/* Event Details */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">
                      {formatTime(upcoming?.eventId?.startTime)}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                      {upcoming?.eventId?.eventType}
                    </p>
                    <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                      {upcoming?.eventId?.title}
                    </p>
                  </div>

                  <div className="hidden">
                    <EventView ticket={upcoming?._id} />
                  </div>
                  {console.log({ upcoming })}

                  {/* Organizer */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shadow">
                      <img
                        src={
                          upcoming?.eventId?.organizer?.photo?.imageUrl ||
                          upcoming?.eventId?.organizer?.photo ||
                          "/default-avatar.png"
                        }
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">
                      Hosted by{" "}
                      <span className="font-medium">
                        {upcoming?.eventId?.organizer.name}
                      </span>{" "}
                      {user?._id === upcoming?.eventId?.organizer?._id &&
                        "(you)"}
                    </p>
                  </div>

                  {/* Event Type Info */}
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {upcoming?.eventId?.eventType === "virtual" ? (
                      <>
                        <IoVideocamOutline className="text-lg" />
                        <a
                          href={upcoming?.eventId?.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Join Meeting
                        </a>
                      </>
                    ) : (
                      <>
                        <IoLocationOutline className="text-lg" />
                        <span>{`${upcoming?.eventId?.location[2]}, ${upcoming?.eventId?.location[1]}`}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigate(upcoming?._id)}
                    className="mt-3 w-fit px-6 py-2 rounded-full bg-zinc-700 dark:bg-orange-500 dark:hover:bg-orange-600 hover:bg-zinc-800 text-white text-sm font-medium transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Event Image */}
                <div className="w-full sm:w-full lg:w-[260px] h-[180px] rounded-xl overflow-hidden shadow-md">
                  <img
                    src={
                      upcoming?.eventId?.image.imageUrl || "/default-image.png"
                    }
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border-l-4 border-orange-500 font-inter text-gray-700 dark:text-zinc-200 text-center px-4 sm:px-10">
            <div className="flex flex-col items-center gap-6 justify-center px-6 py-10 bg-orange-100 dark:bg-zinc-800 bg-opacity-60 rounded-xl shadow-sm">
              <MdEventBusy
                size={120}
                className="text-gray-400 dark:text-zinc-500"
              />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-xl text-zinc-700 dark:text-zinc-100">
                  No tickets yet
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  You haven’t purchased a ticket for any event.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <Link to="/event-list">
                  <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full text-sm transition">
                    Explore Events
                  </button>
                </Link>
                <Link to="/create-event">
                  <button className="px-6 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-md text-sm transition">
                    Create Event
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTickets;
