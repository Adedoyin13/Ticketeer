import React, { useEffect } from "react";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingEvents, getUserFavouriteEvents } from "../../../redux/reducers/eventSlice";
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

const FavouriteEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  
   useEffect(() => {
      dispatch(getUpcomingEvents()); // Fetch upcoming events on component mount
    }, [dispatch]);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const currentUserId = useSelector((state) => state.user.user._id);
  const {upcomingEvents,loading, error } = useSelector((state) => state.events)
  console.log(upcomingEvents)
  console.log(upcomingEvents)

  if(loading.upcomingEvents) {
    return <Loader loading={loading.upcomingEvents}/>
  }
  if(error) {
    return toast.error(error)
  }
    // const { upcomingEvents } = useSelector((state) => state.events);
  
  console.log(upcomingEvents)

  // useEffect(() => {
  //   if(user && isAuthenticated) {
  //     dispatch(getUserFavouriteEvents());
  //   }
  // }, [dispatch, user, isAuthenticated]);

  // if (loading.favouriteEvents) {
  //   return <Loader loading={loading.favouriteEvents} />;
  // }
  // if (error) return toast.error("error");

  const handleNavigate = (eventId) => {
    navigate(`/view-event/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  const likedEvents = upcomingEvents.filter(event =>
    event.likedUsers?.some(user => user._id === currentUserId)
  );  

  console.log(upcomingEvents)
  console.log(likedEvents)
  return (
    <section className="mt-10 font-inter mb-20">
      <div className="flex flex-col gap-8">
        {Array.isArray(likedEvents) && likedEvents.length > 0 ? (
          likedEvents.map((favourite, index) => (
            <div
              key={index}
              className="border-l-4 border-orange-500 bg-white dark:bg-zinc-900 shadow-md rounded-xl p-5 sm:p-6"
            >
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                {favourite.startDate
                  ? formatDate(favourite.startDate)
                  : "Date not available"}
              </p>

              <div className="flex flex-col lg:flex-row gap-6 bg-orange-50 dark:bg-zinc-800 bg-opacity-50 rounded-xl p-4">
                {/* Event Info */}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <p className="text-base text-zinc-600 dark:text-zinc-300">
                      {formatTime(favourite.startTime)}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {favourite.eventType}
                    </p>
                    <p className="text-xl font-bold text-zinc-800 dark:text-white">
                      {favourite.title}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-zinc-700 shadow-sm">
                      <img
                        src={
                          favourite.organizer?.photo?.imageUrl ||
                          favourite.organizer?.photo
                        }
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Hosted by {favourite.organizer.name}{" "}
                      {user?._id === favourite?.organizer?._id && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          (you)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {favourite.eventType === "virtual" ? (
                      <>
                        <IoVideocamOutline size={18} />
                        <a
                          href={favourite.meetLink}
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
                        <p>{`${favourite.location[2]}, ${favourite.location[1]}`}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigate(favourite._id)}
                    className="mt-4 w-fit px-5 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-full transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Event Image */}
                <div className="w-full lg:w-[250px] h-[200px] rounded-xl overflow-hidden shadow-md">
                  <img
                    src={favourite.image.imageUrl}
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
                  No favourite event!
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You have no favourite events. Discover exciting events or
                  create one!
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full text-sm hover:bg-orange-600 transition">
                  Explore events
                </button>
                <Link to="/create-event">
                  <button className="px-6 py-2 bg-slate-600 text-white font-medium rounded-full text-sm hover:bg-slate-700 transition">
                    Create event
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

export default FavouriteEvents;
