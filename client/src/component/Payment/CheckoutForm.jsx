import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      // clientSecret is already provided through <Elements> context
      "",
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful! 🎉");
      // You can redirect, store data, or trigger further logic here
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1e293b", // slate-800
                "::placeholder": {
                  color: "#94a3b8", // slate-400
                },
              },
              invalid: {
                color: "#ef4444", // red-500
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>

      {message && (
        <div className="text-center text-sm mt-2 text-rose-500">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;