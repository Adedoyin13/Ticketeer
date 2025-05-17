import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProfilePage = () => {
    const navigate = useNavigate()
  const { user } = useSelector((state) => state.user);
  const { userEvents } = useSelector((state) => state.events);

  const handleNavigate = (eventId) => {
    navigate(`/view-event/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <div>
      <div className="w-full min-h-screen bg-orange-50 dark:bg-zinc-950 px-4 py-28 font-inter">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 dark:bg-zinc-700">
              <img
                src={user?.photo?.imageUrl || "/default-avatar.jpg"}
                alt="Profile Picture"
                className="object-cover w-full h-full"
              />
            </div>

            {/* User Info */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
                {user?.name || "User Name"}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                {user?.email || "user@example.com"}
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {/* Social Media Links */}
                {user?.socialMediaLinks?.facebook && (
                  <a
                    href={user.socialMediaLinks.facebook}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                    target="_blank"
                  >
                    <FaFacebook size={24} />
                  </a>
                )}
                {user?.socialMediaLinks?.x && (
                  <a
                    href={user.socialMediaLinks.x}
                    target="_blank"
                  >
                    <FaXTwitter size={24} />
                  </a>
                )}
                {user?.socialMediaLinks?.instagram && (
                  <a
                    href={user.socialMediaLinks.instagram}
                    className="text-pink-600 dark:text-pink-400 hover:text-pink-800"
                    target="_blank"
                  >
                    <FaInstagram size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User's Events Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-6">
            Your Events
          </h2>

          {/* Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents?.length ? (
              userEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Event Title */}
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  {/* Event Date */}
                  <p className="text-sm text-zinc-500 dark:text-zinc-300 mb-4">
                    {formatDate(event.startDate)} at {event.startTime}
                  </p>

                  {/* Event Image */}
                  <div className="w-full h-32 bg-gray-200 dark:bg-zinc-700 rounded-md mb-4">
                    <img
                      src={event.image.imageUrl || "/event-placeholder.jpg"}
                      alt={event.title}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>

                  {/* View Event Button */}
                  <button
                    className="w-full bg-orange-500 text-white py-2 rounded-full mt-2 hover:bg-orange-600 transition"
                    onClick={() => handleNavigate(event._id)}
                  >
                    View Event
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 dark:text-zinc-300">
                You have no upcoming events.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
