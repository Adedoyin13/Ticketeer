import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ loading, text = "Loading..." }) => {
  return (
    loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 z-50 font-inter">
        <div className="flex flex-col items-center gap-4">
          <ClipLoader color="#EA670C" size={60} />
          <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
            {text}
          </p>
        </div>
      </div>
    )
  );
};

export default Loader;
