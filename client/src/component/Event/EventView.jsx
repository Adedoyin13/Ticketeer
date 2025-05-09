import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import EventShareModal from "../Modals/EventModal/EventShareModal";
import AttendeeModal from "../Modals/EventModal/AttendeeModal";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { TbTicket } from "react-icons/tb";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import {
  getEventDetails,
  getUserTickets,
} from "../../redux/reducers/eventSlice";
import PurchaseTicketModal from "../Modals/TicketModal/PurchaseTicketModal";
import Ticket from "../Modals/TicketModal/Ticket";

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
  const [purhaseModalOpen, setPurhaseModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { eventId } = useParams();

  const openShareModal = () => {
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const openPurchaseModal = () => {
    setPurhaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setPurhaseModalOpen(false);
  };
  const openTicketModal = () => {
    setTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setTicketModalOpen(false);
  };

  const openAttendeeModal = () => {
    setAttendeeModalOpen(true);
  };

  const closeAttendeeModal = () => {
    setAttendeeModalOpen(false);
  };

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard");
  };

  const { user, isAuthenticated } = useSelector((state) => state.user);
  // console.log({ user });

  const { eventDetails, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (!eventId) {
      // toast.error("Event ID is missing");
      return;
    }

    const handleEventDetails = async () => {
      try {
        if (user && isAuthenticated) {
          dispatch(getEventDetails(eventId));
        }
      } catch (error) {
        toast.error("Error fetching event details", error);
      }
    };

    handleEventDetails();
  }, [eventId, dispatch, getEventDetails, user]);

  if (loading.eventDetails) {
    return <Loader loading={loading.eventDetails} />;
  }

  if (error) {
    return toast.error(error || "Unable to get event details");
  }

  const startDate = new Date(eventDetails.startDate);

  const formattedMonth = startDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase(); // "APR"
  const dayOfMonth = startDate.getDate();

  const isAttending = eventDetails?.attendees?.some(
    (attendee) => attendee?._id === user?._id
  );

  const attendees = eventDetails?.attendees || [];

  const handleNavigate = (eventId) => {
    navigate(`/ticket-page/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

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
                src={eventDetails?.image?.imageUrl}
                alt={`${eventDetails.title}'s image`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Info Cards */}

            {[
              ["Host", eventDetails?.organizer?.name, null],
              [
                "Attending",
                attendees.length > 0
                  ? `${attendees[0]?.name}${
                      attendees.length > 1
                        ? ` (and ${attendees.length - 1} others)`
                        : ""
                    }`
                  : "No attendees yet",
                openAttendeeModal,
              ],
              ["Share", "Share event", openShareModal],
            ].map(([label, value, onClick], idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 px-6 py-4 bg-orange-300 bg-opacity-50 dark:bg-zinc-900/20 shadow-sm border dark:border-zinc-700 rounded-xl"
              >
                <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                  {label}
                </p>

                {label === "Host" ? (
                  <div className="flex items-center gap-3">
                    {/* Organizer avatar and name */}
                    <div className="flex items-center gap-2">
                      {eventDetails?.organizer?.photo?.imageUrl && (
                        <img
                          src={eventDetails.organizer.photo.imageUrl}
                          className="w-6 h-6 rounded-full object-cover"
                          alt="Host"
                        />
                      )}
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {eventDetails?.organizer?.name || "Unknown Organizer"}
                      </p>
                    </div>

                    {/* Social links (conditionally rendered) */}
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-300">
                      {eventDetails?.organizer?.socialMediaLinks?.x && (
                        <a
                          href={eventDetails.organizer?.socialMediaLinks?.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-500"
                          aria-label="Twitter"
                        >
                          <FaTwitter className="w-4 h-4" />
                        </a>
                      )}

                      {eventDetails?.organizer?.socialMediaLinks?.linkedin && (
                        <a
                          href={
                            eventDetails.organizer?.socialMediaLinks?.linkedin
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-700"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin className="w-4 h-4" />
                        </a>
                      )}

                      {eventDetails?.organizer?.socialMediaLinks?.instagram && (
                        <a
                          href={
                            eventDetails.organizer?.socialMediaLinks?.instagram
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-pink-500"
                          aria-label="Instagram"
                        >
                          <FaInstagram className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : label === "Attending" ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:underline"
                    onClick={onClick}
                  >
                    {attendees[0]?.photo?.imageUrl && (
                      <img
                        src={attendees[0]?.photo?.imageUrl}
                        alt={attendees[0]?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <p className="text-sm font-medium">{value}</p>
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
              <h2 className="md:text-4xl text-2xl font-bold">
                {eventDetails.title}
              </h2>

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
                      {formatDate(eventDetails.startDate)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">
                      {eventDetails.startTime} – {eventDetails.endTime}
                    </p>
                  </div>
                </div>

                {/* Location / Link */}
                {eventDetails?.eventType === "virtual" ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg border dark:border-zinc-600 shadow-sm flex flex-col overflow-hidden items-center justify-center">
                      <IoVideocamOutline size={30} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm md:text-lg font-semibold">
                        View Link
                      </p>
                      <a
                        href={eventDetails.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 underline flex flex-col gap-1 w-full"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg border dark:border-zinc-600 shadow-sm flex flex-col overflow-hidden items-center justify-center">
                      <IoLocationOutline size={30} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm md:text-lg font-semibold">
                        {/* View Location */}
                        {eventDetails &&
                          eventDetails.location &&
                          `${eventDetails.location[2]}, ${eventDetails.location[1]}.`}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400">
                        {eventDetails &&
                          eventDetails.location &&
                          `${eventDetails.location[0]}, ${eventDetails.location[4]}, ${eventDetails.location[3]}.`}
                      </p>
                    </div>
                  </div>
                )}
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
                  {eventDetails?.ticketTypes?.length > 0 ? (
                    <button
                      className="mt-4 self-start px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
                      onClick={openPurchaseModal}
                    >
                      Purchase Ticket
                    </button>
                  ) : (
                    <button className="mt-4 self-start px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition">
                      No more Ticket for this event
                    </button>
                  )}
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
                    <button
                      onClick={() => handleNavigate(eventDetails._id)}
                      className="border border-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800/30 hover:border-orange-300 hover:text-orange-800 dark:hover:text-orange-300 rounded-lg px-4 py-3 text-sm text-orange-700 dark:text-orange-300 flex gap-2"
                    >
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
              <section className="prose dark:prose-invert max-w-none text-gray-600 dark:text-zinc-400">
                <div
                  dangerouslySetInnerHTML={{ __html: eventDetails.description }}
                />
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {shareModalOpen && (
        <EventShareModal
          onClose={closeShareModal}
          eventId={eventDetails._id}
          eventName={eventDetails.title}
        />
      )}
      {attendeeModalOpen && (
        <AttendeeModal
          onClose={closeAttendeeModal}
          attendees={eventDetails.attendees}
        />
      )}
      {purhaseModalOpen && (
        <PurchaseTicketModal
          onClose={closePurchaseModal}
          tickets={eventDetails.ticketTypes}
          event={eventDetails}
          user={user}
        />
      )}
      {ticketModalOpen && (
        <Ticket
          onClose={closeTicketModal}
          // ticket={ticket}
        />
      )}
      {/* {console.log({ticket})} */}
    </section>
  );
};

export default EventView;
