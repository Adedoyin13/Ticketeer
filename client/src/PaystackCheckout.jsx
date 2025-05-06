import { PaystackButton } from "react-paystack";
import api from "./utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaystackCheckout = ({ event, user }) => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const navigate = useNavigate();

    const ticket = event?.ticketTypes?.[0];
    if (!ticket) return null;
  
    const fee = ticket.price * 0.02;
    const total = ticket.price + fee;

  const handleSuccess = async (reference) => {
    console.log("Payment Success:", reference);

    try {
      const response = await api.post(
        "/payments/paystack/verify",
        {
          reference: reference.reference,
          ticketId: ticket._id,
          eventId: event._id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Payment verified and ticket issued!");
        navigate("/payment-success", {
          state: {
            ticket,
            event,
          },
        });
      } else {
        toast.error("Payment verification failed!");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Server error during verification.");
    }
  };

  const componentProps = {
    email: user.email,
    amount: total * 100, // Paystack uses kobo
    metadata: {
      userId: user._id,
    },
    publicKey,
    text: `Pay ₦${total.toFixed(2)}`,
    onSuccess: handleSuccess,
    onClose: () => toast.error("Payment closed"),
  };

  return (
    <PaystackButton
      {...componentProps}
      className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700"
    />
  );
};

export default PaystackCheckout;
