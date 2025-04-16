import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { getUpcomingEvents, likeEvent, unlikeEvent } from "../../../redux/reducers/eventSlice";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy");
};

const EventList = ({events}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // const { upcomingEvents, loading, error, likedEvents } = useSelector(
  //   (state) => state.events
  // );
  const { loading, error, likedEvents } = useSelector(
    (state) => state.events
  );

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
    <section className="font-inter">
      <div className="w-full py-3">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full table-auto border-collapse">
            <thead className="border-b border-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Event
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Time
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Event Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Location
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Meet Link
                </th>
                <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Event Capacity
                </th>
                {/* <th className="text-left px-4 py-3 font-medium text-sm md:text-base whitespace-nowrap">
                  Like
                </th> */}
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event._id}
                  onClick={() => handleNavigate(event._id)}
                  className="border-b border-gray-400 hover:bg-orange-200 cursor-pointer"
                >
                  <td
                    className="px-4 py-4 text-sm whitespace-nowrap"
                    onClick={() => handleLike(event._id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="rounded-full w-[40px] h-[40px] object-cover shadow-sm"
                        src={event.image.imageUrl || "/default-image.png"}
                        alt="event"
                      />
                      <span>{event.title}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {formatDate(event.startDate)}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {event.startTime}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
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
                      >
                        Join Meeting
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {event.limit}
                  </td>
                  {/* <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleLike(event._id)}
                      className="text-red-500"
                    >
                      {likedEvents.includes(event._id) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EventList;