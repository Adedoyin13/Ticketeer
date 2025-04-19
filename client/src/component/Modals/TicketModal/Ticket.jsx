import React from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Ticket = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-inter text-slate-800 dark:text-zinc-100 px-4 sm:px-10">
      <div className="flex flex-col gap-6 py-6 px-6 sm:px-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 w-full max-w-[500px] text-center border border-zinc-200 dark:border-zinc-700 animate-pop">
        {/* Modal Header */}
        <div className="flex justify-end items-center">
          <button className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition">
            <IoClose size={28} />
          </button>
        </div>

        {/* Glowing Ticket Icon */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-70 animate-pulse-glow z-0"></div>
          <div className="relative w-full h-full rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl shadow-lg animate-bounce-slow z-10">
            ✔️
          </div>
        </div>

        <div className="flex flex-col gap-2 px-2 sm:px-4">
          <p className="font-semibold text-3xl">You're in!</p>
          <p className="text-base">
            Congratulations, you have successfully purchased a ticket to Layer 2
            Solutions! We’ve sent a confirmation to your email.
          </p>
        </div>

        <div className="flex justify-center">
          <Link to='/my-tickets'>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition">
            View My Tickets
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
