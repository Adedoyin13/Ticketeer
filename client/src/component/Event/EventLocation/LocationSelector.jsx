import React, { useState, useEffect } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/location/countries`)
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`${SERVER_URL}/location/states/${selectedCountry}`)
        .then((response) => setStates(response.data))
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      axios
        .get(
          `${SERVER_URL}/location/cities/${selectedCountry}/${selectedState}`
        )
        .then((response) => setCities(response.data))
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedState]);

  return (
    <div>
      <h2>Select Your Location</h2>

      {/* Country Dropdown */}
      <select onChange={(e) => setSelectedCountry(e.target.value)}>
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>

      {/* State Dropdown */}
      <select
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select disabled={!selectedState}>
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;











