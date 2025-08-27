// countriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://adron.microf10.sg-host.com/api/countries';

// Types
interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface Country {
  id: number;
  name: string;
  code2: string;
  code3: string;
}

interface State {
  id: number;
  name: string;
  country_id: number;
}

interface LGA {
  id: number;
  name: string;
  state_id: number;
}

// Async thunks for API calls
export const fetchAllCountries = createAsyncThunk(
  'countries/fetchAllCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch countries',
        errors: error.errors || {},
      });
    }
  }
);

export const fetchCountryStates = createAsyncThunk(
  'countries/fetchCountryStates',
  async (countryName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(countryName)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch states for ${countryName}: ${response.status}`);
      }
      const data = await response.json();
      return { country: countryName, states: data };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || `Failed to fetch states for ${countryName}`,
        errors: error.errors || {},
      });
    }
  }
);

export const fetchStateLGAs = createAsyncThunk(
  'countries/fetchStateLGAs',
  async (
    { countryName, stateName }: { countryName: string; stateName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(countryName.toLowerCase())}/${encodeURIComponent(stateName.toLowerCase())}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch LGAs for ${stateName}: ${response.status}`);
      }
      const data = await response.json(); // This is an array of strings

      // Normalize to match the LGA object structure
      const normalizedLGAs = data
        .filter((lga: string) => typeof lga === 'string' && lga.trim() !== '')
        .map((name: string, index: number) => ({
          id: index,
          name,
          state_id: -1, // or null if you don't have it
        }));

      return { country: countryName, state: stateName, lgas: normalizedLGAs };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || `Failed to fetch LGAs for ${stateName}`,
        errors: error.errors || {},
      });
    }
  }
);


// Initial state
interface CountriesState {
  countries: Country[];
  selectedCountry: string | null;
  countryStates: Record<string, State[]>;
  selectedState: string | null;
  stateLGAs: Record<string, LGA[]>;
  selectedLGA: string | null;
  loading: {
    countries: boolean;
    states: boolean;
    lgas: boolean;
  };
  error: {
    countries: ErrorResponse | null;
    states: ErrorResponse | null;
    lgas: ErrorResponse | null;
  };
}

const initialState: CountriesState = {
  countries: [],
  selectedCountry: null,
  countryStates: {},
  selectedState: null,
  stateLGAs: {},
  selectedLGA: null,
  loading: {
    countries: false,
    states: false,
    lgas: false,
  },
  error: {
    countries: null,
    states: null,
    lgas: null,
  },
};

// Create slice
const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
      state.selectedState = null;
      state.selectedLGA = null;
    },
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
      state.selectedLGA = null;
    },
    setSelectedLGA: (state, action) => {
      state.selectedLGA = action.payload;
    },
    clearSelection: (state) => {
      state.selectedCountry = null;
      state.selectedState = null;
      state.selectedLGA = null;
    },
    clearErrors: (state) => {
      state.error.countries = null;
      state.error.states = null;
      state.error.lgas = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all countries
      .addCase(fetchAllCountries.pending, (state) => {
        state.loading.countries = true;
        state.error.countries = null;
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        state.loading.countries = false;
        state.countries = action.payload;
        state.error.countries = null;
      })
      .addCase(fetchAllCountries.rejected, (state, action) => {
        state.loading.countries = false;
        state.error.countries = action.payload as ErrorResponse;
        state.countries = [];
      })
      
      // Fetch country states
      .addCase(fetchCountryStates.pending, (state) => {
        state.loading.states = true;
        state.error.states = null;
      })
      .addCase(fetchCountryStates.fulfilled, (state, action) => {
        state.loading.states = false;
        const { country, states } = action.payload;
        state.countryStates[country.toLowerCase()] = states;
        state.error.states = null;
      })
      .addCase(fetchCountryStates.rejected, (state, action) => {
        state.loading.states = false;
        state.error.states = action.payload as ErrorResponse;
      })
      
      // Fetch state LGAs
      .addCase(fetchStateLGAs.pending, (state) => {
        state.loading.lgas = true;
        state.error.lgas = null;
      })
      .addCase(fetchStateLGAs.fulfilled, (state, action) => {
        state.loading.lgas = false;
        const { country, state: stateName, lgas } = action.payload;
        const key = `${country.toLowerCase()}_${stateName.toLowerCase()}`;
        state.stateLGAs[key] = lgas;
        state.error.lgas = null;
      })
      .addCase(fetchStateLGAs.rejected, (state, action) => {
        state.loading.lgas = false;
        state.error.lgas = action.payload as ErrorResponse;
      });
  },
});

// Export actions
export const {
  setSelectedCountry,
  setSelectedState,
  setSelectedLGA,
  clearSelection,
  clearErrors,
} = countriesSlice.actions;

// Selectors
export const selectAllCountries = (state: { countries: CountriesState }) => state.countries.countries;
export const selectSelectedCountry = (state: { countries: CountriesState }) => state.countries.selectedCountry;
export const selectSelectedState = (state: { countries: CountriesState }) => state.countries.selectedState;
export const selectSelectedLGA = (state: { countries: CountriesState }) => state.countries.selectedLGA;

export const selectCountryStates = (state: { countries: CountriesState }, countryName: string | null) => {
  if (!countryName) return [];
  return state.countries.countryStates[countryName.toLowerCase()] || [];
};

export const selectStateLGAs = (state: { countries: CountriesState }, countryName: string | null, stateName: string | null) => {
  if (!countryName || !stateName) return [];
  const key = `${countryName.toLowerCase()}_${stateName.toLowerCase()}`;
  return state.countries.stateLGAs[key] || [];
};

export const selectLoadingStates = (state: { countries: CountriesState }) => state.countries.loading;
export const selectErrorStates = (state: { countries: CountriesState }) => state.countries.error;

// Helper selectors
export const selectCountryByCode = (state: { countries: CountriesState }, code: string) => {
  return state.countries.countries.find(
    (country) => country.code2 === code || country.code3 === code
  );
};

export const selectStateByName = (state: { countries: CountriesState }, countryName: string, stateName: string) => {
  const states = selectCountryStates(state, countryName);
  return states.find((stateObj) => stateObj.name.toLowerCase() === stateName.toLowerCase());
};

// Export reducer
export default countriesSlice.reducer;