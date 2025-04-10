import React from "react";
import { FaUserSlash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

const feedback = [
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host",
    rating: "",
  },
];

const FeedbackModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-inter">
      <div className="flex flex-col items-center gap-6 px-8 py-10 rounded-lg shadow-lg relative w-1/3 bg-orange-300 text-center">
        <div className="bg-customGradient p-1 rounded-xl flex items-center w-full mb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4 bg-orange-100 rounded-xl text-slate-500">
            <form className="flex gap-2 w-full">
              <button className="">
                <IoIosSearch />
              </button>
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                placeholder="Search by event name, location, date, or category"
                name="search"
              />
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
                    {feedback.map((event, index) => (
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
                        <p>{event.organizer}</p>
                      </div>
                    ))}
                  </div>

        {/* <div className="flex flex-col gap-4 items-center text-gray-700">
          <FaUserSlash size={75} className="" />
          <div className="flex flex-col gap-1">
            <p>No attendee yet</p>
            <p>You do not have any attendee yet for this event</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default FeedbackModal;
