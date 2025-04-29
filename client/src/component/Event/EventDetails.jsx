import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegUser } from "react-icons/fa";
import { IoLinkOutline, IoShareSocialOutline } from "react-icons/io5";
import AttendeeModal from "../Modals/EventModal/AttendeeModal";
import { VscBug } from "react-icons/vsc";
import {
  MdFeedback,
  MdOutlineCalendarMonth,
  MdOutlineEdit,
} from "react-icons/md";
import CopyToClipboard from "../ClipboardCopy/CopyToClipboard";

import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  cancelEvent,
  deleteEvent,
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
import { LuTicket } from "react-icons/lu";
import CancelEvent from "../Modals/EventModal/CancelEvent";
import DeleteEvent from "../Modals/EventModal/DeleteEvent";
import ReactivateModal from "../Modals/EventModal/ReactivateModal";
import EditTicketModal from "../Modals/TicketModal/EditTicketModal";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

const formatDate = (dateString) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate.replace(/,\s$/, "");
};

const EventDetails = () => {
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editTicketModalOpen, setEditTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { eventId } = useParams(); // Get eventId from URL
  const dispatch = useDispatch();

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);

  const [imageFile, setImageFile] = useState({
    image: null, // or any other default values you need
  });
  const [profilePhoto, setProfilePhoto] = useState(imageFile?.image?.imageUrl);

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const loadingUploadImage = useSelector(
    (state) => state.events.loading.uploadImage
  );

  const { eventDetails, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(getEventDetails(eventId));
    }
  }, [dispatch, eventId]);

  useEffect(() => {
    if (!eventId) {
      toast.error("Event ID is missing");
      return;
    }

    const handleEventDetails = async () => {
      try {
        dispatch(getEventDetails(eventId));
      } catch (error) {
        toast.error("Error fetching event details", error);
      }
    };

    handleEventDetails();
  }, [eventId, dispatch, getEventDetails]);

  if (loading.eventDetails) {
    return <Loader loading={loading.eventDetails} />;
  }

  if (error) {
    return toast.error(error || "Unable to get event details");
  }

  const openEditEventModal = () => {
    setEditEventModalOpen(true);
  };

  const closeEditEventModal = () => {
    setEditEventModalOpen(false);
  };

  const openEditTicketModal = (ticket) => {
    setEditTicketModalOpen(true);
    setEditingTicket(ticket);
  };

  const closeEditTicketModal = () => {
    setEditTicketModalOpen(false);
    setEditingTicket(null);
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

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard"); // Go back to the saved route or home if undefined
  };

  const handleDelete = async () => {
    if (user) {
      try {
        const resultAction = await dispatch(deleteEvent(eventId)).unwrap();

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

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setImageFile((prev) => ({ ...prev, image: file }));
      setIsPhotoChanged(true); // ← This is needed!
      e.target.value = "";
    }
  };

  // if (loading.uploadImage) {
  //   return <Loader loading={loading.uploadImage} />;
  // }

  const handlePhotoUpload = async () => {
    if (!isPhotoChanged || !imageFile.image) {
      return toast.error("Please select an image to upload.");
    }

    try {
      const response = await dispatch(
        uploadEventImage({
          eventId: eventId,
          imageFile: imageFile.image,
        })
      ).unwrap();

      // Assuming your backend returns the new image URL
      const newImageUrl = response?.image?.imageUrl;

      if (newImageUrl) {
        setProfilePhoto(newImageUrl); // Update with actual URL
        toast.success("Event image updated successfully!");
      } else {
        toast.warn("Image uploaded, but URL not returned.");
      }

      // const bustCacheUrl = `${newImageUrl}?t=${Date.now()}`;
      // setProfilePhoto(bustCacheUrl);
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      window.location.reload();
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

  const isUpdateDisabled = !isFormChanged && !isPhotoChanged;

  const isUpcoming = () => {
    if (!eventDetails?.startDate || !eventDetails?.startTime) {
      return false;
    }

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

  const description = eventDetails.description;

  const toggleShow = () => setShowFull((prev) => !prev);
  const isLong = description?.length > 50;

  const handleNavigate = (eventId) => {
    navigate(`/create-ticket/${eventId}`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  return (
    <section className="bg-orange-50 dark:bg-zinc-900 py-24 md:py-28 font-inter text-gray-800 dark:text-zinc-100">
      <div className="flex flex-col px-4 sm:px-6 md:px-10 gap-6 max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white active:text-orange-600 transition w-[50px]"
        >
          <FaArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col gap-3">
          <p className="text-3xl font-bold">{eventDetails.title}</p>
          {isUpcoming() ? (
            <div className="text-base text-gray-600 dark:text-zinc-300">
              <div>
                <p>
                  {showFull || !isLong
                    ? description
                    : `${description.slice(0, 50)}...`}
                </p>
                {isLong && (
                  <button
                    onClick={toggleShow}
                    className="text-orange-500 underline text-sm mt-1"
                  >
                    {showFull ? "See less" : "See more"}
                  </button>
                )}
              </div>

              <p className="mt-1 text-sm font-medium text-primary/80">
                {eventDetails.categories
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-600 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-200">
              <p className="font-semibold">This event has ended!</p>
              <p className="text-xs mt-1">
                Thank you for hosting, we hope it was a success!
              </p>
            </div>
          )}
          {eventDetails?.canceled && (
            <span className="text-red-500 font-bold">Canceled</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {[
            {
              label: "Check in Guest",
              icon: <FaRegUser size={18} />,
              onClick: openAttendeeModal,
            },
            {
              label: "Share event",
              icon: <IoShareSocialOutline size={18} />,
              onClick: openShareModal,
            },
            eventDetails?.canceled === false && {
              label: "Cancel event",
              icon: <TbCancel size={18} />,
              onClick: openCancelModal,
            },
            eventDetails?.canceled && {
              label: "Resume Event",
              onClick: openReactivateModal,
            },
            {
              label: "Delete event",
              icon: <RiDeleteBin5Line size={18} />,
              onClick: openDeleteModal,
            },
          ]
            .filter(Boolean)
            .map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-100/40 dark:bg-zinc-800 border border-orange-200 dark:border-zinc-700 text-orange-700 dark:text-orange-300 hover:bg-orange-200/50 dark:hover:bg-zinc-700 transition duration-200 text-sm font-medium shadow-sm"
              >
                {btn.icon && <span>{btn.icon}</span>}
                <span>{btn.label}</span>
              </button>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mt-2">
          <div className="w-full lg:w-[300px] rounded-2xl bg-orange-100/30 dark:bg-zinc-800/50 backdrop-blur-sm border border-orange-300 dark:border-zinc-700 shadow-lg p-4 relative">
            <div className="w-full h-[200px] rounded-xl overflow-hidden relative">
              <img
                src={profilePhoto || eventDetails?.image?.imageUrl}
                alt={`${eventDetails.title}'s image`}
                className="w-full h-full object-cover rounded-xl"
              />
              {eventDetails?.organizer?._id === user._id && isUpcoming() && (
                <label
                  htmlFor="photoUpload"
                  className="absolute top-2 right-2 bg-white/80 dark:bg-zinc-700/80 hover:bg-orange-200 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-100 p-2 rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  <MdOutlineEdit size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    hidden
                    id="photoUpload"
                  />
                </label>
              )}
            </div>

            {eventDetails?.organizer?._id === user._id && isUpcoming() && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdateDisabled}
                >
                  {loadingUploadImage ? (
                    <>
                      Updating <Loader loading={loadingUploadImage} />
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="bg-orange-100/30 dark:bg-zinc-800/50 backdrop-blur-sm border border-orange-300 dark:border-zinc-700 rounded-2xl p-6 shadow-lg flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
                Event Recap
              </h2>
              {eventDetails?.organizer?._id === user._id && isUpcoming() && (
                <button
                  onClick={openEditEventModal}
                  className="p-2 rounded-xl bg-white/30 dark:bg-zinc-700 hover:bg-orange-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  <MdOutlineEdit
                    size={20}
                    className="text-orange-600 dark:text-zinc-100"
                  />
                </button>
              )}
            </div>

            <div className="flex gap-4 items-start text-zinc-800 dark:text-zinc-200 mb-6">
              <MdOutlineCalendarMonth size={24} className="mt-1" />
              <div className="flex flex-col gap-1 py-1 w-full border-b border-zinc-300 dark:border-zinc-600">
                <p className="font-medium">
                  {eventDetails && formatDate(eventDetails.startDate)} –{" "}
                  {formatDate(eventDetails.endDate)}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {eventDetails.startTime} – {eventDetails.endTime}
                </p>
              </div>
            </div>

            {eventDetails.eventType === "virtual" ? (
              <div className="flex gap-4 items-start text-zinc-800 dark:text-zinc-200 mb-6">
                <IoVideocamOutline size={24} className="mt-1" />
                <a
                  href={eventDetails.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 underline py-1 w-full border-b border-zinc-300 dark:border-zinc-600"
                >
                  Join Meeting
                </a>
              </div>
            ) : (
              <div className="flex gap-4 items-start text-zinc-800 dark:text-zinc-200 mb-6">
                <IoLocationOutline size={24} className="mt-1" />
                <p className="py-1 w-full border-b border-zinc-300 dark:border-zinc-600 text-sm">
                  {eventDetails?.location?.join(", ") ||
                    "Location not available"}
                </p>
              </div>
            )}

            <div className="flex gap-4 items-center text-zinc-800 dark:text-zinc-200 mt-4">
              <FaRegUser size={20} />
              <p className="text-sm">
                {eventDetails?.attendees?.length}{" "}
                {eventDetails?.attendees?.length > 1
                  ? "registrations"
                  : "registration"}
              </p>
            </div>
          </div>

          <div className="bg-orange-100/30 dark:bg-zinc-800/50 backdrop-blur-sm border border-orange-300 dark:border-zinc-700 rounded-2xl p-6 shadow-lg flex-1">
            {eventDetails.ticketTypes.length >= 1 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
                    Ticket Information
                  </h2>

                  {eventDetails?.organizer?._id === user._id &&
                    isUpcoming() &&
                    eventDetails.ticketTypes?.map((ticket) => (
                      <button
                        key={ticket._id}
                        onClick={() => openEditTicketModal(ticket)}
                        className="p-2 rounded-xl bg-white/30 dark:bg-zinc-700 hover:bg-orange-200 dark:hover:bg-zinc-600 transition-colors"
                      >
                        <MdOutlineEdit
                          size={20}
                          className="text-orange-600 dark:text-zinc-100"
                        />
                      </button>
                    ))}
                </div>

                <div className="space-y-6">
                  {eventDetails?.ticketTypes?.map((ticket, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-zinc-700/50 backdrop-blur rounded-xl p-4 shadow-sm"
                    >
                      <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                        {ticket?.type
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h3>

                      <div className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                        <div className="flex justify-between">
                          <span>Total Quantity:</span>
                          <span className="font-medium text-right">
                            {ticket?.totalQuantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Quantity:</span>
                          <span className="font-medium text-right">
                            {ticket?.availableQuantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sold Quantity:</span>
                          <span className="font-medium text-right">
                            {ticket?.soldQuantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold text-right text-orange-600 dark:text-orange-400">
                            ${ticket?.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-semibold">
                  No tickets for this event
                </p>
                <button
                  onClick={() => handleNavigate(eventDetails._id)}
                  className="px-5 sm:px-8 py-2 text-sm font-medium bg-orange-400 dark:bg-orange-600 text-white rounded-full hover:bg-orange-500 dark:hover:bg-orange-700 transition"
                >
                  Create ticket
                </button>
              </div>
            )}
          </div>

          {/* <div className="flex-1">
            {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-orange-300 dark:bg-zinc-800 bg-opacity-50 border border-orange-400 dark:border-zinc-700 rounded-lg p-6 mb-6 text-gray-700 dark:text-zinc-300"
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
                      <p className="text-gray-700 dark:text-zinc-400 text-sm">
                        {feedback.email}
                      </p>
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
              <div className="text-center flex flex-col items-center justify-center gap-4 bg-orange-300 dark:bg-zinc-800 bg-opacity-50 border border-orange-400 dark:border-zinc-700 rounded-lg px-6 pt-6 pb-4 text-gray-700 dark:text-zinc-300">
                <MdFeedback size={75} />
                <p>No feedback yet</p>
                <p className="text-sm text-center text-gray-600 dark:text-zinc-400">
                  You do not have any feedback yet for this event
                </p>
              </div>
            )}
          </div> */}
        </div>

        <div className="flex justify-between items-center gap-4 px-4 py-3 rounded-xl bg-orange-100/30 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 border border-orange-300 dark:border-zinc-700 shadow-lg">
          <div className="flex items-center gap-2 overflow-hidden">
            <IoLinkOutline size={20} />
            <p className="text-sm sm:text-base break-words line-clamp-1">
              {CLIENT_URL}
            </p>
          </div>
          <button title="Copy link">
            <CopyToClipboard />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-4 rounded-xl bg-orange-100/30 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 border border-orange-300 dark:border-zinc-700 shadow-lg">
          <div className="flex items-start gap-3">
            <VscBug size={24} />
            <div className="flex flex-col">
              <p className="text-base font-semibold">No collectible found</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                You can attach NFTs & rewards for your guests to claim
              </p>
            </div>
          </div>
          {isUpcoming() && (
            <button className="px-5 sm:px-8 py-2 text-sm font-medium bg-orange-400 dark:bg-orange-600 text-white rounded-full hover:bg-orange-500 dark:hover:bg-orange-700 transition">
              Add collectible
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 px-4 py-4 rounded-xl bg-orange-100/30 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 border border-orange-300 dark:border-zinc-700 shadow-lg">
          <p className="text-xs font-semibold tracking-wide text-orange-600 dark:text-orange-300">
            HOSTED BY
          </p>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white">
              <img
                src={eventDetails?.organizer?.photo?.imageUrl}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium">
              {eventDetails?.organizer?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
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
      {editEventModalOpen && (
        <EditEventModal onClose={closeEditEventModal} event={eventDetails} />
      )}
      {editTicketModalOpen && editingTicket && (
        <EditTicketModal
          onClose={closeEditTicketModal}
          event={eventDetails}
          ticketType={editingTicket}
        />
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
