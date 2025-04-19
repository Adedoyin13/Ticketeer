import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { toast } from "react-toastify";

const CopyToClipboard = () => {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
        <button onClick={copyLink} className="flex items-center gap-2 py-2 px-4 bg-slate-400 dark:bg-zinc-700 dark:hover:bg-zinc-900 hover:bg-slate-500 rounded-md text-sm md:max-w-[200px]">
        <AiOutlineLink size={20}/>
      Copy Link
    </button>
    </div>
  );
};

export default CopyToClipboard;
