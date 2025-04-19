import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import StripeCheckout from "react-stripe-checkout";
import Loader from "../../Spinners/Loader";

const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;

const PurchaseTicketModal = ({ onClose, tickets, event, user }) => {
  const [success, setSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tickets || tickets.length === 0) return null;
  const ticket = tickets[0]; // Only one ticket

  const fee = ticket.price * 0.02;
  const total = ticket.price + fee;

  // Stripe Token handler
  const onToken = async (token) => {
    setLoading(true);

    try {
      // In production, you'd send token and ticket info to your backend to process the payment
      console.log("Received Stripe Token:", token);
      console.log("Purchasing Ticket:", ticket);

      // Simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 sm:px-6 md:px-10 animate-fadeIn">
      <div className="relative w-full max-w-[750px] bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-6 sm:p-8 font-inter transition-all flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold">
          {success ? "Purchase Successful" : "Confirm Ticket Purchase"}
        </h2>

        {/* Content */}
        <div className="space-y-4">
          {success ? (
            <div className="flex flex-col items-center gap-3 animate-successFadeInUp">
              <div className="text-green-500 text-4xl animate-pop">🎉</div>
              <p className="text-center text-sm text-green-600 dark:text-green-400">
                Your ticket for <strong>{event}</strong> has been successfully
                purchased!
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm">
                You're about to purchase: <strong>{ticket.type}</strong>
              </p>

              {/* Payment Options and Summary */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Payment Options */}
                <div className="flex-1 bg-orange-100 dark:bg-zinc-800 border border-orange-300 dark:border-zinc-600 p-4 rounded-lg space-y-4">
                  {/* Stripe Option */}
                  <div className="flex items-center gap-2 border-b border-orange-400 pb-4 dark:border-zinc-600">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      className="text-2xl cursor-pointer"
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      checked={selectedPayment === "stripe"}
                    />
                    <label className="text-sm sm:text-base">
                      Pay with Stripe
                    </label>
                  </div>

                  {/* PayPal Option (not functional in this example) */}
                  <div className="flex items-center gap-2 border-b border-orange-400 pb-4 dark:border-zinc-600">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      className="text-2xl cursor-pointer"
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      checked={selectedPayment === "paypal"}
                    />
                    <label className="text-sm sm:text-base">
                      Pay with PayPal
                    </label>
                  </div>

                  {/* Stripe Checkout Button */}
                  {selectedPayment === "stripe" && (
                    <div className="pt-4">
                      <StripeCheckout
                        stripeKey={STRIPE_KEY}
                        token={onToken}
                        name="Event Ticket"
                        amount={Math.round(total * 100)} // amount in cents
                        currency="USD"
                        email={user?.email}
                        panelLabel="Pay {{amount}}"
                      >
                        <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 sm:px-10 rounded-full transition-all duration-300">
                          Pay ${total.toFixed(2)}
                        </button>
                      </StripeCheckout>
                    </div>
                  )}
                </div>

                {/* Ticket Info */}
                <div className="bg-orange-100 dark:bg-zinc-800 border border-orange-300 dark:border-zinc-600 p-4 rounded-lg self-start min-w-[300px] w-full md:w-auto">
                  <p className="font-semibold text-xl text-orange-600 mb-2">
                    Ticket Information
                  </p>

                  <p className="font-medium mt-3">
                    Event: <span className="font-normal">{event}</span>
                  </p>

                  <p className="font-medium mt-2">
                    Ticket: <span className="font-normal">{ticket.type}</span>
                  </p>

                  <div className="text-sm mt-2 flex justify-between">
                    <span>Price:</span>
                    <span className="font-bold text-base">
                      ${ticket.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-sm mt-2 flex justify-between border-b border-orange-400 dark:border-zinc-600 pb-2">
                    <span>Fee (2%):</span>
                    <span className="font-bold text-base">
                      ${fee.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-sm mt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="font-bold text-base">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You can only purchase one ticket for this event.
              </p>
            </>
          )}

          {loading && (
            <div className="mt-4 flex justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketModal;
