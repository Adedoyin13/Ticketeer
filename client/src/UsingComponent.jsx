import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

export default function UsingComponent({ user, event }) {
  console.log({ user });
  console.log({ event });

  const ticket = event?.ticketTypes?.[0];
  if (!ticket) return null;

  const fee = ticket.price * 0.02;
  const total = ticket.price + fee;

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: total,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
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

  const fwConfig = {
    ...config,
    text: `Pay ₦${total}`,
    callback: (response) => {
      console.log(response);
      closePaymentModal();
    },
    onClose: () => {},
  };

  return (
    <div className="App">
      <FlutterWaveButton
        {...fwConfig}
        className="mt-4 self-start px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
      />
    </div>
  );
}
