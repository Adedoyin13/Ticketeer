import React, { useEffect } from "react";
import image from "./../../../assets/event-image.png";
import { getUpcomingEvents } from "../../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { format } from "date-fns";

const formatDate = (dateString) => {
  return format(dateString, "dd-MM-yyyy");
};

const EventList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { upcomingEvents, loading, error } = useSelector(
    (state) => state.events
  );
  console.log(upcomingEvents);

  useEffect(() => {
    dispatch(getUpcomingEvents()); // Fetch user events on component mount
  }, [dispatch]);

  if (loading.upcomingEvents) {
    return <Loader loading={loading.upcomingEvents} />;
  }
  if (error) return toast.error("error");

  const handleNavigate = (eventId) => {
    console.log("Navigating to event:", eventId);
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname },
    });
  };

  return (
    <section>
      <div className="w-full py-3 font-inter">
        {/* Enable horizontal scroll on small screens */}
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
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-400 hover:bg-orange-200 cursor-pointer"
                  onClick={() => handleNavigate(event._id)}
                >
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        className="rounded-full w-[40px] h-[40px] object-cover shadow-sm"
                        src={event.image.imageUrl}
                        alt="event"
                      />
                      <span>{event.title}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {formatDate(event.startDate)}
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
                        onClick={(e) => e.stopPropagation()}
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
