import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const PreviewDescription = ({ description, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 font-inter flex items-center justify-center px-4">
        <div
          className="animate-fade-in-up scale-125 animate-duration-300 animate-ease-out
flex flex-col items-center gap-6 px-6 sm:px-10 py-10 rounded-3xl shadow-2xl 
w-full max-w-md bg-white dark:bg-zinc-900 text-center border border-zinc-200 dark:border-zinc-700 relative"
        >
          <div className="flex items-start w-full">
            <button
              onClick={onClose}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded-full transition"
            >
              <IoArrowBackOutline
                size={22}
                className="text-slate-700 dark:text-zinc-100"
              />
            </button>
          </div>
          <section className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default PreviewDescription;
