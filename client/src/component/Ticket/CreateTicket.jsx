import React, { useEffect, useState } from "react";
import eventImage from "./../../assets/event-image.png";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import EditEventModal from "../Modals/EventModal/EditEventModal";
import { useSelector } from "react-redux";
import EventDetails from "../Event/EventDetails";
import { IoLocationOutline, IoVideocamOutline } from "react-icons/io5";
import Loader from "../Spinners/Loader";

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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CreateTicket = () => {
  const { eventId } = useParams();
  const [ticketData, setTicketData] = useState({
    type: "",
    price: "",
    totalQuantity: "",
    description: "",
  });
  const [ticket, setTicket] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/event/getEvent/${eventId}`,
          { withCredentials: true }
        );
        console.log(response.data);
        if (!response.data) {
          toast.error("Failed to fetch event data");
          throw new Error("Failed to fetch event data");
        }
        setEvent(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear the error when the user types
  };

  const createTicket = async () => {
    if (event?.ticketTypes.length >= 5) {
      toast.error("You can only add up to 5 ticket types per event.");
      return;
    }

    if (!ticketData.type || !ticketData.price || !ticketData.totalQuantity) {
      console.log("Missing required fields");
      toast.error("Missing required fields");
      return; // Prevent further execution
    }
    try {
      const response = await axios.post(
        `${SERVER_URL}/event/create-ticket/${eventId}`,
        ticketData,
        {
          withCredentials: true,
        }
      );

      console.log(response?.data);
      if (response?.data) {
        setTicket(response?.data);
        toast.success("Event Created Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Internal server error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createTicket();
  };

  // const handleAddAnotherTicket = () => {
  //   // Validate required fields (basic check)
  //   if (!ticketData.type || !ticketData.price || !ticketData.quantity) {
  //     alert("Please fill in ticket type, price, and quantity.");
  //     return;
  //   }

  //   // Add current ticket to the list
  //   setAllTickets((prev) => [...prev, ticketData]);

  //   // Reset the form for the next ticket
  //   setTicketData({
  //     type: "",
  //     price: "",
  //     quantity: "",
  //     description: "",
  //   });
  // };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <section className="bg-orange-50 dark:bg-neutral-900 min-h-screen py-20 px-4 sm:px-8 md:px-12 lg:py-24 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 border-t lg:border-t-0 lg:border-l lg:pl-10 border-orange-100 dark:border-neutral-800 pt-10 lg:pt-0">
        {/* Event Summary Sidebar (Sticky) */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3 lg:sticky top-24 h-fit">
          <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-3xl border border-orange-200 dark:border-neutral-700 p-6">
            <div className="w-full h-[150px] overflow-hidden rounded-xl mb-4">
              <img
                src={event?.image?.imageUrl}
                alt="Event"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p className="font-semibold text-xl text-orange-600 dark:text-orange-400">
                {event?.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {event?.startDate &&
                event?.startTime &&
                event?.endDate &&
                event?.endTime ? (
                  <>
                    {formatDate(event.startDate)}, {formatTime(event.startTime)}
                    <br />– {formatDate(event.endDate)}{" "}
                    {formatTime(event.endTime)}
                  </>
                ) : (
                  <span>Date & time info unavailable</span>
                )}
              </p>
              <p className="text-sm flex flex-col gap-2">
                {event?.meetLink && (
                  <div className="flex gap-2">
                    <IoVideocamOutline size={18} />
                    <a
                      href={event?.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
                <div>
                  {event?.location?.[2] && event?.location?.[1] && (
                    <div className="flex gap-2">
                      <IoLocationOutline size={18} />
                      <p>{`${event.location[2]}, ${event.location[1]}`}</p>
                    </div>
                  )}
                </div>
              </p>
              {/* <section className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: event?.description }} />
              </section> */}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-3xl border border-orange-200 dark:border-neutral-700 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Host</p>
            <p className="font-semibold text-base text-gray-800 dark:text-gray-200">
              {user.name}{" "}
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                (you)
              </span>
            </p>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="flex-1 flex flex-col gap-10">
          <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-3xl border border-orange-200 dark:border-neutral-700 p-8 space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                Tickets and Payments
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-1">
                Set up your event tickets with debit/credit card payment
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ticket type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  placeholder="General admission"
                  className="w-full bg-orange-50 dark:bg-neutral-700 border border-orange-400 dark:border-neutral-600 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                  onChange={handleInputChange}
                  value={ticketData.type}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="e.g. 20"
                    className="w-full bg-orange-50 dark:bg-neutral-700 border border-orange-400 dark:border-neutral-600 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                    onChange={handleInputChange}
                    value={ticketData.price}
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalQuantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="totalQuantity"
                    name="totalQuantity"
                    placeholder="e.g. 50"
                    className="w-full bg-orange-50 dark:bg-neutral-700 border border-orange-400 dark:border-neutral-600 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                    onChange={handleInputChange}
                    value={ticketData.totalQuantity}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  rows="4"
                  className="w-full bg-orange-50 dark:bg-neutral-700 border border-orange-400 dark:border-neutral-600 text-gray-900 dark:text-white rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={handleInputChange}
                  value={ticketData.description}
                />
              </div>

              {/* <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddAnotherTicket}
                  aria-label="Add another ticket"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium px-6 py-3 rounded-full transition duration-200"
                >
                  <IoIosAdd size={20} />
                  Add another ticket
                </button>
              </div> */}
            </form>
          </div>

          {/* {allTickets.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-3xl border border-orange-200 dark:border-neutral-700 p-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Tickets Added:
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {allTickets.map((ticket, index) => (
                  <li key={index}>
                    {ticket.type} — ${ticket.price} — Qty: {ticket.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:gap-0">
            <button
              onClick={handleSubmit}
              aria-label="Create event"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateTicket;
