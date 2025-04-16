import React, { useEffect, useState } from "react";
import eventImage from "./../../assets/event-image.png";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CreateEvent = () => {
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

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Image upload states
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/location/countries`)
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (!eventData.location.country) return;
    axios
      .get(`${SERVER_URL}/location/states/${eventData.location.country}`)
      .then((response) => setStates(response.data))
      .catch((error) => console.error("Error fetching states:", error));
  }, [eventData.location.country]);

  useEffect(() => {
    if (!eventData.location.state) return;
    axios
      .get(
        `${SERVER_URL}/location/cities/${eventData.location.country}/${eventData.location.state}`
      )
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, [eventData.location.state]);

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

      console.log("Updating:", name, value); // Debugging: See what field is updating
      console.log("New Event Data:", newData); // Debugging: Check updated state

      return newData;
    });
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value; // "virtual" or "physical"
    setEventData((prev) => ({
      ...prev,
      eventType: value,
      location:
        value === "physical"
          ? prev.location // Retain existing location if event is physical
          : { address: "", country: "", city: "", venueName: "", state: "" }, // Reset location if event is virtual
    }));
  };

  const onImageSelect = (file) => {
    console.log("Selected image file:", file);
    // you can store it in state or send to backend
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPreviewImage(URL.createObjectURL(file));

      // Call the parent function to pass the selected file
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const handleEditClick = () => {
    document.getElementById("eventImageInput").click();
  };

  const cleanEventData = (data) => {
    return {
      ...data,
      location: data.eventType === "physical"
        ? [data.location.address, data.location.country, data.location.state, data.location.city, data.location.venueName] // Convert object to array
        : [], // Empty array for virtual events
      meetLink: data.eventType === "virtual" ? data.meetLink : undefined, // Remove meetLink for physical events
    };
  };
  
  // const handleSubit = async (e) => {
  //   e.preventDefault();
  
  //   const finalData = cleanEventData(eventData);
  //   console.log("Submitting cleaned data:", finalData); // Debugging
  
  //   try {
  //     const response = await fetch("/api/events", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(finalData),
  //     });
  
  //     const data = await response.json();
  //     console.log("Response:", data);
  
  //     if (!response.ok) {
  //       throw new Error(data.message || "Something went wrong");
  //     }
  
  //     alert("Event created successfully!");
  //   } catch (error) {
  //     console.error("Error submitting form:", error.message);
  //   }
  // };  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    const finalData = cleanEventData(eventData); // Ensure location is an array
    console.log("Submitting cleaned data:", finalData);
  
    setIsSubmitting(true);
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${SERVER_URL}/event/createEvent`,
        finalData, // Use finalData instead of eventData
        {
          withCredentials: true,
        }
      );
  
      const data = response.data;
      console.log("Response:", data);
  
      if (response.status !== 201) {
        throw new Error(data.message || "Something went wrong");
      }
  
      toast.success("Event Created Successfully");
      navigate(`/create-ticket/${data.event._id}`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Internal server error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-orange-100 py-28 font-inter px-10">
      <div className="flex justify-between px-10 gap-8">
        {/* <div className="flex flex-col gap-6 w-1/3 px-8 items-center">
          <div className="relative w-full h-[200px]">
            <input
              id="eventImageInput"
              type="file"
              onChange={handlePhotoChange}
              className="hidden"
              accept="image/*"
            />

            <img
              src={previewImage} // Use a placeholder image if none is selected
              alt="Event image"
              className="w-full h-full border border-orange-400 rounded-lg object-cover"
            />

            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 bg-orange-50 p-2 rounded-lg shadow-lg hover:bg-orange-200 transition"
            >
              <MdOutlineEdit size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-6 py-4 w-full bg-orange-300 shadow-md bg-opacity-50 rounded-xl">
            <p className="font-medium text-sm text-gray-700">Host</p>
            <p className="font-medium">User</p>
          </div>
        </div> */}
        <div className="w-full flex flex-col gap-8 items-center">
          <div className="bg-orange-300 shadow-md bg-opacity-50 rounded-lg w-full">
            <form>
              <div className="w-full flex flex-col gap-4 font-inter p-10">
                <div className="flex gap-4">
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
                    onChange={handleInputChange}
                    value={eventData.title}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="categories" className="font-medium pl-1">
                    Category
                  </label>
                  <select
                    name="categories"
                    id="categories"
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
                    <option value="festival and fairs">
                      Festival and Fairs
                    </option>
                    <option value="fun and hangout">Fun and Hangout</option>
                  </select>
                </div>
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
                      onChange={handleInputChange}
                      value={eventData.startDate}
                    />
                  </div>

                  <div className="flex gap-1 w-full">
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                      required
                      onChange={handleInputChange}
                      value={eventData.startTime}
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
                      onChange={handleInputChange}
                      value={eventData.endDate}
                    />
                  </div>

                  <div className="flex gap-1 w-full">
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 text-gray-400 focus:outline-none focus:border-orange-300"
                      required
                      onChange={handleInputChange}
                      value={eventData.endTime}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-medium pl-1">Event Type</label>
                  <select
                    name="eventType"
                    value={eventData.eventType}
                    onChange={handleEventTypeChange}
                    className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select event type
                    </option>
                    <option value="virtual">Virtual</option>
                    <option value="physical">Physical</option>
                  </select>

                  {eventData.eventType === "virtual" && (
                    <div className="flex flex-col gap-1 pt-4">
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
                          <label
                            htmlFor="venueName"
                            className="font-medium pl-1"
                          >
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
                              <option
                                key={country.isoCode}
                                value={country.isoCode}
                              >
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
                    placeholder="eg: 20 (guest limit should be equal to ticket quantity)"
                    className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    required
                    onChange={handleInputChange}
                    value={eventData.limit}
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-between w-full px-10 pb-5 items-center">
              <div className="flex gap-2 items-center justify-center">
                <p>Create</p>
                <button>
                  <IoIosArrowForward />
                </button>
                <p className="text-gray-500">Buy tickets</p>
              </div>
              <button
                onClick={handleSubmit}
                className="py-3 px-8 bg-slate-500 text-white text-center hover:bg-slate-600 rounded-md text-sm max-w-[200px]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
