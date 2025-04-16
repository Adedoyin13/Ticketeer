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
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEventBusy } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import { toWords } from "number-to-words";
import {
  cancelEvent,
  deleteEvent,
  getAttendeesForEvent,
  getEventDetails,
  uncancelEvent,
  uploadEventImage,
} from "../../redux/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { toast } from "react-toastify";
import EventShareModal from "../Modals/EventModal/EventShareModal";
import EditEventModal from "../Modals/EventModal/EditEventModal";
import { TbCancel } from "react-icons/tb";
import CancelEvent from "../Modals/EventModal/CancelEvent";
import DeleteEvent from "../Modals/EventModal/DeleteEvent";
import ReactivateModal from "../Modals/EventModal/ReactivateModal";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const openAttendeeModal = () => {
    setAttendeeModalOpen(true);
  };

  const closeAttendeeModal = () => {
    setAttendeeModalOpen(false);
  };

  const openShareModal = () => {
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  const openCancelModal = () => {
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const openReactivateModal = () => {
    setReactivateModalOpen(true);
  };

  const closeReactivateModal = () => {
    setReactivateModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const { eventId } = useParams(); // Get eventId from URL
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log({ user });
  // const { loading } = useSelector((state) => state.events);

  const [eventDetails, setEventDetails] = useState({});
  const [formData, setFormData] = useState({
    image: null, // or any other default values you need
  });

  console.log(formData);

  const [profilePhoto, setProfilePhoto] = useState(formData?.image?.imageUrl);

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard"); // Go back to the saved route or home if undefined
  };

  const handleDelete = async () => {
    if (user && isAuthenticated) {
      try {
        const resultAction = await dispatch(deleteEvent(eventId));
        console.log(eventId);
        console.log(resultAction);

        if (deleteEvent.fulfilled.match(resultAction)) {
          toast.success("Event deleted successfully");
          navigate("/dashboard");
        } else {
          toast.error(resultAction.payload || "Failed to delete event");
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    } else {
      toast.error("Unable to delete event");
    }
  };

  useEffect(() => {
    if (!eventId) {
      console.log("Event ID is missing");
      return;
    }

    const handleEventDetails = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/event/getEvent/${eventId}`,
          { withCredentials: true }
        );
        setEventDetails(response.data);
      } catch (error) {
        console.log("Error fetching event details", error);
      }
    };

    handleEventDetails();
  }, [eventId]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
      console.log(formData);
      setIsPhotoChanged(true); // ← This is needed!
      e.target.value = "";
    }
  };

  // if (loading.uploadImage) {
  //   return <Loader loading={loading.uploadImage} />;
  // }

  const handlePhotoUpload = async () => {
    if (!isPhotoChanged || !formData.image) {
      return toast.error("Please select an image to upload.");
    }

    try {
      await dispatch(
        uploadEventImage({
          eventId: eventDetails._id,
          imageFile: formData.image,
        })
      ).unwrap();
      setProfilePhoto(formData.image); // Update image URL if necessary
      toast.success("Event image updated successfully!");
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
    }
  };

  const handleReactivateEvent = () => {
    dispatch(uncancelEvent(eventDetails._id))
      .unwrap()
      .then(() => {
        toast.success("Event resumed successfully");
        closeReactivateModal();
      })
      .catch((err) => {
        toast.error(err || "Failed to resume event");
      });
  };

  const handleCancelEvent = () => {
    dispatch(cancelEvent(eventDetails._id))
      .unwrap()
      .then(() => {
        toast.success("Event cancelled successfully");
        closeCancelModal();
      })
      .catch((err) => {
        toast.error(err || "Failed to cancel event");
      });
  };

  // useEffect(() => {
  //   const handleGetAttendeeForEvent = () => {
  //     dispatch(getAttendeesForEvent(eventDetails._id))
  //       .unwrap()
  //       .then(() => {
  //         // toast.success("Attendee cancelled successfully");
  //         closeAttendeeModal();
  //       })
  //       .catch((err) => {
  //         toast.error(err || "Failed to get attendee for this event");
  //       });
  //   };
  //   console.log(eventDetails._id)
  //   handleGetAttendeeForEvent();
  // }, [eventDetails._id]);

  const isUpdateDisabled = !isFormChanged && !isPhotoChanged;

  const isUpcoming = () => {
    if (!eventDetails?.startDate || !eventDetails?.startTime) return false;

    const datePart = new Date(eventDetails.startDate)
      .toISOString()
      .split("T")[0];
    let timePart = eventDetails.startTime.trim();

    // Ensure time is in HH:mm:ss format
    if (/^\d{2}:\d{2}$/.test(timePart)) {
      timePart += ":00";
    }

    const combinedDateTimeStr = `${datePart}T${timePart}`;
    const eventDateTime = new Date(combinedDateTimeStr);

    return new Date() < eventDateTime;
  };

  console.log("Event Details:", eventDetails);

  return (
    <section className="bg-orange-100 py-24 md:py-28 font-inter">
      <div className="flex flex-col px-4 sm:px-6 md:px-10 gap-5 max-w-7xl mx-auto">
        {/* Back Button */}
        <button onClick={handleBack}>
          <FaArrowLeft size={20} />
        </button>

        {/* Event Title + Description */}
        <div className="flex flex-col gap-4 text-gray-700">
          <p className="font-semibold text-2xl sm:text-3xl">
            {eventDetails.title}
          </p>

          {isUpcoming() ? (
            <div className="flex flex-col gap-1 text-base sm:text-lg">
              <p>{eventDetails.description}</p>
              <p className="flex flex-col gap-1 text-base sm:text-lg">
                {eventDetails.categories}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-lg text-gray-600">
                This event has ended!
              </p>
              <p className="text-gray-500 font-medium text-sm">
                Thank you for hosting, we hope it was a success!
              </p>
            </div>
          )}

          <p>
            {eventDetails?.canceled && (
              <span className="text-red-500 font-bold">Canceled</span>
            )}
          </p>
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

          {eventDetails?.organizer?._id === user._id && isUpcoming() && (
            <>
              {eventDetails?.canceled === false ? (
                <button
                  onClick={openCancelModal}
                  className="flex gap-3 items-center border border-orange-500 bg-orange-300 bg-opacity-50 px-6 py-3 sm:px-10 rounded-lg"
                >
                  <TbCancel className="text-red-500" size={20} />
                  Cancel event
                </button>
              ) : (
                <button
                  onClick={openReactivateModal}
                  className="flex gap-3 items-center border border-orange-500 bg-orange-300 bg-opacity-50 px-6 py-3 sm:px-10 rounded-lg"
                >
                  Resume Event
                </button>
              )}

              <button
                onClick={openDeleteModal}
                className="flex gap-3 items-center border border-orange-500 bg-orange-300 bg-opacity-50 px-6 py-3 sm:px-10 rounded-lg"
              >
                <RiDeleteBin5Line className="text-red-500" size={20} />
                Delete event
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="">
            <div className="relative w-full lg:w-[300px] h-[200px] sm:h-[200px] rounded-lg p-2 bg-orange-300 bg-opacity-50 overflow-hidden border border-orange-500 shadow-md">
              <img
                src={profilePhoto || eventDetails?.image?.imageUrl}
                alt={`${eventDetails.title}'s image`}
                className="w-full h-full object-cover rounded-lg"
              />
              {eventDetails?.organizer?._id === user._id && isUpcoming() && (
                <button className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-orange-300 text-gray-700 p-2 rounded-full shadow-md transition">
                  {/* <MdOutlineEdit size={20} /> */}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    hidden
                    id="photoUpload"
                  />
                  <label
                    htmlFor="photoUpload"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <MdOutlineEdit size={20} />
                  </label>
                </button>
              )}
            </div>

            {eventDetails?.organizer?._id === user._id && isUpcoming() && (
              <div className="flex items-center mt-5 justify-center w-full">
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className={`py-3 px-14 text-white rounded-md text-sm max-w-[200px] bg-slate-500 hover:bg-slate-600`}
                  disabled={isUpdateDisabled}
                >
                  Update
                  {/* {isUpdateDisabled ? "Updating image..." : "Update"} */}
                </button>
              </div>
            )}
          </div>

          {/* Recap */}
          <div className="bg-orange-300 bg-opacity-50 flex-1 border border-orange-400 rounded-lg px-4 sm:px-6 pt-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">EVENT RECAP</p>
              {eventDetails?.organizer?._id === user._id && isUpcoming() && (
                <button
                  className="hover:bg-orange-300 p-2 rounded-lg"
                  onClick={openEditModal}
                >
                  <MdOutlineEdit size={20} />
                </button>
              )}
            </div>

            <div className="flex gap-4 text-gray-700 items-center">
              <MdOutlineCalendarMonth size={24} />
              <div className="flex flex-col gap-1 border-b border-gray-700 py-2 w-full">
                <p>
                  {eventDetails.startDate
                    ? formatDate(eventDetails.startDate)
                    : "Date not available"}
                </p>
                <p>
                  {eventDetails.startTime
                    ? formatTime(eventDetails.startTime)
                    : "Time not available"}
                </p>
              </div>
            </div>

            {eventDetails.eventType === "virtual" ? (
              isUpcoming() ? (
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
                <div className="flex gap-4 items-center text-gray-700 mt-4">
                  <IoVideocamOutline size={24} />
                  <p className="text-sm border-b border-gray-700 py-2 w-full">
                    Meet ended
                  </p>
                </div>
              )
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
              <p>
                {eventDetails?.attendees?.length}{" "}
                {eventDetails?.attendees?.length > 1
                  ? "registrations"
                  : "registration"}
              </p>
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
                <p className="text-sm text-center">
                  You do not have any feedback yet for this event
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Event Link */}
        <div className="flex justify-between gap-4 border border-orange-500 bg-orange-300 bg-opacity-50 px-4 py-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <IoLinkOutline size={20} />
            <p className="break-all text-sm sm:text-base">{CLIENT_URL}</p>
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
          {isUpcoming() && (
            <button className="px-4 sm:px-10 py-2 bg-orange-400 text-white font-medium rounded-full text-sm hover:bg-orange-500">
              Add collectible
            </button>
          )}
        </div>

        {/* Hosted By */}
        <div className="flex flex-col gap-3 border border-orange-500 bg-orange-300 bg-opacity-50 px-4 py-4 rounded-lg">
          <p className="font-medium text-sm">HOSTED BY</p>
          <div className="flex gap-2 items-center">
            <div className="w-[24px] h-[24px] overflow-hidden rounded-full bg-white">
              <img
                src={eventDetails?.organizer?.photo?.imageUrl}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm">{eventDetails?.organizer?.name}</p>
          </div>
        </div>
      </div>

      {attendeeModalOpen && (
        <AttendeeModal
          onClose={closeAttendeeModal}
          attendees={eventDetails.attendees}
        />
      )}
      {shareModalOpen && (
        <EventShareModal
          onClose={closeShareModal}
          eventId={eventDetails._id}
          eventName={eventDetails.title}
        />
      )}
      {editModalOpen && (
        <EditEventModal onClose={closeEditModal} eventId={eventDetails._id} />
      )}
      {cancelModalOpen && (
        <CancelEvent onClose={closeCancelModal} onCancel={handleCancelEvent} />
      )}
      {reactivateModalOpen && (
        <ReactivateModal
          onClose={closeReactivateModal}
          onReactivate={handleReactivateEvent}
        />
      )}
      {deleteModalOpen && (
        <DeleteEvent onClose={closeDeleteModal} onDelete={handleDelete} />
      )}
    </section>
  );
};

export default EventDetails;
