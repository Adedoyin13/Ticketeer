import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const SERVER_URL = import.meta.env.VITE_SERVER_URL

const PaymentPage = () => {
  const { eventId } = useParams();
  const [clientSecret, setClientSecret] = useState("");

  const token  = useSelector((state) => state.user);
  console.log(token)


  //   useEffect(() => {
  //     fetch(`${SERVER_URL}/payments/create-payment-intent`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ eventId }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setClientSecret(data.clientSecret))
  //       .catch((err) => console.error("Error:", err));
  //   }, [eventId]);

  useEffect(() => {
    const token = token; // get this from Redux state or wherever you're storing it
    console.log("Token:", token);

    fetch(`${SERVER_URL}/payments/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create Payment Intent");
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error("Payment Intent Error:", err);
      });
  }, 
//   [eventId]
);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
          Complete Your Payment
        </h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        ) : (
          <p className="text-center">Loading payment form...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
