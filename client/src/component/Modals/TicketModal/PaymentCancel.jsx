import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 dark:bg-zinc-900 dark:text-zinc-100 bg-opacity-60 p-6">
      <h1 className="text-3xl font-bold mb-4">❌ Payment Failed</h1>
      <p className="text-lg mb-6">You payment failed. Don’t worry, you can try again!</p>
      <Link to="/event-list" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 sm:px-10 rounded-full transition-all duration-300">
        Back to Home
      </Link>
    </div>
  );
};

export default PaymentCancel;