import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegUser } from "react-icons/fa";
import { IoLinkOutline, IoShareSocialOutline } from "react-icons/io5";
import AttendeeModal from "../Modals/EventModal/AttendeeModal";
import { CiLocationOn } from "react-icons/ci";
import { VscBug } from "react-icons/vsc";
import {
  MdContentCopy,
  MdFeedback,
  MdModeEdit,
  MdOutlineCalendarMonth,
  MdOutlineEdit,
} from "react-icons/md";
import CopyToClipboard from "../ClipboardCopy/CopyToClipboard";

import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { MdEventBusy } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import { toWords } from "number-to-words";
import { getEventDetails } from "../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import EventShareModal from "../Modals/EventModal/EventShareModal";

const feedbacks = [
  // {
  //   name: "User",
  //   email: "user@gmail.com",
  //   img: img,
  //   comment:
  //     "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
  //   rating: "",
  // },
];

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

const EventDetails = () => {
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const openAttendeeModal = () => {
    setAttendeeModalOpen(true);
  };

  const closeAttendeeModal = () => {
    setAttendeeModalOpen(false);
  };

  const openShareModal = () => {
    setShareModalOpen(true);
  };

  const closeASharModal = () => {
    setShareModalOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(location.state?.from || "/"); // Go back to the saved route or home if undefined
  };

  const { eventId } = useParams(); // Get eventId from URL
  const dispatch = useDispatch();
  // const { eventDetails, loading, error } = useSelector((state) => state.events);
  // console.log({eventDetails})

  // console.log("Event Details:", eventDetails);
  // console.log("Loading State:", loading);
  // console.log("Error State:", error);

  const { user } = useSelector((state) => state.user);
  console.log({ user });

  // useEffect(() => {
  //   if (eventId) {
  //     console.log("Attempting to dispatch getEventDetails with eventId:", eventId);
  //     dispatch(getEventDetails(eventId));
  //   }
  // }, [dispatch, eventId, getEventDetails]);

  // useEffect(() => {
  //   console.log("Event Details Loading State:", loading.eventDetails);
  // }, [loading.eventDetails]);

  // if (loading.eventDetails) return <Loader />; // ✅ Corrected loading check
  // if (error) return toast.error(error);

  // console.log({ eventDetails });

  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    const handleEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/event/getEvent/${eventId}`,
          { withCredentials: true }
        );
        console.log("✅ Event details API response:", response.data);
        setEventDetails(response.data);
      } catch (error) {
        console.log(
          "❌ Error fetching event:",
          error.response?.data || error.message
        );
      }
    };
    handleEventDetails();
  });

  return (
    <section className="bg-orange-100 py-24 md:py-28 font-inter">
    <div className="flex flex-col px-4 sm:px-6 md:px-10 gap-5 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <button onClick={handleBack}>
        <FaArrowLeft size={20} />
      </button>
  
      {/* Event Title + Description */}
      <div className="flex flex-col gap-2 text-gray-700">
        <p className="font-semibold text-2xl sm:text-3xl">{eventDetails.title}</p>
        <div className="flex flex-col gap-1 text-base sm:text-lg">
          <p>{eventDetails.description}</p>
          <p>
            {eventDetails.startDate
              ? formatDate(eventDetails.startDate)
              : "Date not available"}
          </p>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <button
          onClick={openAttendeeModal}
          className="flex gap-3 items-center border border-orange-500 bg-orange-300 bg-opacity-50 px-6 py-3 sm:px-10 rounded-lg"
        >
          <FaRegUser size={20} />
          Check in Guest
        </button>
  
        <button
          onClick={openShareModal}
          className="flex gap-3 items-center border border-orange-500 bg-orange-300 bg-opacity-50 px-6 py-3 sm:px-10 rounded-lg"
        >
          <IoShareSocialOutline size={20} />
          Share event
        </button>
      </div>
  
      {/* Image + Recap + Feedback Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Image */}
        <div className="relative w-full lg:w-[300px] h-[250px] sm:h-[300px] rounded-lg p-2 bg-orange-300 bg-opacity-50 overflow-hidden border border-orange-500 shadow-md">
          <img
            src={eventDetails?.image?.imageUrl}
            alt="Event"
            className="w-full h-full object-cover rounded-lg"
          />
          <button className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-orange-300 text-gray-700 p-2 rounded-full shadow-md transition">
            <MdOutlineEdit size={20} />
          </button>
        </div>
  
        {/* Recap */}
        <div className="bg-orange-300 bg-opacity-50 flex-1 border border-orange-400 rounded-lg px-4 sm:px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">EVENT RECAP</p>
            <button className="hover:bg-orange-300 p-2 rounded-lg">
              <MdOutlineEdit size={20} />
            </button>
          </div>
  
          <div className="flex gap-4 text-gray-700 items-center">
            <MdOutlineCalendarMonth size={24} />
            <div className="flex flex-col gap-1 border-b border-gray-700 py-2 w-full">
              <p>{eventDetails.startDate ? formatDate(eventDetails.startDate) : "Date not available"}</p>
              <p>{eventDetails.startTime ? formatTime(eventDetails.startTime) : "Time not available"}</p>
            </div>
          </div>
  
          {eventDetails.eventType === "virtual" ? (
            <div className="flex gap-4 items-center text-gray-700 mt-4">
              <IoVideocamOutline size={24} />
              <a
                href={eventDetails.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline border-b border-gray-700 py-2 w-full"
              >
                Join Meeting
              </a>
            </div>
          ) : (
            <div className="flex gap-4 text-gray-700 items-center mt-4">
              <IoLocationOutline size={24} />
              <p className="py-2 border-b w-full border-gray-700">
                {eventDetails?.location
                  ? `${eventDetails.location[4]} ${eventDetails.location[3]}, ${eventDetails.location[2]} ${eventDetails.location[1]}, ${eventDetails.location[0]}`
                  : "Location not available"}
              </p>
            </div>
          )}
  
          <div className="flex gap-4 text-gray-700 items-center mt-4">
            <FaRegUser size={24} />
            <p>20 registrations</p>
          </div>
        </div>
  
        {/* Feedback */}
        <div className="flex-1">
          {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="bg-orange-300 bg-opacity-50 border border-orange-400 rounded-lg px-4 sm:px-6 pt-6 pb-4 mb-4"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-[50px] h-[50px] overflow-hidden rounded-full bg-white">
                    <img
                      src={feedback.img}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{feedback.name}</p>
                    <p className="text-gray-700 text-sm">{feedback.email}</p>
                  </div>
                </div>
                <p className="text-sm mt-3">{feedback.comment}</p>
                <div className="flex justify-center mt-4">
                  <button className="py-2 px-6 sm:px-10 bg-slate-500 text-white hover:bg-slate-600 rounded-md text-sm">
                    View all feedbacks
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center gap-4 bg-orange-300 bg-opacity-50 border border-orange-400 rounded-lg px-6 pt-6 pb-4">
              <MdFeedback size={75} />
              <p>No feedback yet</p>
              <p className="text-sm text-center">You do not have any feedback yet for this event</p>
            </div>
          )}
        </div>
      </div>
  
      {/* Event Link */}
      <div className="flex justify-between gap-4 border border-orange-500 bg-orange-300 bg-opacity-50 px-4 py-4 rounded-lg">
        <div className="flex gap-2 items-center">
          <IoLinkOutline size={20} />
          <p className="break-all text-sm sm:text-base">https://ticketeer.io/events</p>
        </div>
        <button>
          <CopyToClipboard />
        </button>
      </div>
  
      {/* NFT Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border border-orange-500 bg-orange-300 bg-opacity-50 px-4 py-4 rounded-lg">
        <div className="flex gap-4 items-center">
          <VscBug size={25} />
          <div className="flex flex-col">
            <p className="font-medium text-base">No collectible found</p>
            <p className="text-sm">
              You can attach NFTs & rewards for your guests to claim
            </p>
          </div>
        </div>
        <button className="px-4 sm:px-10 py-2 bg-orange-400 text-white font-medium rounded-full text-sm hover:bg-orange-500">
          Add collectible
        </button>
      </div>
  
      {/* Hosted By */}
      <div className="flex flex-col gap-3 border border-orange-500 bg-orange-300 bg-opacity-50 px-4 py-4 rounded-lg">
        <p className="font-medium text-sm">HOSTED BY</p>
        <div className="flex gap-2 items-center">
          <div className="w-[24px] h-[24px] overflow-hidden rounded-full bg-white">
            <img
              src={user?.photo?.imageUrl}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm">{user?.name}</p>
          
        </div>
      </div>
    </div>
  
    {attendeeModalOpen && <AttendeeModal onClose={closeAttendeeModal} />}
    {shareModalOpen && (
      <EventShareModal
        onClose={closeASharModal}
        eventId={eventDetails._id}
        eventName={eventDetails.title}
      />
    )}
  </section>
  
  );
};

export default EventDetails;
