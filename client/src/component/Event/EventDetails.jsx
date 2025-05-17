import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegEdit, FaRegUser } from "react-icons/fa";
import { IoLinkOutline, IoShareSocialOutline } from "react-icons/io5";
import AttendeeModal from "../Modals/EventModal/AttendeeModal";
import { VscBug } from "react-icons/vsc";
import { MdOutlineCalendarMonth, MdOutlineEdit } from "react-icons/md";
import CopyToClipboard from "../ClipboardCopy/CopyToClipboard";

import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { TbCancel, TbTicket } from "react-icons/tb";
import CancelEvent from "../Modals/EventModal/CancelEvent";
import DeleteEvent from "../Modals/EventModal/DeleteEvent";
import ReactivateModal from "../Modals/EventModal/ReactivateModal";
import EditTicketModal from "../Modals/TicketModal/EditTicketModal";
import AddTicketModal from "../Modals/TicketModal/AddTicketModal";
import TicketInfoModal from "../Modals/TicketModal/TicketInfoModal";

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
  const [ticketModalOpen, setTicketeModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editTicketModalOpen, setEditTicketModalOpen] = useState(false);
  const [addTicketModalOpen, setAddTicketModalOpen] = useState(false);
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

  const openAddTicketModal = (ticket) => {
    setAddTicketModalOpen(true);
  };

  const closeAddTicketModal = () => {
    setAddTicketModalOpen(false);
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketeModalOpen(true);
  };

  const closeTicketModal = () => {
    setSelectedTicket(null);
    setTicketeModalOpen(false);
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
        await dispatch(deleteEvent(eventId)).unwrap();
        toast.success("Event deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error(error || "Failed to delete event");
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

  console.log(eventDetails);

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

      const newImageUrl = response?.image?.imageUrl;

      if (newImageUrl) {
        setProfilePhoto(newImageUrl);
        toast.success("Event image updated successfully!");

        // ✅ Re-fetch updated event details instead of relying on reload
        await dispatch(getEventDetails(eventId));

        // ✅ Optionally still reload if you *need* a fresh page
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
      } else {
        toast.warn("Image uploaded, but URL not returned.");
      }
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
    navigate(`/scan-ticket`, {
      state: { from: location.pathname }, // Save previous route
    });
  };

  if (!eventDetails) return <Loader loading={true} />;

  // const event = eventDetails

  // console.log({event})

  return (
    <section className="bg-orange-50 dark:bg-zinc-900 py-24 md:py-28 font-inter text-gray-800 dark:text-zinc-100">
      {/* // <section className="w-full mt-6 px-4 flex flex-col lg:flex-row items-stretch gap-6"> */}
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
              {showFull ? (
                <section className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </section>
              ) : (
                <section className="prose dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof description === "string"
                          ? description.replace(/<[^>]+>/g, "").slice(0, 120)
                          : "",
                    }}
                  />
                </section>
              )}

              {isLong && (
                <button
                  onClick={toggleShow}
                  className="text-orange-500 underline text-sm mt-1"
                >
                  {showFull ? "See less" : "See more"}
                </button>
              )}

              <p className="mt-1 text-sm font-medium text-primary/80">
                {eventDetails.categories
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 dark:bg-zinc-800 border border-red-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm text-red-800 dark:text-red-300">
              <p className="font-semibold">This event has ended!</p>
              <p className="text-xs mt-1 text-red-700 dark:text-zinc-400">
                Thank you for hosting, we hope it was a success!
              </p>
            </div>
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
          <section className="w-full mt-6 flex flex-col lg:flex-row items-stretch gap-6">
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
                    className="bg-zinc-700 hover:bg-zinc-800 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
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

              {eventDetails?.location && (
                <div className="flex gap-4 items-start text-zinc-800 dark:text-zinc-200 mb-6">
                  <IoLocationOutline size={24} className="mt-1" />
                  <p className="py-1 w-full border-b border-zinc-300 dark:border-zinc-600 text-sm">
                    {eventDetails?.location?.join(", ") ||
                      "Location not available"}
                  </p>
                </div>
              )}

              {eventDetails?.meetLink && (
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
              )}

              {/* <Link to="/scan-ticket"> */}
                <div onClick={handleNavigate} className="flex gap-4 items-start text-zinc-800 dark:text-zinc-200 mb-6 cursor-pointer">
                  <TbTicket size={24} className="mt-1 hover:text-orange-600" />
                  <p className="py-1 w-full border-b border-zinc-300 dark:border-zinc-600 text-sm hover:text-orange-600">
                    Scan Tcket
                  </p>
                </div>
              {/* </Link> */}

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

            <div className="bg-orange-100/30 dark:bg-zinc-800/50 backdrop-blur-sm border border-orange-300 dark:border-zinc-700 rounded-2xl p-6 shadow-lg flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Ticket Types</h3>
                {eventDetails &&
                  eventDetails?.ticketTypes &&
                  eventDetails?.ticketTypes.length < 5 && (
                    <button
                      onClick={openAddTicketModal}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition duration-200 text-sm"
                    >
                      + Add Ticket
                    </button>
                  )}
              </div>

              {eventDetails?.ticketTypes?.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                  {eventDetails.ticketTypes.map((ticket, index) => (
                    <div
                      key={index}
                      onClick={() => openTicketModal(ticket)}
                      className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-orange-50 dark:hover:bg-zinc-700/40 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-md font-medium">{ticket.type}</h4>
                        <FaRegEdit
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering ticket modal
                            openEditTicketModal(ticket);
                          }}
                          className="text-gray-500 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
                          size={16}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price: ${ticket.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {ticket.totalQuantity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No ticket types available yet.
                </p>
              )}

              {/* Optional Edit Ticket Modal */}
              {ticketModalOpen && selectedTicket && (
                <TicketInfoModal
                  ticket={selectedTicket}
                  isOpen={openTicketModal}
                  onClose={closeTicketModal}
                />
              )}
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center gap-4 px-4 py-3 rounded-xl bg-orange-100/30 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 border border-orange-300 dark:border-zinc-700 shadow-lg">
          <div className="flex items-center gap-2 overflow-hidden">
            <IoLinkOutline size={20} />
            <p className="text-sm sm:text-base break-words line-clamp-1">
              {CLIENT_URL}
              {location.pathname}
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
          ticket={eventDetails.ticketTypes}
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
      {addTicketModalOpen && (
        <AddTicketModal
          onClose={closeAddTicketModal}
          isOpen={openAddTicketModal}
          event={eventDetails}
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
