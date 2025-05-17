import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletAddress: null,
  network: null,
  isConnected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
      state.isConnected = true;
    },
    setNetwork(state, action) {
      state.network = action.payload;
    },
    setConnectionStatus(state, action) {
      state.isConnected = action.payload;
    },
    disconnectWallet(state) {
      state.walletAddress = null;
      state.network = null;
      state.isConnected = false;
    },
  },
});

export const {
  setWalletAddress,
  setNetwork,
  setConnectionStatus,
  disconnectWallet,
} = walletSlice.actions;

export default walletSlice.reducer;