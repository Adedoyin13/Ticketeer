import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch countries
export const fetchCountries = createAsyncThunk(
    "location/fetchCountries",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/location/countries");
  
        if (!Array.isArray(response.data)) {
          console.error("Expected an array, but got:", response.data);
          return rejectWithValue("Invalid API response format");
        }
  
        return response.data.reduce((acc, country) => {
          if (!country.isoCode || !country.name) {
            console.warn("Invalid country data:", country); // Log issues
            return acc;
          }
          acc[country.isoCode] = country.name;
          return acc;
        }, {});
      } catch (error) {
        console.error("API Error:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to fetch countries");
      }
    }
  );
  
  

// Fetch states based on selected country
export const fetchStates = createAsyncThunk(
  "location/fetchStates",
  async (countryCode, { rejectWithValue }) => {
    try {
      if (!countryCode) return {}; // Avoid unnecessary API calls
      const response = await api.get(`/location/states/${countryCode}`);
      return response.data.reduce((acc, state) => {
        acc[state.isoCode] = state.name;
        return acc;
      }, {});
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch states");
    }
  }
);

// Fetch cities based on selected state and country
export const fetchCities = createAsyncThunk(
  "location/fetchCities",
  async ({ countryCode, stateCode }, { rejectWithValue }) => {
    try {
      if (!countryCode || !stateCode) return [];
      const response = await api.get(`/location/cities/${countryCode}/${stateCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cities");
    }
  }
);

const initialState = {
  countries: {},
  states: {},
  cities: [],
  loading: {
    countries: false,
    states: false,
    cities: false,
  },
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading.countries = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading.countries = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading.countries = false;
        state.error = action.payload;
      })

      // States
      .addCase(fetchStates.pending, (state) => {
        state.loading.states = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading.states = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error = action.payload;
      })

      // Cities
      .addCase(fetchCities.pending, (state) => {
        state.loading.cities = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading.cities = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading.cities = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;