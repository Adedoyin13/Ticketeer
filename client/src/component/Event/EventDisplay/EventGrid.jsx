import React, { useEffect } from "react";
import image from "./../../../assets/event-image.png";
import { getUpcomingEvents } from "../../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Spinners/Loader";
import { FaRegHeart, FaHeart } from "react-icons/fa";
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

const EventGrid = ({ events }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const { upcomingEvents, loading, error } = useSelector(
  //   (state) => state.events
  // );
  const { loading, error } = useSelector((state) => state.events);

  // console.log(upcomingEvents);

  useEffect(() => {
    dispatch(getUpcomingEvents()); // Fetch user events on component mount
  }, [dispatch]);

  if (loading.events) {
    return <Loader loading={loading.events} />;
  }
  if (error) return toast.error("error");

  const handleNavigate = (eventId) => {
    navigate(`/view-event/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  // import { Heart } from "lucide-react"; // or any icon library you're using
  return (
    // Inside your component
    <section className="w-full px-4 sm:px-6 md:px-10 font-inter mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          return (
            
            <div
              key={index}
              onClick={() => handleNavigate(event._id)}
              className="relative h-[220px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition duration-300"
            >
              
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    event.image.imageUrl || "/default-image.png"
                  })`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition duration-300 backdrop-blur-sm" />

              {/* Heart Icon */}
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  toggleLike(event._id);
                }}
                className="absolute top-3 right-3 z-20 bg-white dark:bg-zinc-800 bg-opacity-70 dark:bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition"
              >
                {/* {isLiked ? (
                  <FaHeart className="text-red-500 text-2xl transition" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-2xl transition" />
                )} */}
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-end h-full px-2 py-2">
                <div className="bg-white dark:bg-zinc-900 bg-opacity-80 dark:bg-opacity-80 w-full rounded-xl p-3 flex justify-between items-center backdrop-blur-md">
                  <div className="flex flex-col text-gray-800 dark:text-zinc-200">
                    <p className="font-semibold text-base sm:text-lg line-clamp-1">
                      {event.title}
                    </p>
                    <p className="text-sm">{formatDate(event.startDate)}</p>
                  </div>
                  <div className="flex justify-center items-center bg-orange-400 text-white font-bold rounded-md h-10 w-12 text-center text-sm">
                    {event?.ticketTypes.map((pr) => pr.price)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventGrid;
