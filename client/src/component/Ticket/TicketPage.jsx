import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import { getTicket } from "../../redux/reducers/eventSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Spinners/Loader";
import { FaArrowLeft } from "react-icons/fa";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const TicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  console.log({ ticketId });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { ticket, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (!ticketId) {
      toast.error("Ticket ID is missing");
      return;
    }

    if (user) {
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, user, dispatch]);

  if (loading.ticket) {
    return <Loader loading={loading.ticket} />;
  }

  if (error) {
    return toast.error(error);
  }

  const { eventId, computedStatus, ticketTypeId, purchaseDate, qrCode } =
    ticket;

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard");
  };

  return (
    <div className="w-full min-h-screen bg-orange-50 dark:bg-zinc-950 px-4 py-28 font-inter flex items-center justify-center">
      <div className="w-full max-w-md flex gap-4">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="self-start text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors pt-2 pr-4"
        >
          <FaArrowLeft size={20} />
        </button>

        {/* Ticket card */}
        <div className="w-full p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-white text-center">
            🎟️ Your Ticket
          </h2>

          <div className="border border-zinc-200 dark:border-zinc-700 bg-orange-50 dark:bg-zinc-800 rounded-xl p-6 flex flex-col gap-6">
            {/* QR Code */}
            <div className="flex justify-center items-center bg-zinc-100 dark:bg-zinc-700 rounded-xl p-4">
              <QRCode value={qrCode || "unknown"} size={160} />
            </div>

            {/* Ticket Info */}
            <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
              <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
                {eventId?.title || "Event Title"}
              </h3>

              <p>
                <strong>Date:</strong> {formatDate(eventId?.startDate) || "N/A"}{" "}
                at {eventId?.startTime || "N/A"}
              </p>

              <p>
                <strong>Type:</strong> {ticketTypeId?.type || "N/A"}
              </p>

              {eventId?.eventType === "physical" ? (
                <p>
                  <strong>Location:</strong>{" "}
                  {eventId?.location?.join(", ") || "N/A"}
                </p>
              ) : (
                <p>
                  <strong>Meet Link:</strong>{" "}
                  <a
                    href={eventId?.meetLink || "#"}
                    className="text-blue-500 dark:text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join Event
                  </a>
                </p>
              )}

              <p>
                <strong>Status:</strong> {computedStatus || "N/A"}
              </p>

              <p>
                <strong>Purchased on:</strong>{" "}
                {purchaseDate ? new Date(purchaseDate).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
