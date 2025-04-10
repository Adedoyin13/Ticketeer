import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { TfiWorld } from "react-icons/tfi";
import { SiTelegram } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLink } from "react-icons/ai";
import { toast } from "react-toastify";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL

const ShareModal = ({ onClose }) => {
  const appURL = encodeURIComponent(CLIENT_URL);
  const text = encodeURIComponent(
    `Join me on Ticketeer - An Amazing event ticketing platform!`
  );

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${appURL}`,
    x: `https://twitter.com/intent/tweet?url=${appURL}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${appURL}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${appURL}`,
    telegram: `https://t.me/share/url?url=${appURL}&text=${text}`,
    google: `mailto:?subject=Join%20this%20amazing%20event%20platform!&body=${text}%20${appURL}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CLIENT_URL);
    toast.success(
      "App link copied! You can paste it on your social media account."
    );
  };

  return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-inter text-slate-800">
        <div className="flex flex-col gap-8 py-4 rounded-lg shadow-lg bg-orange-300 text-center">
          <div className="flex justify-between items-center py-2 px-4 gap-5  border-b border-slate-700">
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
          <div className="grid grid-cols-3 gap-16 px-10">
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

            <div className="flex flex-col gap-2 items-center">
              <a href={shareLinks.x} target="_blank" rel="noopener noreferrer">
                <button className="">
                  <FaXTwitter size={40} />
                </button>
              </a>
              <p>X</p>
            </div>

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

export default ShareModal;
