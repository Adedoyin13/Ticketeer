import React, { useEffect } from "react";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserPastEvents } from "../../../redux/reducers/eventSlice";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":"); // Split "HH:mm" format
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

const PastEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { pastEvents, loading, error } = useSelector((state) => state.events);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
   if(user && isAuthenticated) {
    dispatch(getUserPastEvents());
   }
  }, [dispatch, user, isAuthenticated]);

  if (loading.pastEvents) {
    return <Loader loading={loading.pastEvents} />;
  }
  if (error) return toast.error("error");

  const handleNavigate = (eventId) => {
    navigate(`/event-details/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section className="mt-10 font-inter mb-20">
      <div className="flex flex-col gap-8">
        {Array.isArray(pastEvents) && pastEvents.length > 0 ? (
          pastEvents.map((past, index) => (
            <div
              key={index}
              className="border-l-4 border-orange-500 bg-white dark:bg-zinc-900 shadow-md rounded-xl p-5 sm:p-6"
            >
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                {past.startDate
                  ? formatDate(past.startDate)
                  : "Date not available"}
              </p>

              <div className="flex flex-col lg:flex-row gap-6 bg-orange-50 dark:bg-zinc-800 bg-opacity-50 rounded-xl p-4">
                {/* Event Info */}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <p className="text-base text-zinc-600 dark:text-zinc-300">
                      {formatTime(past.startTime)}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {past.eventType}
                    </p>
                    <p className="text-xl font-bold text-zinc-800 dark:text-white">
                      {past.title}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-zinc-700 shadow-sm">
                      <img
                        src={
                          past.organizer?.photo?.imageUrl ||
                          past.organizer?.photo
                        }
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Hosted by {past.organizer.name}{" "}
                      {user?._id === past?.organizer?._id && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          (you)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {past.eventType === "virtual" ? (
                      <>
                        <IoVideocamOutline size={18} />
                        <a
                          href={past.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline"
                        >
                          Join Meeting
                        </a>
                      </>
                    ) : (
                      <>
                        <IoLocationOutline size={18} />
                        <p>{`${past.location[2]}, ${past.location[1]}`}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigate(past._id)}
                    className="mt-4 w-fit px-5 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-full transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Event Image */}
                <div className="w-full lg:w-[250px] h-[200px] rounded-xl overflow-hidden shadow-md">
                  <img
                    src={past.image.imageUrl}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border-l-4 border-orange-500 bg-orange-100 dark:bg-zinc-800 bg-opacity-50 rounded-xl shadow-md px-6 py-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <MdEventBusy size={100} className="text-zinc-400" />
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold text-zinc-800 dark:text-white">
                  No event found!
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No past event was found. Create your own event!
                </p>
              </div>
              <Link to="/create-event">
                <button className="px-6 py-2 bg-slate-600 text-white hover:bg-slate-700 rounded-md text-sm transition">
                  Create event
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PastEvents;
