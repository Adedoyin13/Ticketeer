import React, { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import EventTabs from "../Event/EventTabs/EventTabs";
import { Link } from "react-router-dom";
import { getUser } from "../../redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { getUserEvents } from "../../redux/reducers/eventSlice";
import { toast } from "react-toastify";

// const userEvents = ''

const Dashboard = () => {
  const dispatch = useDispatch();

  // ✅ Get user state
  const {
    user,
    isAuthenticated,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);

  console.log({ user });

  // console.log({user})

  // ✅ Get events state
  const {
    userEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state) => state.events);

  console.log({ userEvents });

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getUserEvents());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!user) {
    return <Loader loading={userLoading} />;
  }

  // ✅ Handle separate loading states
  if (eventsLoading.userEvents)
    return <Loader loading={eventsLoading.userEvents} />;
  if (userLoading) return <Loader loading={userLoading} />;

  // ✅ Handle separate error states
  if (userError) return toast.error(`Error fetching user: ${userError}`);
  if (eventsError) return toast.error(`Error fetching events: ${eventsError}`);

  // const DEFAULT_IMAGE_URL = `https://via.placeholder.com/150x150?text=${encodeURIComponent(user.name)}`;
  // const DEFAULT_IMAGE_URL = `https://placehold.co/150x150?text=${encodeURIComponent(name)}`;

  // console.log(DEFAULT_IMAGE_URL);  // Check the URL in the console to verify

  // const DEFAULT_IMAGE_URL = `https://placehold.co/150x150/${bgColor}/${textColor}?text=${initials}&font=roboto`;

  // const initials = getInitials(name);
  // const DEFAULT_IMAGE_URL = `https://placehold.co/150x150/EEE/333?text=${initials}&font=roboto`;
  // console.log(DEFAULT_IMAGE_URL);

  return (
    <>
      <div className="relative min-h-screen w-full">
        {/* Fixed Background Layer */}
        <div className="fixed inset-0 z-0 bg-orange-50 dark:bg-zinc-950" />

        {/* Scrollable Content Layer */}
        <section className="relative z-10 font-inter py-24 px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between gap-12 w-full">
            {/* Profile Card */}
            <div className="flex flex-col gap-6 w-full md:max-w-xs items-center md:items-stretch">
              <div className="relative flex flex-col gap-5 p-6 w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-orange-200 dark:border-zinc-700">
                {/* Edit Button */}
                <Link to="/settings/profile-update">
                  <button
                    aria-label="Edit Profile"
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-zinc-700 transition"
                  >
                    <MdModeEdit size={22} className="text-orange-600" />
                  </button>
                </Link>

                {/* Profile Details */}
                {userLoading ? (
                  <div className="animate-pulse flex flex-col items-center gap-4 py-16">
                    <div className="w-20 h-20 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="w-32 h-4 bg-zinc-300 dark:bg-zinc-700 rounded" />
                    <div className="w-48 h-3 bg-zinc-300 dark:bg-zinc-700 rounded" />
                  </div>
                ) : userError ? (
                  <p className="text-center text-red-500 py-16">{error}</p>
                ) : user ? (
                  <div className="flex flex-col gap-4 items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-300 dark:border-zinc-700 shadow-md bg-orange-100 dark:bg-zinc-800">
                      <img
                        src={user?.photo?.imageUrl}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">
                        {user.name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="py-16 text-center text-zinc-600 dark:text-zinc-400">
                    No user data available
                  </p>
                )}
              </div>

              {/* Create Event Button */}
              <Link to="/create-event" className="w-full">
                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold rounded-full shadow-md transition text-base tracking-wide">
                  + Create Event
                </button>
              </Link>

              {/* Stats */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col justify-center items-center gap-2 py-5 px-4 w-full h-[100px] bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-orange-200 dark:border-zinc-700">
                  <p className="text-xl font-bold text-orange-600">
                    {userEvents?.length || 0}
                  </p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Events Created
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 py-5 px-4 w-full h-[100px] bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-orange-200 dark:border-zinc-700">
                  <p className="text-xl font-bold text-orange-600">
                    {user?.ticket?.length || 0}
                  </p>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Tickets Purchased
                  </p>
                </div>
              </div>
            </div>

            {/* Event Tabs Section */}
            <div className="w-full">
              <EventTabs />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
