import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Loader from "../../Spinners/Loader";
import UsingHooks from "../../../UsingHooks";
import PaystackCheckout from "../../../PaystackCheckout";

const PurchaseTicketModal = ({ onClose, tickets, event, user }) => {
  console.log({tickets})
  const [success, setSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tickets || tickets.length === 0) return null;
  const ticket = tickets[0];

  const fee = ticket.price * 0.02;
  const total = ticket.price + fee;

  console.log({ticket})
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 sm:px-6 md:px-10 animate-fadeIn">
      <div className="relative w-full max-w-[750px] bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-6 sm:p-8 font-inter transition-all flex flex-col gap-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold">
          {success ? "Purchase Successful" : "Confirm Ticket Purchase"}
        </h2>

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

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-1 bg-orange-100 dark:bg-zinc-800 border border-orange-300 dark:border-zinc-600 p-4 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-orange-400 pb-4 dark:border-zinc-600">
                    <input
                      type="radio"
                      name="payment"
                      value="paystack"
                      className="text-2xl cursor-pointer"
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      checked={selectedPayment === "paystack"}
                    />
                    <label className="text-sm sm:text-base">
                      Pay with Paystack
                    </label>
                  </div>

                  <div className="flex items-center gap-2 border-b border-orange-400 pb-4 dark:border-zinc-600">
                    <input
                      type="radio"
                      name="payment"
                      value="flutterwave"
                      className="text-2xl cursor-pointer"
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      checked={selectedPayment === "flutterwave"}
                    />
                    <label className="text-sm sm:text-base">
                      Pay with Flutterwave
                    </label>
                  </div>

                  {selectedPayment === 'flutterwave' && (
                    <UsingHooks user={user} event={event}/>
                  )}

                  {selectedPayment === "paystack" && (
                    <PaystackCheckout user={user} event={event}/>
                  )}
                </div>

                <div className="bg-orange-100 dark:bg-zinc-800 border border-orange-300 dark:border-zinc-600 p-4 rounded-lg self-start min-w-[300px] w-full md:w-auto">
                  <p className="font-semibold text-xl text-orange-600 mb-2">
                    Ticket Information
                  </p>
                  <p className="font-medium mt-3">
                    Event: <span className="font-normal">{event.title}</span>
                  </p>
                  <p className="font-medium mt-2">
                    Ticket: <span className="font-normal">{ticket.type}</span>
                  </p>
                  <div className="text-sm mt-2 flex justify-between">
                    <span>Price:</span>
                    <span className="font-bold text-base">
                    ₦{ticket.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm mt-2 flex justify-between border-b border-orange-400 dark:border-zinc-600 pb-2">
                    <span>Fee (2%):</span>
                    <span className="font-bold text-base">
                    ₦{fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm mt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="font-bold text-base">
                    ₦{total.toFixed(2)}
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
