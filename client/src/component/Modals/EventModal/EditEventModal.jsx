import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const EditEventModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col gap-2 py-4 px-2 rounded-lg shadow-lg bg-orange-300 w-[90%] max-w-[500px] mt-5 mr-5 self-start max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex gap-4 px-4 py-2 items-center border-b text-gray-800 border-slate-700 sticky top-0 bg-orange-300 z-10">
          <button className="hover:bg-orange-100 cursor-pointer p-4 w-14 h-14 rounded-lg">
            {/* <IoClose size={25} onClick={onClose} /> */}
            <IoArrowBackOutline size={25} />
          </button>
          <div className="flex flex-col gap-0 text-left">
            <p className="font-semibold text-lg">Update event</p>
            <p className="font-normal text-sm">
              Make your informations stand out by keepig it up to date
            </p>
          </div>
        </div>

        {/* Scrollable Notifications (without scrollbar) */}
        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[70vh] px-2 scrollbar-hide">
          <form className="w-full flex flex-col gap-4 font-inter px-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="title" className="font-medium pl-1">
                Event title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="conference"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex gap-2 w-full items-center">
                <div className="flex gap-2">
                  <div className="border-4 border-white p-2 bg-green-400 rounded-full"></div>
                  <label htmlFor="startDate" className="font-medium pl-1">
                    Starts
                  </label>
                </div>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>

              <div className="flex gap-1 w-full">
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex gap-2 w-full items-center">
                <div className="flex gap-2">
                  <div className="border-4 border-white p-2 bg-red-500 rounded-full"></div>
                  <label htmlFor="endDate" className="font-medium pl-1">
                    Ends
                  </label>
                </div>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>

              <div className="flex gap-1 w-full">
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between gap-5">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="location" className="font-medium pl-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Nigeria"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="link" className="font-medium pl-1">
                  Virtual Link (optional)
                </label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  placeholder="Add a virtual link"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="description" className="font-medium pl-1">
                Description
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="description"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full min-h-[100px] max-h-[150px] border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="limit" className="font-medium pl-1">
                Guest Limit
              </label>
              <input
                type="number"
                id="limit"
                name="limit"
                placeholder="eg: 20"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>
          </form>
        </div>

        {/* Fixed "Clear All" Button */}
        <div className="sticky bottom-0 flex items-center justify-center bg-orange-300 py-1">
          <button className="py-3 px-10 bg-slate-500 text-white text-center hover:bg-slate-600 rounded-md text-sm max-w-[250px]">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
