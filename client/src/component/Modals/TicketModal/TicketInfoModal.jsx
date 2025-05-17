import React from "react";

const TicketInfoModal = ({ ticket, isOpen, onClose }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4">Ticket Details</h3>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Type:</span> {ticket.type}
          </div>
          <div>
            <span className="font-medium">Price:</span> ₦{ticket.price}
          </div>
          <div>
            <span className="font-medium">Total Quantity:</span> {ticket.totalQuantity}
          </div>
          <div>
            <span className="font-medium">Sold:</span> {ticket.soldQuantity}
          </div>
          <div>
            <span className="font-medium">Available:</span> {ticket.availableQuantity}
          </div>
          <div>
            <span className="font-medium">Descripton:</span> {ticket?.description}
          </div>
          {ticket.description && (
            <div>
              <span className="font-medium">Description:</span>{" "}
              <p className="text-gray-600 dark:text-gray-300 mt-1">{ticket.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketInfoModal;