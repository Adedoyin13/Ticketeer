import React, { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";

const AttendeeModal = ({ onClose, attendees }) => {
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

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col gap-2 py-4 px-6 rounded-lg shadow-lg bg-orange-300 w-[90%] max-w-[400px] mt-5 mr-5 self-start max-h-[90vh]">
        <div className="flex gap-2 w-full items-center justify-center sticky top-0 z-10">
          <button className="hover:bg-orange-100 cursor-pointer p-2 rounded-lg">
            <IoArrowBackOutline size={25} onClick={onClose} />
          </button>
          <div className="bg-customGradient p-1 rounded-xl flex items-center w-full mb-5">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4 bg-orange-100 rounded-xl text-slate-500">
              <form className="flex gap-2 w-full">
                <button>
                  <IoIosSearch />
                </button>
                <input
                  type="text"
                  className="bg-transparent w-full outline-none"
                  placeholder="Search by guest name or date"
                  value={searchQuery}
                  onChange={handleSearchChange} // Update search query on input change
                />
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[70vh] px-2 scrollbar-hide">
          {Array.isArray(filteredAttendees) && filteredAttendees.length > 0 ? (
            filteredAttendees.map((attendee, index) => (
              <div
                key={index}
                className="flex items-center gap-4 cursor-pointer hover:bg-orange-50 w-full rounded-lg py-2 px-4 border-gray-400 border"
              >
                <div className="w-[40px] h-[40px] overflow-hidden rounded-full bg-white">
                  <img
                    src={attendee?.photo?.imageUrl}
                    alt="User image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg">{attendee?.name}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-4 items-center text-gray-700">
              <FaUserSlash size={75} />
              <div className="flex flex-col gap-1">
                <p>No attendee yet</p>
                <p>You do not have any attendee yet for this event</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeModal;