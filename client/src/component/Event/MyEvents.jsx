import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosCloseCircle, IoIosSearch } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEventBusy, MdModeEditOutline } from "react-icons/md";
import { format } from "date-fns";
import Loader from "../Spinners/Loader";
import EditEventModal from "../Modals/EventModal/EditEventModal";
import DeleteEvent from "../Modals/EventModal/DeleteEvent";

const formatDate = (dateString) => format(new Date(dateString), "dd-MM-yyyy");
const formatTime = (timeString) => format(new Date(timeString), "HH:mm");

const MyEvents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const { userEvents, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (error) toast.error("Failed to load events");
  }, [error]);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleNavigate = (eventId) => {
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname },
    });
  };

  const filteredEvents = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return userEvents?.filter((event) => {
      const locationText =
        event.eventType === "physical"
          ? `${event.location[2]}, ${event.location[1]}`.toLowerCase()
          : "";

      return (
        event.title.toLowerCase().includes(term) ||
        event.eventType.toLowerCase().includes(term) ||
        formatDate(event.startDate).includes(term) ||
        formatTime(event.startDate).includes(term) ||
        locationText.includes(term)
      );
    });
  }, [debouncedSearch, userEvents]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading.userEvents) return <Loader loading={loading.userEvents} />;

  return (
    <section className="font-inter bg-orange-50 dark:bg-zinc-900 min-h-screen py-28 px-4 sm:px-6 md:px-10 lg:px-20">      

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
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

      {/* Events Table */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-800 shadow-md rounded-xl border border-gray-200 dark:border-zinc-700">
        <table className="min-w-[800px] w-full table-auto">
          <thead className="bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 text-sm">
            <tr>
              {[
                "Event",
                "Date",
                "Time",
                "Event Type",
                "Location",
                "Meet Link",
                "Capacity",
                // "Actions",
              ].map((title) => (
                <th
                  key={title}
                  className="px-5 py-4 text-left font-semibold whitespace-nowrap"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEvents && filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <tr
                  key={index}
                  className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  onClick={() => handleNavigate(event._id)}
                >
                  <td className="px-5 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        className="rounded-full w-10 h-10 object-cover shadow-sm"
                        src={event.image?.imageUrl}
                        alt="event"
                      />
                      <span className="font-medium text-gray-800 dark:text-zinc-100">
                        {event.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400">
                    {formatDate(event.startDate)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400">
                    {event.startTime}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400 capitalize">
                    {event.eventType}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400">
                    {event.eventType === "physical"
                      ? `${event.location[2]}, ${event.location[1]}`
                      : "-"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {event.eventType === "virtual" ? (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Meeting
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-zinc-400">
                    {event.limit}
                  </td>
                  {/* <td
                    className="px-5 py-4 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-3 items-center text-gray-500 dark:text-zinc-400">
                      <MdModeEditOutline
                        className="hover:text-orange-600 cursor-pointer"
                        size={20}
                        onClick={openEditModal}
                      />
                      <RiDeleteBin5Line
                        className="hover:text-red-600 cursor-pointer"
                        size={20}
                        onClick={openDeleteModal}
                      />
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center text-center px-8 py-12">
                    <MdEventBusy
                      size={80}
                      className="text-gray-300 dark:text-zinc-500 mb-4"
                    />
                    <p className="text-lg font-semibold text-gray-800 dark:text-zinc-100 mb-2">
                      No events match your search
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
                      Try adjusting your search or create a new event.
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                      <Link to="/event-list">
                        <button className="px-5 py-2 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition">
                          Explore events
                        </button>
                      </Link>
                      <Link to="/create-event">
                        <button className="px-5 py-2 bg-gray-700 dark:bg-zinc-700 text-white rounded-full text-sm hover:bg-gray-800 dark:hover:bg-zinc-800 transition">
                          Create event
                        </button>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editModalOpen && <EditEventModal onClose={closeEditModal} />}
      {deleteModalOpen && <DeleteEvent onClose={closeDeleteModal} />}
    </section>
  );
};

export default MyEvents;
