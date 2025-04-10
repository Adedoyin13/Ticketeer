import React from "react";

const CancelEvent = () => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-inter">
      <div className="flex flex-col items-center gap-8 px-8 py-16 rounded-lg shadow-lg relative w-1/3 bg-orange-300 text-center">
       <p className="font-semibold text-xl">Are you sure you want to cancel this event?</p>
       <div className="flex gap-4">
        <button className="bg-slate-500 py-2 px-6 sm:px-10 text-base text-white rounded-md hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[200px]">Yes</button>
        <button className="bg-slate-500 py-2 px-6 sm:px-10 text-base text-white rounded-md hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[200px]">No</button>
       </div>
      </div>
    </div>
  );
};

export default CancelEvent;
