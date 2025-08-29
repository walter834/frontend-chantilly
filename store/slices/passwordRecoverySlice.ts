import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PasswordRecoveryState {
  phone: string;
  code: string;
  isVerified: boolean;
  isInitialized: boolean;
}

const initialState: PasswordRecoveryState = {
  phone: '',
  code: '',
  isVerified: false,
  isInitialized: false,
};

const passwordRecoverySlice = createSlice({
  name: 'passwordRecovery',
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    clearState: (state) => {
      state.phone = '';
      state.code = '';
      state.isVerified = false;
      state.isInitialized = false;
    },
    initializeFromStorage: (state, action: PayloadAction<{ phone?: string; code?: string; isVerified?: boolean }>) => {
      if (action.payload.phone) state.phone = action.payload.phone;
      if (action.payload.code) state.code = action.payload.code;
      if (action.payload.isVerified !== undefined) state.isVerified = action.payload.isVerified;
      state.isInitialized = true;
    },
  },
});

export const {
  setPhone,
  setCode,
  setVerified,
  setInitialized,
  clearState,
  initializeFromStorage,
} = passwordRecoverySlice.actions;

export default passwordRecoverySlice.reducer;
