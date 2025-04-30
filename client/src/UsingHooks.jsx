import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import api from "./utils/api";

export default function UsingHooks({ user, event }) {
  const ticket = event?.ticketTypes?.[0];
  if (!ticket) return null;

  const fee = ticket.price * 0.02;
  const total = ticket.price + fee;

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `tx-${Date.now()}`,
    amount: total,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email,
      phone_number: "070********", // optional
      name: user?.name,
    },
    customizations: {
      title: event?.title,
      description: `Payment for ${ticket?.type || event?.description}`,
      logo: event?.image?.imageUrl,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div>
      <button
        className="mt-4 self-start px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
        onClick={() => {
          handleFlutterPayment({
            callback: (response) => {
              api
                .post(
                  "/payments/verify", // updated route
                  {
                    transaction_id: response.transaction_id,
                    ticketId: ticket._id,
                  },
                  { withCredentials: true }
                )
                .then(() => {
                  alert("Ticket purchased successfully!");
                  closePaymentModal(); // close after success
                })
                .catch(() => {
                  alert("Payment verification failed.");
                  closePaymentModal();
                });
            },
            onClose: () => {
              console.log("Flutterwave modal closed.");
            },
          });
        }}
      >
        Pay ₦{total.toFixed(2)}
      </button>
    </div>
  );
}
