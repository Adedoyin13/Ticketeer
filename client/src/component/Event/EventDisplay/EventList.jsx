import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  getUpcomingEvents,
  likeEvent,
  unlikeEvent,
} from "../../../redux/reducers/eventSlice";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy");
};

const EventList = ({ events }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { upcomingEvents, loading, error, likedEvents } = useSelector(
  //   (state) => state.events
  // );
  const { loading, error, likedEvents } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getUpcomingEvents()); // Fetch upcoming events on component mount
  }, [dispatch]);

  const handleLike = (eventId) => {
    if (likedEvents.includes(eventId)) {
      dispatch(unlikeEvent(eventId)); // Unlike event if already liked
    } else {
      dispatch(likeEvent(eventId)); // Like event if not liked yet
    }
  };

  if (loading.likeEvent || loading.unlikeEvent) {
    return <Loader loading={true} />;
  }

  if (error) {
    toast.error(error);
  }

  const handleNavigate = (eventId) => {
    navigate(`/view-event/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section className="font-inter w-full">
      <div className="w-full py-6">
        <div className="overflow-x-auto rounded-xl shadow-sm bg-white dark:bg-zinc-900">
          <table className="min-w-[900px] w-full table-auto border-collapse text-sm md:text-base">
            <thead className="bg-gray-100 dark:bg-zinc-800 border-b border-gray-300 dark:border-zinc-700">
              <tr className="text-left text-gray-600 dark:text-zinc-300 font-semibold">
                <th className="px-5 py-4 whitespace-nowrap">Event</th>
                <th className="px-5 py-4 whitespace-nowrap">Date</th>
                <th className="px-5 py-4 whitespace-nowrap">Time</th>
                <th className="px-5 py-4 whitespace-nowrap">Type</th>
                <th className="px-5 py-4 whitespace-nowrap">Location</th>
                <th className="px-5 py-4 whitespace-nowrap">Meet Link</th>
                <th className="px-5 py-4 whitespace-nowrap">Capacity</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-zinc-200">
              {events.map((event) => (
                <motion.tr
                  key={event._id}
                  onClick={() => handleNavigate(event._id)}
                  whileTap={{ scale: 0.98 }}
                  className="hover:bg-orange-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer border-b border-gray-200 dark:border-zinc-700"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow"
                        src={event.image.imageUrl || "/default-image.png"}
                        alt={event.title}
                      />
                      <span className="font-medium">{event.title}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {formatDate(event.startDate)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {event.startTime}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap capitalize">
                    {event.eventType}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {event.eventType === "physical"
                      ? `${event.location[2]}, ${event.location[1]}`
                      : "-"}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {event.eventType === "virtual" ? (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Join
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">{event.limit}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EventList;
