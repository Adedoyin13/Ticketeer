import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { AiOutlineLink } from "react-icons/ai";

import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { SiTelegram } from "react-icons/si";
import { toast } from "react-toastify";

const EventShareModal = ({ eventId, eventName, onClose }) => {
  const eventURL = encodeURIComponent(
    `https://http://localhost:5173.com/event-details/${eventId}`
  );
  const text = encodeURIComponent(`Check out this event: ${eventName}`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventURL}`,
    x: `https://twitter.com/intent/tweet?url=${eventURL}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${eventURL}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${eventURL}`,
    telegram: `https://t.me/share/url?url=${eventURL}&text=${text}`,
    google: `mailto:?subject=Check%20out%20this%20event!&body=${text}%20${eventURL}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://yourwebsite.com/event/${eventId}`);
    toast.success(
      "Event link copied! You can paste it on Instagram or YouTube."
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-inter text-slate-800 px-10">
      <div className="flex flex-col gap-8 py-4 px-4 sm:px-8 rounded-lg shadow-lg bg-orange-300 text-center w-full max-w-[500px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center py-2 px-2 sm:px-4 gap-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <button>
              <TfiWorld size={32} />
            </button>
            <p className="font-semibold text-2xl">Share Link</p>
          </div>
          <div
            className="hover:bg-orange-100 cursor-pointer p-4 w-14 h-14 rounded-lg items-center flex justify-center"
            onClick={onClose}
          >
            <IoClose size={40} />
          </div>
        </div>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 px-2 sm:px-6">
          {/* Whatsapp */}
          <div className="flex flex-col gap-2 items-center">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500"
            >
              <button className="text-green-700">
                <BsWhatsapp size={40} />
              </button>
            </a>
            <p>Whatsapp</p>
          </div>

          {/* Twitter (X) */}
          <div className="flex flex-col gap-2 items-center">
            <a href={shareLinks.x} target="_blank" rel="noopener noreferrer">
              <button className="">
                <FaXTwitter size={40} />
              </button>
            </a>
            <p>X</p>
          </div>

          {/* Facebook */}
          <div className="flex flex-col gap-2 items-center">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              <button className="text-blue-500 bg-white rounded-full">
                <FaFacebook size={40} />
              </button>
            </a>
            <p>Facebook</p>
          </div>

          {/* Telegram */}
          <div className="flex flex-col gap-2 items-center">
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <button className="text-blue-400 bg-white rounded-full">
                <SiTelegram size={40} />
              </button>
            </a>
            <p>Telegram</p>
          </div>

          {/* LinkedIn */}
          <div className="flex flex-col gap-2 items-center">
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700"
            >
              <FaLinkedin size={40} />
            </a>
            <p>LinkedIn</p>
          </div>

          {/* Google */}
          <div className="flex flex-col gap-2 items-center">
            <a
              href={shareLinks.google}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <FcGoogle size={40} />
            </a>
            <p>Google</p>
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="flex items-center justify-center text-white">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 py-2 px-4 bg-slate-500 hover:bg-slate-600 rounded-md text-sm md:max-w-[200px]"
          >
            <AiOutlineLink size={20} />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventShareModal;
