import React from "react";
import { FaUserSlash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
// import img from "./../../assets/default-img.png";
import img from "./../../../assets/default-img.png";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";

const attendee = [
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
];

const AttendeeModal = ({ onClose }) => {
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
                <button className="">
                  <IoIosSearch />
                </button>
                <input
                  type="text"
                  className="bg-transparent w-full outline-none"
                  placeholder="Search by guest name or date"
                  name="search"
                />
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[70vh] px-2 scrollbar-hide">
          {Array.isArray(attendee) && attendee.length > 0 ? (
            attendee.map((event, index) => (
              <div
                key={index}
                className="flex gap-2 cursor-pointer hover:bg-orange-50 w-full rounded-lg py-2 px-4 border-gray-400 border"
              >
                <div className="w-[25px] h-[25px] overflow-hidden rounded-full bg-white">
                  <img
                    src={img}
                    alt="User image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p>{event.name}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-4 items-center text-gray-700">
              <FaUserSlash size={75} className="" />
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
