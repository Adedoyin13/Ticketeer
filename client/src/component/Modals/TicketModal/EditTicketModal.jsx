import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const EditTicketModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 font-inter dark:bg-zinc-900 dark:bg-opacity-70">
      <div className="flex flex-col w-[90%] max-w-[500px] mt-6 mr-4 sm:mr-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 z-10">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition">
            <IoArrowBackOutline
              size={22}
              className="text-gray-700 dark:text-zinc-200"
            />
          </button>
          <p className="text-lg font-semibold text-gray-800 dark:text-zinc-100">
            Edit Ticket
          </p>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-5 pt-4 pb-6 scrollbar-hide">
          <form className="flex flex-col gap-5 text-sm">
            {/* Ticket Type */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="type"
                className="font-medium text-gray-700 dark:text-zinc-200"
              >
                Ticket Type
              </label>
              <input
                id="type"
                name="type"
                type="text"
                placeholder="General Admission"
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="price"
                className="font-medium text-gray-700 dark:text-zinc-200"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="e.g., 20"
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="quantity"
                className="font-medium text-gray-700 dark:text-zinc-200"
              >
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="e.g., 50"
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="description"
                className="font-medium text-gray-700 dark:text-zinc-200"
              >
                Description{" "}
                <span className="text-gray-400 dark:text-zinc-400">
                  (optional)
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Additional info about this ticket"
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 min-h-[100px] max-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </form>
        </div>

        {/* Footer Button */}
        <div className="sticky bottom-0 w-full bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 px-5 py-3">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition">
            Update Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
