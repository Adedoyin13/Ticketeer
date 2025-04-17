import React, { useEffect, useState } from "react";
import image from "./../../assets/default-img.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import EventShareModal from "../Modals/EventModal/EventShareModal";
import AttendeeModal from "../Modals/EventModal/AttendeeModal";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";
import { TbTicket } from "react-icons/tb";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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

const EventView = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

  const openShareModal = () => {
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const openAttendeeModal = () => {
    setAttendeeModalOpen(true);
  };

  const closeAttendeeModal = () => {
    setAttendeeModalOpen(false);
  };

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard"); // Go back to the saved route or home if undefined
  };

  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log({ user });

  const [event, setEvent] = useState({});

  useEffect(() => {
    if (!eventId) {
      console.log("Event ID is missing");
      return;
    }

    console.log({ eventId });

    const handleEventDetails = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/event/getEvent/${eventId}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setEvent(response.data);
      } catch (error) {
        console.log("Error fetching event details", error);
      }
    };

    handleEventDetails();
  }, [eventId]);

  const startDate = new Date(event.startDate);

  const formattedMonth = startDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase(); // "APR"
  const dayOfMonth = startDate.getDate();

  const isAttending = event?.attendees?.some(
    (attendee) => attendee?._id === user?._id
  );

  console.log(event);

  return (
    <section className="bg-orange-50 dark:bg-zinc-900 py-20 md:py-28 px-4 md:px-10 font-inter text-gray-800 dark:text-zinc-100">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="w-fit text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full lg:w-[400px]">
            {/* Image */}
            <div className="relative w-full h-60 sm:h-72 bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-md">
              <img
                src={event?.image?.imageUrl}
                alt={`${event.title}'s image`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Cards */}
            {[
              ["Host", event?.organizer?.name],
              ["Attending", "Olajide Rodiyat and 2 others", openAttendeeModal],
              ["Share", "Share event", openShareModal],
            ].map(([label, value, onClick], idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1 px-6 py-4 bg-orange-300 bg-opacity-50 dark:bg-zinc-900/20 shadow-sm border dark:border-zinc-700 rounded-xl"
              >
                <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                  {label}
                </p>
                {label === "Attending" ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={user.photo.imageUrl}
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Attendee"
                    />
                    <p
                      className="text-sm cursor-pointer hover:underline"
                      onClick={onClick}
                    >
                      {value}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`text-base font-medium ${
                      onClick ? "cursor-pointer hover:underline" : ""
                    }`}
                    onClick={onClick}
                  >
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full">
            {/* Title & Info */}
            <div className="flex flex-col gap-6">
              <h2 className="md:text-4xl text-2xl font-bold">{event.title}</h2>

              <div className="flex flex-col gap-4">
                {/* Date/Time */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg border dark:border-zinc-600 shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-orange-600 text-white text-xs py-1 text-center font-semibold uppercase">
                      {formattedMonth}
                    </div>
                    <div className="flex-1 flex items-center justify-center text-xl font-bold">
                      {dayOfMonth}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm md:text-lg font-semibold">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">
                      {/* {formatTime(event.startTime)} – {formatTime(event.endTime)} */}
                    </p>
                  </div>
                </div>

                {/* Location / Link */}
                {/* [Same logic but make sure to add dark: classes to containers/texts] */}
              </div>
            </div>

            {/* Registration / Confirmation */}
            <div className="flex flex-col gap-4 px-4 md:px-6 py-5 bg-orange-300 bg-opacity-50 dark:bg-zinc-900/20 border dark:border-zinc-700 shadow-sm rounded-xl">
              {!isAttending ? (
                <>
                  <p className="text-xl font-semibold">Register to Join</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Log in to reserve your spot at this event
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={user?.photo?.imageUrl}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="You"
                    />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button className="mt-4 self-start px-6 py-2 bg-orange-300 bg-opacity-50 dark:bg-orange-800/30 text-sm rounded-lg hover:bg-orange-700 dark:hover:bg-orange-700 transition">
                    Purchase Ticket
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.photo?.imageUrl}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="You"
                      />
                      <p className="text-lg font-semibold">{user.name}</p>
                    </div>
                    <button className="border border-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800/30 hover:border-orange-300 hover:text-orange-800 dark:hover:text-orange-300 rounded-lg px-4 py-3 text-sm text-orange-700 dark:text-orange-300 flex gap-2">
                      <TbTicket size={20} />
                      My Ticket
                    </button>
                  </div>
                  <p className="text-md text-gray-600 dark:text-zinc-400">
                    A confirmation email has been sent to {user.email}
                  </p>
                </>
              )}
            </div>

            {/* About Event */}
            <div className="flex flex-col gap-2 px-6 py-4 bg-orange-300 bg-opacity-50 dark:bg-zinc-900/20 border dark:border-zinc-700 shadow-sm rounded-xl">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                About the Event
              </h3>
              <p className="text-base">{event.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {shareModalOpen && (
        <EventShareModal
          onClose={closeShareModal}
          eventId={event._id}
          eventName={event.title}
        />
      )}
      {attendeeModalOpen && (
        <AttendeeModal
          onClose={closeAttendeeModal}
          attendees={event.attendees}
        />
      )}
    </section>
  );
};

export default EventView;
