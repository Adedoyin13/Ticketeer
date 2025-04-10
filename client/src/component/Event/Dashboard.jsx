import React, { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import EventTabs from "../Event/EventTabs/EventTabs";
import { Link } from "react-router-dom";
import { getUser } from "../../redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { getUserEvents } from "../../redux/reducers/eventSlice";
import { toast } from "react-toastify";

const userEvents = ''

const Dashboard = () => {
  const dispatch = useDispatch();

  // ✅ Get user state
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);

  console.log({user})

  // console.log({user})

  // ✅ Get events state
  const {
    userEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state) => state.events);

  console.log({userEvents})

  useEffect(() => {
    if(user) {
      dispatch(getUserEvents());
    }
  }, [dispatch]);


  if(!user) {
    return <Loader loading={userLoading}/>
  }

  // ✅ Handle separate loading states
  if (eventsLoading.userEvents) return <Loader loading={eventsLoading.userEvents} />;
  if (userLoading) return <Loader loading={userLoading} />;

  // ✅ Handle separate error states
  if (userError) return toast.error(`Error fetching user: ${userError}`);
  if (eventsError) return toast.error(`Error fetching events: ${eventsError}`);

  return (
    <section className="bg-orange-100 py-28 font-inter">
      <div className="flex flex-col md:flex-row justify-between px-6 md:px-12 lg:px-16 gap-12 w-full">
        {/* Profile Card */}
        <div className="flex flex-col gap-6 w-80 md:w-96 items-center">
          <div className="relative flex flex-col w-full h-[200px] gap-5 py-6 px-4 bg-orange-300 bg-opacity-50 rounded-xl shadow-md">
            {/* Edit Button */}
            <Link to="/settings/profile-update">
              <button className="absolute top-4 right-4 hover:bg-orange-100 transition p-2 rounded-lg">
                <MdModeEdit size={22} />
              </button>
            </Link>

            {/* Profile Details */}
            {userLoading ? (
              <p className="text-center text-gray-600 py-28">Loading...</p>
            ) : userError ? (
              <p className="text-center text-red-500 py-28">{error}</p>
            ) : user ? (
              <div className="flex flex-col gap-4 items-center">
                <div className="w-14 h-14 overflow-hidden rounded-full">
                  <img
                    src={user.photo?.imageUrl}
                    alt="User image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <p className="font-medium text-lg md:text-lg">{user.name}</p>
                  <p className="text-xs md:text-sm text-gray-700">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-28">No user data available</p>
            )}
          </div>

          {/* Create Event Button */}
          <Link to="/create-event">
            <button className="px-6 sm:px-12 md:px-16 py-3 w-full bg-orange-400 text-white font-semibold rounded-full text-sm md:text-base transition hover:bg-orange-500">
              Create event
            </button>
          </Link>

          {/* Stats Section */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col gap-2 py-5 px-4 w-full h-[100px] items-center bg-orange-300 shadow-md bg-opacity-50 rounded-xl">
              <p className="font-semibold text-lg md:text-xl">
                {userEvents?.length}
              </p>
              <p className="text-sm md:text-base font-medium">Events Created</p>
            </div>
            <div className="flex flex-col gap-2 py-5 px-4 w-full h-[100px] items-center bg-orange-300 shadow-md bg-opacity-50 rounded-xl">
              <p className="font-semibold text-lg md:text-xl">0</p>
              <p className="text-sm md:text-base font-medium">
                Tickets Purchased
              </p>
            </div>
          </div>
        </div>

        {/* Event Tabs */}
        <div className="w-full">
          <EventTabs />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
