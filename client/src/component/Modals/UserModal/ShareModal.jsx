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

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 font-inter text-slate-800 dark:text-zinc-100 px-4 sm:px-10">
      <div className="flex flex-col gap-6 py-6 px-6 sm:px-8 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 w-full max-w-[500px] text-center border border-zinc-200 dark:border-zinc-700">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
          <div className="flex items-center gap-3">
            <TfiWorld size={28} className="text-orange-500" />
            <p className="font-semibold text-xl text-slate-700 dark:text-zinc-100">
              Share Link
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Social Icons */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-6 px-2 sm:px-4">
          {[
            {
              icon: <BsWhatsapp size={28} />,
              label: "WhatsApp",
              href: shareLinks.whatsapp,
              color: "text-green-500",
            },
            {
              icon: <FaXTwitter size={28} />,
              label: "X",
              href: shareLinks.x,
              color: "text-black dark:text-white",
            },
            {
              icon: <FaFacebook size={28} />,
              label: "Facebook",
              href: shareLinks.facebook,
              color: "text-blue-600",
            },
            {
              icon: <SiTelegram size={28} />,
              label: "Telegram",
              href: shareLinks.telegram,
              color: "text-blue-500",
            },
            {
              icon: <FaLinkedin size={28} />,
              label: "LinkedIn",
              href: shareLinks.linkedin,
              color: "text-blue-700",
            },
            {
              icon: <FcGoogle size={28} />,
              label: "Google",
              href: shareLinks.google,
              color: "",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition ${item.color}`}
              >
                {item.icon}
              </a>
              <p className="text-sm text-slate-600 dark:text-zinc-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Copy Link */}
        <div className="flex justify-center">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 py-2 px-5 bg-slate-600 hover:bg-slate-700 text-white rounded-md text-sm shadow-sm transition"
          >
            <AiOutlineLink size={18} />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
