import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import api from "./utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UsingHooks({ user, event }) {
  const navigate = useNavigate();

  const ticket = event?.ticketTypes?.[0];
  if (!ticket) return null;

  const fee = ticket.price * 0.02;
  const total = ticket.price + fee;

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: total,
    currency: "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: user?.email,
      phone_number: "070********",
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
    <button
      className="mt-4 self-start px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
      onClick={() => {
        handleFlutterPayment({
          callback: async (response) => {
            closePaymentModal();

            try {
              const res = await api.post(
                "/payments/verify",
                {
                  transaction_id: response.transaction_id,
                  ticketId: ticket._id,
                  eventId: event._id,
                },
                { withCredentials: true }
              );

              console.log({ res });
              toast.success("Payment Successful!");
              navigate("/payment-success");
            } catch (error) {
              toast.error(err || "Payment failed!");
              console.log("error");
              navigate("/payment-failed");
            }
          },
          onClose: () => {
          },
        });
      }}
    >
      Pay ₦{total.toFixed(2)}
    </button>
  );
}
