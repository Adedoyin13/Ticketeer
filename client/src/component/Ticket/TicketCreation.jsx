import { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const TicketForm = () => {
  const [tickets, setTickets] = useState([
    { type: "", price: "", quantity: "", description: "" },
  ]);

  // Handle changes in input fields
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTickets = [...tickets];
    updatedTickets[index][name] = value;
    setTickets(updatedTickets);
  };

  // Add another ticket type
  const addTicketType = () => {
    setTickets([...tickets, { type: "", price: "", quantity: "", description: "" }]);
  };

  return (
    <form className="w-full flex flex-col gap-6 font-inter py-28">
      {tickets.map((ticket, index) => (
        <div key={index} className="border p-4 rounded-lg bg-gray-50">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor={`type-${index}`} className="font-medium pl-1">
              Ticket type
            </label>
            <input
              type="text"
              id={`type-${index}`}
              name="type"
              placeholder="General admission"
              className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
              required
              onChange={(e) => handleInputChange(index, e)}
              value={ticket.type}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor={`price-${index}`} className="font-medium pl-1">
                Price
              </label>
              <input
                type="number"
                id={`price-${index}`}
                name="price"
                placeholder="eg: 20"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
                onChange={(e) => handleInputChange(index, e)}
                value={ticket.price}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor={`quantity-${index}`} className="font-medium pl-1">
                Quantity
              </label>
              <input
                type="number"
                id={`quantity-${index}`}
                name="quantity"
                placeholder="eg: 50"
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                required
                onChange={(e) => handleInputChange(index, e)}
                value={ticket.quantity}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor={`description-${index}`} className="font-medium pl-1">
              Description (optional)
            </label>
            <textarea
              id={`description-${index}`}
              name="description"
              placeholder="Description"
              className="bg-orange-50 p-2 rounded-lg border-b-2 w-full min-h-[100px] max-h-[150px] border-orange-400 focus:outline-none focus:border-orange-300"
              onChange={(e) => handleInputChange(index, e)}
              value={ticket.description}
            />
          </div>
        </div>
      ))}

      {/* Add Another Ticket Button */}
      <button
        type="button"
        onClick={addTicketType}
        className="py-2 px-8 bg-slate-500 flex gap-1 items-center text-white hover:bg-slate-600 rounded-md text-sm max-w-[250px]"
      >
        <IoIosAdd size={30} />
        <span>Add another ticket</span>
      </button>
    </form>
  );
};

export default TicketForm;
