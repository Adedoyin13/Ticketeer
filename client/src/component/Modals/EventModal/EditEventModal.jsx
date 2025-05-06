import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventDetails,
  updateEvent,
} from "../../../redux/reducers/eventSlice";
import { IoArrowBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Loader from "../../Spinners/Loader";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventDescriptionEditor from "../../Event/EventDescripionInput";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const EditEventModal = ({ event, onClose }) => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.events.loading);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (event) {
      const [address, country, state, city, venueName] = event.location || [];

      setFormData({
        title: event.title || "",
        description: event.description || "",
        categories: event.categories || "",
        startDate: event.startDate?.split("T")[0] || "",
        startTime: event.startTime || "",
        endDate: event.endDate?.split("T")[0] || "",
        endTime: event.endTime || "",
        eventType: event.eventType || "",
        limit: event.limit || 0,
        meetLink: event.meetLink || null,
        location: {
          address: address || "",
          country: country || "",
          state: state || "",
          city: city || "",
          venueName: venueName || "",
        },
      });

      // Update the selected country, state, and city as well
      setSelectedCountry(country || "");
      setSelectedState(state || "");
      setSelectedCity(city || "");
    }
  }, [event]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        country: selectedCountry,
      },
    }));
  }, [selectedCountry]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        state: selectedState,
      },
    }));
  }, [selectedState]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        city: selectedCity,
      },
    }));
  }, [selectedCity]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/location/countries`);
        setCountries(response.data); // Make sure response.data is the array
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;

      try {
        const response = await axios.get(
          `${SERVER_URL}/location/states/${selectedCountry}`
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState || !selectedCountry) return;

      try {
        const response = await axios.get(
          `${SERVER_URL}/location/cities/${selectedCountry}/${selectedState}`
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [selectedState, selectedCountry]);

  const handleEventTypeChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      eventType: value,
      location:
        value === "virtual"
          ? {
              address: "",
              country: "",
              state: "",
              city: "",
              venueName: "",
            }
          : prev.location,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (["address", "country", "city", "venueName", "state"].includes(name)) {
        return {
          ...prevData,
          location: {
            ...prevData.location,
            [name]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });

    // Update selected values for country, state, and city
    if (name === "country") {
      setSelectedCountry(value);
    } else if (name === "state") {
      setSelectedState(value);
    } else if (name === "city") {
      setSelectedCity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      location:
        formData.eventType === "physical"
          ? [
              formData.location.address,
              formData.location.country,
              formData.location.state,
              formData.location.city,
              formData.location.venueName,
            ]
          : [], // virtual event → no location required
    };

    console.log("Submitting data:", formattedData);

    try {
      await dispatch(
        updateEvent({ eventId: event._id, updatedData: formattedData })
      ).unwrap();

      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Event update failed!");
    } finally {
      await dispatch(getEventDetails(eventId));
      onClose();
    }
  };

  if (!formData.location) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-start z-50 font-inter dark:bg-zinc-900 dark:bg-opacity-70">
      <div className="flex flex-col w-[90%] max-w-[500px] mt-6 mr-4 sm:mr-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 z-10">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition">
            <IoArrowBackOutline
              size={22}
              className="text-gray-700 dark:text-zinc-200"
              onClick={onClose}
            />
          </button>
          <p className="text-lg font-semibold text-gray-800 dark:text-zinc-100">
            Edit Event
          </p>
        </div>
        <div className="overflow-y-auto px-5 pt-4 pb-6 scrollbar-hide">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Category
                </label>
                <select
                  name="categories"
                  onChange={handleChange}
                  value={formData.categories}
                  className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleEventTypeChange}
                  className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                >
                  <option value="" disabled>
                    Select event type
                  </option>
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                </select>
              </div>

              {formData.eventType === "physical" ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Country
                      </label>
                      <select
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        State
                      </label>
                      <select
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        City
                      </label>
                      <select
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                        value={selectedCity}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.isoCode} value={city.isoCode}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        name="venueName"
                        value={formData.location.venueName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <EventDescriptionEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Event Capacity
              </label>
              <input
                type="number"
                name="limit"
                value={formData.limit}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md bg-white dark:bg-zinc-800"
              />
            </div>
          </form>
        </div>
        <div className="sticky bottom-0 w-full bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 px-5 py-3">
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition"
            type="submit"
            disabled={loading.updateEvent}
            onClick={handleSubmit}
          >
            {loading.updateEvent ? (
              <>
                Updating <Loader loading={loading.updateEvent} />
              </>
            ) : (
              "Update Event"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
