import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const EditTicketModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col gap-2 py-4 px-2 rounded-lg shadow-lg bg-orange-300 w-[90%] max-w-[500px] mt-5 mr-5 self-start max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex gap-4 px-4 py-2 items-center border-b text-gray-800 border-slate-700 sticky top-0 bg-orange-300 z-10">
          <button className="hover:bg-orange-100 cursor-pointer p-4 w-14 h-14 rounded-lg">
            {/* <IoClose size={25} onClick={onClose} /> */}
            <IoArrowBackOutline size={20} />
          </button>
          <p className="font-medium text-lg">Edit ticket</p>
        </div>

        {/* Scrollable Notifications (without scrollbar) */}
        <div className="flex flex-col gap-2 w-full mt-4 overflow-y-auto max-h-[70vh] px-2 scrollbar-hide">
          <form className="w-full flex flex-col gap-4 font-inter px-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="type" className="font-medium pl-1">
                Ticket type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                placeholder="General Admission"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="price" className="font-medium pl-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="eg: 20"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="quantity" className="font-medium pl-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="eg: 50"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="minPerUser" className="font-medium pl-1">
                Min per user
              </label>
              <input
                type="number"
                id="minPerUser"
                name="minPerUser"
                placeholder="eg: 1"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="maxPerUser" className="font-medium pl-1">
                Max per user
              </label>
              <input
                type="number"
                id="maxPerUser"
                name="maxPerUser"
                placeholder="eg: 5"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="saleStart" className="font-medium pl-1">
                Sale starts
              </label>
              <input
                type="date"
                id="saleStart"
                name="saleStart"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="saleEnd" className="font-medium pl-1">
                Sale ends
              </label>
              <input
                type="date"
                id="saleEnd"
                name="saleEnd"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="description" className="font-medium pl-1">
                Description (optional)
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

export default EditTicketModal;
