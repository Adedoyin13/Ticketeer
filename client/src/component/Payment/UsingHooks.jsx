import React, { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UsingHooks({ user, event, selectedTickets, tickets }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total with 2% fee
  // selectedTickets is an array: [{ ticketTypeId, quantity }]
  const total = selectedTickets.reduce((sum, { ticketTypeId, quantity }) => {
    const ticket = tickets.find((t) => t._id === ticketTypeId);
    if (!ticket) return sum;
    const fee = ticket.price * 0.02;
    return sum + (ticket.price + fee) * quantity;
  }, 0);

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: total,
    currency: "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: user?.email,
      phone_number: "070********", // Replace with user.phone if available
      name: user?.name,
    },
    customizations: {
      title: event?.title,
      description: `Payment for ${event?.title} tickets`,
      logo: event?.image?.imageUrl,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // Validate tickets first with array format
      const validationRes = await api.post(
        "/payments/validate",
        {
          selectedTickets,
          eventId: event._id,
        },
        { withCredentials: true }
      );

      console.log({validationRes})

      if (!validationRes.data.success) {
        toast.error(validationRes.data.message || "Ticket validation failed.");
        setIsLoading(false);
        return;
      }

      // Start Flutterwave payment
      handleFlutterPayment({
        callback: async (response) => {
          closePaymentModal();
          console.log("Flutterwave Response:", response); // ADD THIS        

          try {
            // Verify payment with array format
            const res = await api.post(
              "/payments/flutterwave/verify",
              {
                transaction_id: response.transaction_id,
                eventId: event._id,
                selectedTickets,
              },
              { withCredentials: true }
            );

            const tickets = res.data.tickets

            if (res.data.success) {
              toast.success("Payment Successful!");
              navigate("/payment-success", {
                state: { event, selectedTickets, tickets },
              });
            } else {
              toast.error("Payment verification failed.");
              navigate("/payment-failed");
            }
          } catch (error) {
            toast.error("Verification failed!");
            console.error("Payment error:", error);
            navigate("/payment-failed");
          } finally {
            setIsLoading(false);
          }
        },
        onClose: () => toast.error("Payment closed"),
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Validation or payment failed."
      );
    }
  };

  if (!user || !event?._id || total === 0) return null;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`mt-4 self-start px-10 py-3 ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600"
      } text-white font-semibold rounded-full transition`}
    >
      {isLoading ? "Processing..." : `Pay ₦${total.toFixed(2)}`}
    </button>
  );
}
