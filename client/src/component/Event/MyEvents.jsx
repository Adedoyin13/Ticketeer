import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEventBusy, MdModeEditOutline } from "react-icons/md";
import { format } from "date-fns";
import { getUserEvents } from "../../redux/reducers/eventSlice";
import Loader from "../Spinners/Loader";
import EditEventModal from "../Modals/EventModal/EditEventModal";
import DeleteEvent from "../Modals/EventModal/DeleteEvent";

const formatDate = (dateString) => format(new Date(dateString), "dd-MM-yyyy");
const formatTime = (timeString) => format(new Date(timeString), "HH:mm");

const MyEvents = () => {
  const dispatch = useDispatch();
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
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getUserEvents());
    }
  }, [isAuthenticated, user, dispatch]);

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

  if (loading.userEvents) return <Loader loading={loading.userEvents} />;

  return (
    <section className="font-inter bg-orange-100 min-h-screen">
      <div className="w-full py-28 px-4 sm:px-6 md:px-10 lg:px-20">
        {/* Search Bar */}
        <div className="border-b border-gray-300 mb-5">
          <div className="bg-customGradient p-1 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4 bg-orange-100 rounded-xl text-slate-500">
              <div className="flex items-center gap-2 w-full relative">
                <IoIosSearch size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent w-full outline-none text-sm text-gray-800 placeholder-gray-500 pr-8"
                  placeholder="Search by name, location, date, category, or time"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-0 text-gray-400 hover:text-red-500 px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full table-auto border-collapse">
            <thead className="border-b border-gray-400 text-gray-700">
              <tr>
                {["Event", "Date", 'Time', "Event Type", "Location", "Meet Link", "Event Capacity", "Actions"].map((title) => (
                  <th key={title} className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
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
                    className="border-b border-gray-300 hover:bg-orange-200 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleNavigate(event._id)}
                  >
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          className="rounded-full w-[40px] h-[40px] object-cover shadow-sm"
                          src={event.image?.imageUrl}
                          alt="event"
                        />
                        <span className="text-sm font-medium">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {formatDate(event.startDate)}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {event.startTime}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap capitalize">
                      {event.eventType}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {event.eventType === "physical"
                        ? `${event.location[2]}, ${event.location[1]}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {event.eventType === "virtual" ? (
                        <a
                          href={event.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Join Meeting
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">{event.limit}</td>
                    <td
                      className="px-4 py-4 text-sm whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-3 items-center text-gray-600">
                        <MdModeEditOutline className="hover:text-blue-600 cursor-pointer" size={20} onClick={openEditModal}/>
                        <RiDeleteBin5Line className="hover:text-red-600 cursor-pointer" size={20} onClick={openDeleteModal}/>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center gap-6 w-full justify-center px-6 py-10 bg-orange-100 bg-opacity-60 rounded-xl shadow-sm">
                      <MdEventBusy size={100} className="text-gray-400" />
                      <div className="flex flex-col gap-2 text-center">
                        <p className="font-semibold text-xl text-gray-800">No events found</p>
                        <p className="text-sm text-gray-600">
                          Try adjusting your search or create a new event!
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center justify-center">
                        <Link to="/event-list">
                          <button className="px-6 py-2 bg-orange-400 text-white font-medium rounded-full text-sm hover:bg-orange-500 transition-colors">
                            Explore events
                          </button>
                        </Link>
                        <Link to="/create-event">
                          <button className="px-6 py-2 bg-slate-600 text-white rounded-full text-sm hover:bg-slate-700 transition-colors">
                            Create events
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
      </div>
      {editModalOpen && <EditEventModal onClose={closeEditModal}/>}
      {deleteModalOpen && <DeleteEvent onClose={closeDeleteModal}/>}
    </section>
  );
};

export default MyEvents;