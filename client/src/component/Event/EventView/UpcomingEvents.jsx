import React, { useEffect, useState } from "react";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserUpcomingEvents } from "../../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";

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

const UpcomingEvents = ({ countries, states }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userUpcomingEvents, loading, error } = useSelector(
    (state) => state.events
  );
  // console.log({ userUpcomingEvents });

  const { user } = useSelector((state) => state.user);
  // console.log({ user });

  useEffect(() => {
    dispatch(getUserUpcomingEvents()); // Fetch user events on component mount
  }, [dispatch]);

  if (loading.userUpcomingEvents) {
    return <Loader loading={loading.userUpcomingEvents} />;
  }
  if (error) return toast.error("error");

  const handleNavigate = (eventId) => {
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section className="mt-6">
      <div className="flex flex-col gap-6">
        {Array.isArray(userUpcomingEvents) && userUpcomingEvents.length > 0 ? (
          userUpcomingEvents.map((upcoming, index) => (
            <div
              key={index}
              className="border-l-4 border-orange-500 py-4 px-4 sm:px-6 flex flex-col gap-2 font-inter shadow-sm rounded-lg"
            >
              <p className="font-semibold text-lg text-gray-800">
                {upcoming.startDate
                  ? formatDate(upcoming.startDate)
                  : "Date not available"}
              </p>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center bg-orange-300 bg-opacity-40 rounded-xl p-4">
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatTime(upcoming.startTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {upcoming.eventType}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {upcoming.title}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                      <img
                        src={upcoming.organizer.photo.imageUrl}
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Hosted by {upcoming.organizer.name}{" "}
                      {user?._id === upcoming?.organizer?._id && "(you)"}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2 text-gray-700">
                    {upcoming.eventType === "virtual" ? (
                      <>
                        <IoVideocamOutline size={20} />
                        <a
                          href={upcoming.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Join Meeting
                        </a>
                      </>
                    ) : (
                      <>
                        <IoLocationOutline size={20} />
                        <p className="text-sm">{`${upcoming.location[2]}, ${upcoming.location[1]}`}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigate(upcoming._id)}
                    className="mt-4 w-fit px-6 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>

                <div className="w-full lg:w-[250px] h-[200px] rounded-lg overflow-hidden">
                  <img
                    src={upcoming.image.imageUrl}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border-l-4 border-orange-500 font-inter text-gray-700 text-center px-4 sm:px-10">
            <div className="flex flex-col items-center gap-6 justify-center px-6 py-10 bg-orange-100 bg-opacity-60 rounded-xl shadow-sm">
              <MdEventBusy size={150} className="text-gray-400" />
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-xl">No upcoming event!</p>
                <p className="text-sm">
                  You have no upcoming events. Discover exciting events or
                  create one!
                </p>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <Link to='/event-list'>
                  <button className="px-6 py-2 bg-orange-400 text-white font-medium rounded-full text-sm hover:bg-orange-500 transition-colors">
                    Explore events
                  </button>
                </Link>
                <Link to='/create-event'>
                  <button className="px-6 py-2 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700 transition-colors">
                    Create events
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

export default UpcomingEvents;
