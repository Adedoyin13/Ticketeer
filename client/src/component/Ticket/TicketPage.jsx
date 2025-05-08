import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { getTicket } from "../../redux/reducers/eventSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const TicketPage = () => {
  const { ticketId } = useParams();
  console.log({ticketId})
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { ticket } = useSelector((state) => state.events);

  useEffect(() => {
    if (!ticketId) {
      toast.error("Ticket ID is missing");
      return;
    }

    if (user) {
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, user, dispatch]);

  if (!ticket) {
    return (
      <div className="text-center py-10 text-slate-600 dark:text-slate-300">
        Loading ticket details...
      </div>
    );
  }

  const { eventId, ticketTypeId, purchaseDate, status, qrCode } = ticket;

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-orange-50 dark:bg-zinc-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
        🎟️ Your Ticket
      </h2>

      <div className="border border-slate-300 dark:border-zinc-700 rounded-xl p-4 grid gap-6 md:grid-cols-2">
        {/* QR Code */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-4">
          <QRCode value={qrCode || "unknown"} size={160} />
        </div>

        {/* Ticket Info */}
        <div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">
            {eventId?.title || "Event Title"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Date:</span>{" "}
            {eventId?.startDate || "N/A"} at {eventId?.startTime || "N/A"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Type:</span>{" "}
            {ticketTypeId?.name || "N/A"}
          </p>
          {eventId?.eventType === "physical" ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Location:</span>{" "}
              {eventId?.location?.join(", ") || "N/A"}
            </p>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Meet Link:</span>{" "}
              <a
                href={eventId?.meetLink || "#"}
                className="text-blue-500 underline"
                target="_blank"
                rel="noreferrer"
              >
                Join Event
              </a>
            </p>
          )}
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Status:</span> {status || "N/A"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Purchased on:</span>{" "}
            {purchaseDate
              ? new Date(purchaseDate).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TicketPage;