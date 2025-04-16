import React, { useEffect } from "react";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserTickets, getUserUpcomingEvents } from "../../redux/reducers/eventSlice";
import Loader from "../Spinners/Loader";
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

const MyTickets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
//   const { userUpcomingEvents, loading, error } = useSelector(
//     (state) => state.events
//   );
//   console.log({ userUpcomingEvents });

  const { user, isAuthenticated } = useSelector((state) => state.user);
  // console.log({ user });

  const { userTickets, loading, error } = useSelector((state) => state.events);
//   console.log({userTickets})

  useEffect(() => {
    if (isAuthenticated && user) {
        dispatch(getUserTickets());
    }
  }, [isAuthenticated, user, dispatch]);

  // useEffect(() => {
  //   dispatch(getUserUpcomingEvents()); // Fetch user events on component mount
  // }, [dispatch]);

  if (loading.userTickets) {
    return <Loader loading={loading.userTickets} />;
  }
  if (error) return toast.error("error");


//   useEffect(() => {
//     dispatch(getUserTickets());
//   }, [dispatch]);

//   if (loading) return <p>Loading tickets...</p>;
//   if (error) return <p>Error: {error}</p>;

  const handleNavigate = (eventId) => {
    navigate(`/view-event/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section className="mt-6 py-10 md:py-28 px-4 md:px-16 lg:px-20 bg-orange-100 min-h-screen font-inter">
      <div className="flex flex-col gap-6">
        {Array.isArray(userTickets) && userTickets.length > 0 ? (
          userTickets.map((upcoming, index) => (
            <div
              key={index}
              className="border-l-4 border-orange-500 py-4 px-4 sm:px-6 flex flex-col gap-3 font-inter shadow-md rounded-xl"
            >
              <p className="font-semibold text-lg text-gray-800">
                {upcoming?.eventId?.startDate
                  ? formatDate(upcoming?.eventId?.startDate)
                  : "Date not available"}
              </p>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center bg-orange-300 bg-opacity-30 rounded-xl p-4">
                {/* Text content */}
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatTime(upcoming?.eventId?.startTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {upcoming?.eventId?.eventType}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {upcoming?.eventId?.title}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow">
                      <img
                        src={
                          upcoming?.eventId?.organizer?.photo?.imageUrl ||
                          upcoming?.eventId?.organizer?.photo
                        }
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      Hosted by {upcoming?.eventId?.organizer.name}{" "}
                      {user?._id === upcoming?.eventId?.organizer?._id && "(you)"}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center text-gray-800">
                    {upcoming?.eventId?.eventType === "virtual" ? (
                      <>
                        <IoVideocamOutline size={20} />
                        <a
                          href={upcoming?.eventId?.meetLink}
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
                        <p className="text-sm">{`${upcoming?.eventId?.location[2]}, ${upcoming?.eventId?.location[1]}`}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigate(upcoming?.eventId?._id)}
                    className="mt-2 w-fit px-5 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>

                {/* Event image */}
                <div className="w-full sm:w-full lg:w-[250px] h-[200px] rounded-lg overflow-hidden shadow-md">
                  <img
                    src={upcoming?.eventId?.image.imageUrl}
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
                <Link to="/event-list">
                  <button className="px-6 py-2 bg-orange-400 text-white font-medium rounded-full text-sm hover:bg-orange-500 transition-colors">
                    Explore events
                  </button>
                </Link>
                <Link to="/create-event">
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

export default MyTickets;
