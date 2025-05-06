import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getEventDetails,
  updateTicketType,
} from "../../../redux/reducers/eventSlice";
import Loader from "../../Spinners/Loader";
import { toast } from "react-toastify";

const EditTicketModal = ({ onClose, event, ticketType }) => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.events.loading);

  const ticket = ticketType;

  const [ticketData, setTicketData] = useState({
    type: "",
    totalQuantity: "",
    price: "",
    description: "",
  });

  console.log(event);
  console.log(ticketType);

  useEffect(() => {
    if (ticket) {
      setTicketData({
        type: ticket.type || "",
        totalQuantity: ticket.totalQuantity || "",
        price: ticket.price || "",
        description: ticket.description || "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateTicketType({
          ticketId: ticketType._id,
          updatedTicketData: {
            ...ticketData,
            eventId: eventId, // include eventId in the body!
          },
        })
      ).unwrap();

      toast.success("Ticket updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to update ticket");
    } finally {
      await dispatch(getEventDetails(eventId));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 font-inter dark:bg-zinc-900 dark:bg-opacity-70">
      <div className="flex flex-col w-[90%] max-w-[500px] mt-6 mr-4 sm:mr-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 z-10">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition"
            onClick={onClose}
          >
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
          <form className="flex flex-col gap-5 text-sm" onSubmit={handleSubmit}>
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
                onChange={handleChange}
                value={ticketData.type}
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
                onChange={handleChange}
                value={ticketData.price}
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="totalQuantity"
                className="font-medium text-gray-700 dark:text-zinc-200"
              >
                Quantity
              </label>
              <input
                id="totalQuantity"
                name="totalQuantity"
                type="number"
                onChange={handleChange}
                value={ticketData.totalQuantity}
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                onChange={handleChange}
                value={ticketData.description}
                className="bg-gray-50 dark:bg-zinc-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 min-h-[100px] max-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Footer Button */}
            <div className="sticky bottom-0 w-full bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 px-5 py-3">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition"
              >
                {loading.updateTicketType ? (
                  <>
                    Updating...
                    <Loader loading={loading.updateTicketType} />
                  </>
                ) : (
                  "Update Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
