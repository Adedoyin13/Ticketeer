import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ConfettiEffect from "../../Layouts/ConfettiEffect";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SuccessPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { state } = useLocation();

  console.log({ state });
  // const tickets = state?.tickets || [];
  const tickets = state?.tickets?.tickets || [];
  const event = state?.event || {};

  console.log({ tickets });

  const totalTicketCount = tickets.reduce(
    (sum, group) => sum + (group.tickets?.length || 0),
    0
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-inter bg-gradient-to-tr from-orange-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      {showConfetti && <ConfettiEffect />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          className="text-green-500 text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          You’ve successfully purchased {totalTicketCount} {""}
          ticket
          {tickets.length > 1 ? "s" : ""} to <strong>{event.title}</strong>.
        </p>

        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-xl shadow-sm mb-6 font-inter space-y-6 text-left">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Event:</span> {event.title}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(event.startDate)} at {event.startTime}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {event.eventType}
            </p>
          </div>

          <div className="border-t pt-4 border-slate-400 gap-4 grid grid-cols-2">
            {tickets.map((ticket, index) => (
              <div key={ticket._id || index} className="gap-2 flex flex-col">
                <p>
                  <span className="font-semibold">Ticket Type:</span>{" "}
                  {ticket?.ticketTypeName}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {ticket?.quantity}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {ticket?.status || "✅ Going"}
                </p>
                {ticket?.qrCode && (
                  <p>
                    <span className="font-semibold">QR Code:</span>{" "}
                    {ticket?.qrCode}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/my-tickets"
          className="inline-block px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition duration-300"
        >
          View My Tickets
        </Link>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
