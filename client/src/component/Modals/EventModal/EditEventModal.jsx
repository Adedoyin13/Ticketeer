import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { updateEvent } from "../../../redux/reducers/eventSlice";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER_URL = import.meta.env.SERVER_URL

const EditEventModal = ({ onClose, eventId }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: {
      address: "",
      country: "",
      city: "",
      venueName: "",
      state: "",
    },
    eventType: "",
    meetLink: "",
    categories: "",
    limit: "",
  });
  console.log(eventData)

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEventData((prev) => {
      const newData = [
        "address",
        "country",
        "city",
        "venueName",
        "state",
      ].includes(name)
        ? { ...prev, location: { ...prev.location, [name]: value } }
        : { ...prev, [name]: value };

      console.log("Updating:", name, value);
      console.log("New Event Data:", newData);

      return newData;
    });
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value;
    setEventData((prev) => ({
      ...prev,
      eventType: value,
      location:
        value === "physical"
          ? prev.location
          : { address: "", country: "", city: "", venueName: "", state: "" },
    }));
  };

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(updateEvent({eventData, eventId}))
        .unwrap()
        .then(() => {
          toast.success("Profile updated successfully!");
          navigate("/settings");
        })
        .catch((err) => {
          toast.error(err || "Update failed");
        });
    };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col w-[95%] sm:w-[90%] max-w-[500px] mt-5 mr-3 sm:mr-5 rounded-lg shadow-lg bg-orange-300 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex gap-2 px-4 py-3 items-center border-b text-gray-800 border-slate-700 sticky top-0 bg-orange-300 z-10">
          <button
            className="hover:bg-orange-100 cursor-pointer p-3 rounded-lg"
            onClick={onClose}
          >
            <IoArrowBackOutline size={24} />
          </button>
          <div className="flex flex-col text-left">
            <p className="font-semibold text-lg">Update event</p>
            <p className="font-normal text-sm">
              Make your information stand out by keeping it up to date
            </p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 mt-4 scrollbar-hide">
          <form className="flex flex-col gap-4 font-inter">
            {/* Event Title */}
            <div>
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
                onChange={handleInputChange}
                value={eventData.title}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categories" className="font-medium pl-1">
                Category
              </label>
              <select
                id="categories"
                name="categories"
                onChange={handleInputChange}
                value={eventData.categories}
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
              >
                <option value="" disabled>
                  Choose category
                </option>
                <option value="business and networking">
                  Business and Networking
                </option>
                <option value="music and concert">Music and Concert</option>
                <option value="sport and fitness">Sport and Fitness</option>
                <option value="arts and culture">Arts and Culture</option>
                <option value="festival and fairs">Festival and Fairs</option>
                <option value="fun and hangout">Fun and Hangout</option>
              </select>
            </div>

            {/* Date/Time Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date/Time */}
              <div>
                <label htmlFor="startDate" className="font-medium pl-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-600 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={eventData.startDate}
                />
              </div>
              <div>
                <label htmlFor="startTime" className="font-medium pl-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-600 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={eventData.startTime}
                />
              </div>

              {/* End Date/Time */}
              <div>
                <label htmlFor="endDate" className="font-medium pl-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-600 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={eventData.endDate}
                />
              </div>
              <div>
                <label htmlFor="endTime" className="font-medium pl-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-600 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={eventData.endTime}
                />
              </div>
            </div>

            <div>
              <label className="font-medium pl-1">Event Type</label>
              <select
                name="eventType"
                value={eventData.eventType}
                onChange={handleEventTypeChange}
                className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
              >
                <option value="" disabled>
                  Select event type
                </option>
                <option value="virtual">Virtual</option>
                <option value="physical">Physical</option>
              </select>
            </div>

            {eventData.eventType === "virtual" && (
              <div className="flex flex-col gap-1 pt-">
                <label className="font-medium pl-1">Meeting Link</label>
                <input
                  type="url"
                  name="meetLink"
                  value={eventData.meetLink}
                  onChange={handleInputChange}
                  placeholder="Enter the link to your virtual event"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none"
                />
              </div>
            )}

            {eventData.eventType === "physical" && (
              <div className="w-full flex-col flex gap-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="venueName" className="font-medium pl-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      id="venueName"
                      name="venueName"
                      placeholder="venue"
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                      required
                      onChange={handleInputChange}
                      value={eventData.location.venueName}
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="country" className="font-medium pl-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={eventData.location.country}
                      onChange={handleInputChange} // Fixed this to update eventData
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="state" className="font-medium pl-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={eventData.location.state}
                      onChange={handleInputChange} // Fixed this to update eventData
                      disabled={!eventData.location.country} // Disabled if no country is selected
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="city" className="font-medium pl-1">
                      City
                    </label>
                    <select
                      name="city"
                      value={eventData.location.city}
                      onChange={handleInputChange} // Fixed this to update eventData
                      disabled={!eventData.location.state} // Disabled if no state is selected
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="address" className="font-medium pl-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="address"
                    className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    required
                    onChange={handleInputChange}
                    value={eventData.location.address}
                  />
                </div>
              </div>
            )}

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
                onChange={handleInputChange}
                value={eventData.description}
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
                onChange={handleInputChange}
                value={eventData.limit}
              />
            </div>
            {/* </div> */}
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 w-full bg-orange-300 py-2 flex justify-center border-t border-orange-400" onClick={handleSubmit} type="submit">
          <button className="py-2 px-8 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
