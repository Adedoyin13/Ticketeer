import React, { useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import img from "./../../../assets/default-img.png";
import axios from "axios";

const feedback = [
  {
    name: "User",
    email: "user@gmail.com",
    comment:
      "The event is a very educative one, kudos to the host. The event is a very educative one, kudos to the host.",
    rating: "",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    comment: "Amazing organization, loved the venue!",
    rating: "",
  },
];

const FeedbackModal = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeedback = feedback.filter(
    ({ name, email, comment }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayment = async() => {
    const response = await axios.post("http://localhost:4000/payment/create-payment-intent", {
      amount: 50, // $50
      userId: "user123",
      eventId: "event456",
    });
    const clientSecret = response.data.clientSecret;
    
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-inter">
      <div className="w-full max-w-2xl mx-4 md:mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col gap-6 relative">

        {/* Search Bar */}
        <div className="w-full">
          <form className="flex items-center bg-zinc-100 px-4 py-2 rounded-xl gap-2">
            <IoIosSearch className="text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Search feedback by name, email, or comment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full outline-none text-sm text-zinc-700"
            />
          </form>
        </div>

        {/* Feedback List */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((entry, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition"
              >
                <div className="min-w-[40px] h-[40px] overflow-hidden rounded-full bg-zinc-200">
                  <img
                    src={img}
                    alt={`${entry.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-zinc-800">{entry.name}</p>
                  <p className="text-sm text-zinc-500">{entry.email}</p>
                  <p className="text-sm text-zinc-700 mt-2 leading-snug">
                    {entry.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
              <FaUserSlash size={60} />
              <p className="font-medium text-lg">No feedback found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;