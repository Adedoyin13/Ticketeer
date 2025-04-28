import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../Spinners/Loader";
import { motion } from "framer-motion";
import ConfettiEffect from "../../Layouts/ConfettiEffect";

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(
          `${SERVER_URL}/payments/confirm-checkout-session?session_id=${sessionId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setSessionData(res.data);
        })
        .catch((err) => {
          console.error("Session fetch error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) return <Loader loading={true} />;

  if (loading) return <Loader loading={true} />;

  return (
    <div className="min-h-screen flex font-inter flex-col items-center justify-center bg-orange-50 bg-opacity-60 dark:bg-zinc-900 text-orange-700 dark:text-zinc-100 px-4 py-12">
      {/* Confetti Effect */}
      {sessionData?.success && <ConfettiEffect />}

      <motion.div
        className="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-8 sm:p-10 max-w-xl w-full text-center transition-all duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {sessionData && sessionData.success ? (
          <>
            <motion.div
              className="text-5xl mb-4"
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: [-200, 20, 0], opacity: [0, 1, 1] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              🎉
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-base sm:text-lg mb-6 text-zinc-600 dark:text-zinc-300">
              Your ticket has been confirmed. We can’t wait to see you at the
              event!
            </p>

            <div className="text-left bg-orange-100 dark:bg-zinc-700 p-4 rounded-xl shadow-sm mb-6">
              <p className="mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {sessionData.session.customer_details.name || "Guest"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Amount Paid:</span> $
                {sessionData.session.amount_total / 100}
              </p>
              <p>
                <span className="font-semibold">Ticket Type:</span>{" "}
                {sessionData.lineItems.data[0].description}
              </p>
            </div>
          </>
        ) : (
          <p className="text-xl text-red-500 font-medium">
            Couldn't load payment information.
          </p>
        )}

        <Link
          to="/my-tickets"
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
        >
          View My Tickets
        </Link>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
