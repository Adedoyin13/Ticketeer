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
    <section className="bg-orange-100 py-20 md:py-28 px-4 md:px-10 font-inter">
      <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="w-fit text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex flex-col gap-4 w-full lg:w-[400px]">
            {/* Image */}
            <div className="relative w-full h-60 sm:h-72 bg-orange-300 bg-opacity-50 rounded-lg p-2 border border-orange-500 shadow-md">
              <img
                src={event?.image?.imageUrl}
                alt={`${event.title}'s image`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Host */}
            <div className="flex flex-col gap-1 px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
              <p className="text-sm text-gray-700 font-medium">Host</p>
              <p className="text-base font-medium">
                {event?.organizer?.name}{" "}
                {user?.name === event?.organizer?.name && (
                  <span className="text-xs text-gray-500 font-normal">
                    (you)
                  </span>
                )}
              </p>
            </div>

            {/* Attending */}
            <div className="flex flex-col gap-1 px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
              <p className="text-sm text-gray-700 font-medium">Attending</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white overflow-hidden">
                  <img
                    src={user.photo.imageUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-sm cursor-pointer"
                  onClick={openAttendeeModal}
                >
                  Olajide Rodiyat and 2 others
                </p>
              </div>
            </div>

            {/* Share */}
            <div className="flex flex-col gap-1 px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
              <p className="text-sm text-gray-700 font-medium">Share</p>
              <p
                className="text-base font-medium cursor-pointer"
                onClick={openShareModal}
              >
                Share event
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full">
            {/* Title & Info */}
            <div className="flex flex-col gap-6">
              <p className="md:text-3xl text-xl font-semibold">{event.title}</p>

              <div className="flex flex-col gap-4">
                {/* Date/Time */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border border-gray-300 rounded-md shadow-md overflow-hidden">
                    <div className="bg-orange-500 text-white text-xs text-center py-1 font-semibold">
                      {formattedMonth}
                    </div>
                    <div className="flex-1 flex items-center justify-center text-xl font-bold text-gray-800">
                      {dayOfMonth}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm md:text-lg font-medium">
                      {event.startDate
                        ? formatDate(event.startDate)
                        : "Date not available"}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {event.startTime
                        ? formatTime(event.startTime)
                        : "Time not available"}
                      {" - "}
                      {event.endTime
                        ? formatTime(event.endTime)
                        : "Time not available"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {event?.eventType === "phusical" ? (
                  isAttending ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 border border-gray-300 rounded-md shadow-md flex items-center justify-center">
                        <IoLocationOutline size={30} />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm md:text-lg font-medium">
                          {event?.location
                            ? `${event.location[4]}`
                            : "Location not available"}
                        </p>
                        <div className="flex flex-col gap-1 border-b border-gray-700 py-2 w-full">
                          <p>
                            {event?.location
                              ? `${event.location[4]} ${event.location[3]}, ${event.location[2]} ${event.location[1]}, ${event.location[0]}`
                              : "Location not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 border border-gray-300 rounded-md shadow-md flex items-center justify-center">
                        <IoLocationOutline size={30} />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm md:text-lg font-medium">
                          Register to view location
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {event?.location
                            ? `${event.location[4]}`
                            : "Location not available"}
                        </p>
                      </div>
                    </div>
                  )
                ) : isAttending ? (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 border border-gray-300 rounded-md shadow-md flex items-center justify-center">
                      <IoVideocamOutline size={30} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm md:text-lg font-medium">
                        Event Link
                      </p>
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 underline border-b"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 border border-gray-300 rounded-md shadow-md flex items-center justify-center">
                      <IoVideocamOutline size={30} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm md:text-lg font-medium">
                        Register to view link
                      </p>
                      <p className="text-xs md:text-sm underline text-blue-600">
                        View link
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Box */}
            {!isAttending ? (
              <div className="flex flex-col gap-3 px-2 md:px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
                <div>
                  <p className="text-xl font-medium text-gray-700">
                    Registration
                  </p>
                  <p className="text-sm text-gray-500">
                    To join the event, register below
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                    <img
                      src={user?.photo?.imageUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button className="mt-4 w-fit px-6 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                  Purchase Ticket
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-2 md:px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                        <img
                          src={user?.photo?.imageUrl}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-lg font-semibold">{user.name}</p>
                    </div>
                    <button
                      // onClick={openDeleteModal}
                      className="flex gap-3 items-center border border-orange-500 bg-orange-300 hover:bg-orange-400 hover:bg-opacity-50 bg-opacity-50 px-4 py-2 sm:px-6 rounded-lg"
                    >
                      <TbTicket size={20} />
                      My ticket
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-medium">You're in!</p>
                    <p className="text-md text-gray-600">
                      A confirmation email has been sent to {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* About Event */}
            <div className="flex flex-col gap-1 px-6 py-4 bg-orange-300 bg-opacity-50 shadow-md rounded-xl">
              <p className="text-sm font-medium text-gray-700">
                About The Event
              </p>
              <p className="text-base font-medium">{event.description}</p>
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
