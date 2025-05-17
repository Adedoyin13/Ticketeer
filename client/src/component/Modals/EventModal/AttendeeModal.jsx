import React, { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";

const AttendeeModal = ({ onClose, attendees, ticket }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter attendees based on the search query
  const filteredAttendees = attendees.filter((attendee) => {
    const nameMatch = attendee?.name
      ? attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    return nameMatch;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  console.log({filteredAttendees})
  console.log({ticket})

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col gap-4 py-5 px-6 rounded-xl shadow-xl bg-white dark:bg-zinc-900 w-[90%] max-w-[400px] mt-6 mr-6 self-start max-h-[90vh] border border-zinc-200 dark:border-zinc-700">
        {/* Header with Back Button and Search */}
        <div className="flex flex-col gap-4 sticky top-0 z-10 bg-white dark:bg-zinc-900 pb-2">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
            >
              <IoArrowBackOutline
                size={22}
                className="text-slate-700 dark:text-zinc-100"
              />
            </button>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-zinc-100">
              Attendees
            </h2>
          </div>

          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-2 flex items-center gap-2 focus-within:ring-2 ring-orange-400 transition">
            <IoIosSearch className="text-zinc-500 dark:text-zinc-300" />
            <input
              type="text"
              className="bg-transparent w-full outline-none placeholder-zinc-500 dark:placeholder-zinc-400 text-sm text-zinc-800 dark:text-zinc-100"
              placeholder="Search by name or date"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Attendees List */}
        <div className="flex flex-col gap-3 w-full overflow-y-auto max-h-[65vh] pr-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {Array.isArray(filteredAttendees) && filteredAttendees.length > 0 ? (
            filteredAttendees.map((attendee, index) => (
              <div
                key={index}
                className="flex items-center gap-4 hover:bg-orange-50 dark:hover:bg-zinc-800 w-full rounded-lg py-2 px-3 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
              >
                <div className="w-[40px] h-[40px] overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                  <img
                    src={attendee?.photo?.imageUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {attendee?.name}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-3 items-center text-zinc-600 dark:text-zinc-400 mt-10">
              <FaUserSlash size={70} />
              <div className="text-center text-sm">
                <p className="font-medium">No attendees yet</p>
                <p>You don’t have any attendees for this event.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeModal;
