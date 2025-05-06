import React from "react";

const DeleteEvent = ({ onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 font-inter flex items-center justify-center px-4">
      <div
        className="animate-fade-in-up scale-125 animate-duration-300 animate-ease-out
  flex flex-col items-center gap-6 px-6 sm:px-10 py-10 rounded-3xl shadow-2xl 
  w-full max-w-md bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-700 relative"
      >
        <p className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-zinc-100 leading-relaxed">
          Are you sure you want to delete this event?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-10 w-full">
          <button
            onClick={onDelete}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg transition w-full sm:w-1/2"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-100 py-2 px-6 rounded-lg transition w-full sm:w-1/2"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEvent;
