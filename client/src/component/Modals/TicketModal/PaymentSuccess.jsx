import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ConfettiEffect from "../../Layouts/ConfettiEffect";

const SuccessPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { state } = useLocation();

  const ticket = state?.ticket || {};
  const event = state?.event || {};

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
          You've successfully purchased a ticket to <strong>{event.title}</strong>.
        </p>

        <div className="text-left bg-slate-50 dark:bg-slate-700 p-6 rounded-xl shadow-sm mb-6 space-y-3">
          <p><span className="font-semibold">Event:</span> {event.title}</p>
          <p><span className="font-semibold">Date:</span> {event.startDate} at {event.startTime}</p>
          <p><span className="font-semibold">Type:</span> {event.eventType}</p>
          <p><span className="font-semibold">Ticket Type ID:</span> {ticket._id}</p>
          {/* <p><span className="font-semibold">Ticket Type ID:</span> {event.ticketTypes[0]._id}</p> */}
          <p><span className="font-semibold">Status:</span> {ticket.status}</p>
          {ticket.qrCode && (
            <p><span className="font-semibold">QR Code:</span> {ticket.qrCode}</p>
          )}
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
