import React, { useEffect } from "react";
import image from "./../../../assets/event-image.png";
import { getUpcomingEvents } from "../../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Spinners/Loader";
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

const EventGrid = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
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
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section>
  <div className="flex w-full mt-6 font-inter px-4">
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-6 cursor-pointer">
      {upcomingEvents.map((event, index) => {
        const backgroundImage = `url(${event.image.imageUrl})`;
        return (
          <div
            key={index}
            className="w-full h-[200px] flex items-end shadow-md rounded-2xl overflow-hidden p-2 transform transition-all hover:scale-105 hover:shadow-xl duration-300"
            onClick={() => handleNavigate(event._id)}
            style={{ backgroundImage }}
          >
            <div className="bg-orange-200 flex justify-between items-center w-full rounded-lg bg-opacity-60 p-3 backdrop-blur-sm">
              <div className="flex flex-col gap-1 text-black">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm">{formatDate(event.startDate)}</p>
              </div>
              <div className="flex justify-center items-center bg-slate-400 rounded-lg h-[40px] w-[50px] px-3">
                <p className="text-white font-bold">{event.limit}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

  );
};

export default EventGrid;
