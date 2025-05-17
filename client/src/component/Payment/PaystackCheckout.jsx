import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaystackCheckout = ({ user, event, selectedTickets, tickets }) => {
  const navigate = useNavigate();
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total with 2% fee
  // selectedTickets is now an array: [{ticketTypeId, quantity}]
  const total = selectedTickets.reduce((sum, { ticketTypeId, quantity }) => {
    const ticket = tickets.find((t) => t._id === ticketTypeId);
    if (!ticket) return sum;
    const fee = ticket.price * 0.02;
    return sum + (ticket.price + fee) * quantity;
  }, 0);

  const totalQuantity = selectedTickets.reduce(
    (sum, { quantity }) => sum + quantity,
    0
  );

  const initializePayment = usePaystackPayment({
    email: user.email,
    amount: Math.round(total * 100),
    publicKey,
  });

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // Step 1: Validate ticket selection with array format
      const validationRes = await api.post(
        "/payments/validate",
        {
          selectedTickets,
          eventId: event._id,
        },
        { withCredentials: true }
      );

      if (!validationRes.data.success) {
        toast.error(validationRes.data.message || "Ticket validation failed.");
        setIsLoading(false);
        return;
      }

      // Step 2: Create a unique reference
      const ref = `ticketeer_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Step 3: Initialize payment
      initializePayment({
        reference: ref,
        email: user.email,
        amount: Math.round(total * 100),
        publicKey,
        metadata: {
          userId: user._id,
          totalQuantity,
          selectedTickets,
        },
        onSuccess: async (refData) => {
          try {
            // Step 4: Verify payment on server with array format
            const res = await api.post(
              "/payments/paystack/verify",
              {
                reference: refData.reference,
                selectedTickets,
                eventId: event._id,
              },
              { withCredentials: true }
            );

            console.log({res})

            if (res.data.success) {
              toast.success("Payment verified and ticket(s) issued!");
              navigate("/payment-success", {
                state: { event, selectedTickets, tickets: res?.data?.tickets }, // ✅ safer
              });              
            } else {
              toast.error("Payment verification failed.");
              navigate("/payment-failed");
            }
          } catch (err) {
            toast.error("Verification failed.");
            navigate("/payment-failed");
          }
        },
        onClose: () => toast.error("Payment popup closed"),
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Ticket validation or payment initialization failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !event?._id || total === 0) return null;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`mt-4 self-start px-10 py-3 ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
      } text-white font-semibold rounded-full transition`}
    >
      {isLoading ? "Processing..." : `Pay ₦${total.toFixed(2)}`}
    </button>
  );
};

export default PaystackCheckout;