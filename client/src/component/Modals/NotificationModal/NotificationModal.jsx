import React from "react";
import { IoClose } from "react-icons/io5";
import { MdNotificationsOff } from "react-icons/md";

const notifications = [
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
  //   {
  //     message: "You were assigned a ticket to Web 3 conference",
  //     date: "April 3, 2025",
  //   },
];

const NotificationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-end z-50 font-inter">
    <div className="w-[95%] max-w-[360px] my-6 mr-6 flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Notifications
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
        >
          <IoClose size={22} className="text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>
  
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3 max-h-[70vh]">
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map(({ message, date }, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl cursor-pointer shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
            >
              <div className="flex-1">
                <p className="text-sm text-zinc-800 dark:text-zinc-200">
                  {message}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {date}
                </p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-600 active:bg-orange-100 transition">
                <IoClose size={18} className="text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-zinc-600 dark:text-zinc-400 py-12">
            <MdNotificationsOff
              size={64}
              className="text-zinc-300 dark:text-zinc-600 mb-4"
            />
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
  
      {/* Footer */}
      {Array.isArray(notifications) && notifications.length > 0 && (
        <div className="sticky bottom-0 px-5 py-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 flex justify-center">
          <button className="py-2 px-6 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">
            Clear All
          </button>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default NotificationModal;
