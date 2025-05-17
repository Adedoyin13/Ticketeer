import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Loader from "../../Spinners/Loader";
import UsingHooks from "../../Payment/UsingHooks";
import PaystackCheckout from "../../Payment/PaystackCheckout";
import api from "../../../utils/api";

const PurchaseTicketModal = ({ onClose, tickets, event, user }) => {
  const [success, setSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState({});

  if (!tickets || tickets.length === 0) return null;

  // Convert selectedTickets object to array of objects [{ticketTypeId, quantity}]
  const selectedTicketsArray = Object.entries(selectedTickets)
    .filter(([_, qty]) => qty > 0)
    .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

  const handleQuantityChange = (ticketId, availableQuantity, value) => {
    const parsed = parseInt(value, 10);
    if (value === "") {
      setSelectedTickets((prev) => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
      return;
    }

    if (!isNaN(parsed)) {
      if (parsed < 1) return;

      if (parsed > availableQuantity) {
        setSelectedTickets((prev) => ({
          ...prev,
          [ticketId]: availableQuantity,
        }));
      } else {
        setSelectedTickets((prev) => ({
          ...prev,
          [ticketId]: parsed,
        }));
      }
    }
  };

  const calculateTotal = () => {
    return selectedTicketsArray.reduce((sum, { ticketTypeId, quantity }) => {
      const ticket = tickets.find((t) => t._id === ticketTypeId);
      if (!ticket) return sum;

      const fee = ticket.price * 0.02;
      return sum + (ticket.price + fee) * quantity;
    }, 0);
  };

  // Instead of selecting one ticket, just pass the full map
  const selectedTicketEntries = selectedTicketsArray.filter(
    ({ quantity }) => quantity > 0
  );

  const validateBeforePayment = async () => {
    try {
      const response = await api.post(
        "/event/validate",
        { eventId: event._id, selectedTickets: selectedTicketsArray },
        { withCredentials: true }
      );

      // If success, proceed to payment
      if (response.status === 200) {
        proceedToPayment(); // your Paystack or Flutterwave trigger
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Validation failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 animate-fadeIn">
      <div className="relative w-full max-w-[500px] max-h-[80vh] overflow-y-auto bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-4 sm:p-6 font-inter transition-all flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-lg font-semibold text-center mb-1">
          {success ? "🎉 Purchase Successful" : "Select Tickets"}
        </h2>

        {success ? (
          <div className="flex flex-col items-center gap-3 animate-successFadeInUp text-sm text-center">
            <p className="text-green-600 dark:text-green-400">
              Your tickets for <strong>{event.title}</strong> have been
              purchased!
            </p>
          </div>
        ) : (
          <>
            {/* Ticket Selection */}
            <div className="flex flex-col gap-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex justify-between items-center text-sm border-b border-zinc-300 dark:border-zinc-700 pb-2"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{ticket.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ₦{(ticket.price * 1.02).toFixed(2)}
                    </p>

                    {ticket.availableQuantity === 0 ? (
                      <span className="inline-block mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                        Sold Out
                      </span>
                    ) : (
                      <p
                        className={`text-xs ${
                          ticket.availableQuantity < 10
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {ticket.availableQuantity} ticket
                        {ticket.availableQuantity > 1 && "s"} left
                      </p>
                    )}
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={ticket.availableQuantity}
                    value={selectedTickets[ticket._id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(
                        ticket._id,
                        ticket.availableQuantity,
                        e.target.value
                      )
                    }
                    disabled={ticket.availableQuantity === 0}
                    className={`w-16 px-2 py-1 border rounded text-right bg-white dark:bg-zinc-800 ${
                      ticket.availableQuantity === 0
                        ? "cursor-not-allowed bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Payment Section */}
            <div className="mt-3">
              <p className="text-sm font-semibold mb-1">Choose Payment Method:</p>
              <div className="flex gap-3 text-xs">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    checked={selectedPayment === "paystack"}
                  />
                  Paystack
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="payment"
                    value="flutterwave"
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    checked={selectedPayment === "flutterwave"}
                  />
                  Flutterwave
                </label>
              </div>
            </div>

            {/* Payment Components */}
            {selectedPayment === "flutterwave" &&
              selectedTicketEntries.length > 0 && (
                <UsingHooks
                  user={user}
                  event={event}
                  selectedTickets={selectedTicketsArray} // updated to array
                  tickets={tickets}
                />
              )}
            {selectedPayment === "paystack" &&
              selectedTicketEntries.length > 0 && (
                <PaystackCheckout
                  user={user}
                  event={event}
                  selectedTickets={selectedTicketsArray} // updated to array
                  tickets={tickets}
                />
              )}

            {/* Summary */}
            <div className="mt-3 text-sm">
              <div className="flex justify-between border-t border-zinc-300 pt-2 mt-2 font-medium">
                <span>Total:</span>
                <span>₦{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Loader */}
            {loading && (
              <div className="mt-4 flex justify-center">
                <Loader />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseTicketModal;