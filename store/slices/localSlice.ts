// store/slices/localSlice.ts
import { LocalService, Local, LocationCoordinates } from '@/service/local/localService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


export interface LocalState {
  locals: Local[];
  currentLocation: LocationCoordinates | null;
  selectedLocal: Local | null;
  loading: boolean;
  error: string | null;
  locationPermissionGranted: boolean;
}

const initialState: LocalState = {
  locals: [],
  currentLocation: null,
  selectedLocal: null,
  loading: false,
  error: null,
  locationPermissionGranted: false,
};

// Async thunks
export const getCurrentLocation = createAsyncThunk(
  'local/getCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      const location = await LocalService.getCurrentLocation();
      return location;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchNearbyLocals = createAsyncThunk(
  'local/fetchNearbyLocals',
  async (coordinates: LocationCoordinates, { rejectWithValue }) => {
    try {
      const locals = await LocalService.getLocalsByLocation(
        coordinates.latitude,
        coordinates.longitude
      );
      return locals;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const findNearbyLocals = createAsyncThunk(
  'local/findNearbyLocals',
  async (_, { rejectWithValue }) => {
    try {
      const locals = await LocalService.findNearbyLocals();
      return locals;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setSelectedLocal: (state, action: PayloadAction<Local>) => {
      state.selectedLocal = action.payload;
    },
    clearSelectedLocal: (state) => {
      state.selectedLocal = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLocals: (state) => {
      state.locals = [];
      state.currentLocation = null;
      state.selectedLocal = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentLocation cases
      .addCase(getCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.locationPermissionGranted = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.locationPermissionGranted = false;
      })
      
      // fetchNearbyLocals cases
      .addCase(fetchNearbyLocals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyLocals.fulfilled, (state, action) => {
        state.loading = false;
        state.locals = action.payload;
        state.error = null;
      })
      .addCase(fetchNearbyLocals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // findNearbyLocals cases (combina geolocalización + fetch)
      .addCase(findNearbyLocals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findNearbyLocals.fulfilled, (state, action) => {
        state.loading = false;
        state.locals = action.payload;
        state.error = null;
      })
      .addCase(findNearbyLocals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedLocal,
  clearSelectedLocal,
  clearError,
  resetLocals,
} = localSlice.actions;

export default localSlice.reducer;