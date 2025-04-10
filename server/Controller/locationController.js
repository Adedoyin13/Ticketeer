const { Country, State, City } = require("country-state-city");

exports.getCountries = (req, res) => {
  try {
    const countries = Country.getAllCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries", error });
  }
};

exports.getStates = (req, res) => {
  try {
    const { countryCode } = req.params;
    const states = State.getStatesOfCountry(countryCode);
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Error fetching states", error });
  }
};

exports.getCities = (req, res) => {
  try {
    const { countryCode, stateCode } = req.params;
    const cities = City.getCitiesOfState(countryCode, stateCode);
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
};
