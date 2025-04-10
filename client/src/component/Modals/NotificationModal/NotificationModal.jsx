import React from "react";
import { IoClose } from "react-icons/io5";
import { MdNotificationsOff } from "react-icons/md";

const notifications = [
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
  // {
  //   message: "You were assigned a ticket to Web 3 conference",
  //   date: "April 3, 2025",
  // },
];

const NotificationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col gap-4 py-4 px-5 rounded-lg shadow-lg bg-orange-300 text-center w-[90%] max-w-[350px] mt-5 mr-5 self-start max-h-[80vh]">
        {/* Header - Fixed */}
        <div className="flex justify-between px-4 items-center border-b border-slate-700 sticky top-0 bg-orange-300 z-10">
          <p className="font-semibold text-lg">Notifications</p>
          <button className="hover:bg-orange-100 cursor-pointer p-4 w-14 h-14 rounded-lg">
            <IoClose size={25} onClick={onClose} />
          </button>
        </div>

        {/* Scrollable Notifications (without scrollbar) */}
        <div className="flex flex-col items-center gap-2 w-full overflow-y-auto max-h-[60vh] px-2 scrollbar-hide">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map(({ message, date }, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-orange-50 gap-5 p-4 rounded-md shadow-md w-full"
              >
                <div className="flex flex-col items-start text-left w-full break-words">
                  <p className="text-gray-800 break-words text-sm">{message}</p>
                  <p className="text-gray-500 text-xs">{date}</p>
                </div>
                <button className="hover:bg-orange-100 cursor-pointer p-2 w-10 h-10 rounded-lg">
                  <IoClose size={25} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-4 items-center text-gray-700">
              <MdNotificationsOff size={75} className="" />
              <div className="flex flex-col gap-1">
                <p>No notification yet</p>
                <p>You do not have any notification yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed "Clear All" Button */}
        {Array.isArray(notifications) && notifications.length > 0 ? (
          <div className="sticky bottom-0 flex items-center justify-center bg-orange-300 py-1">
            <button className="flex gap-2 py-2 px-6 bg-slate-500 text-white text-center hover:bg-slate-600 rounded-md text-sm max-w-[150px]">
              Clear all
            </button>
          </div>
        ) : (
          <div className="sticky hidden bottom-0 items-center justify-center bg-orange-300 py-1">
            <button className="flex gap-2 py-2 px-6 bg-slate-500 text-white text-center hover:bg-slate-600 rounded-md text-sm max-w-[150px]">
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
