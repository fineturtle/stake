import { createSlice } from '@reduxjs/toolkit'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
    provider: null
  },
  reducers: {
    
    setWallet: (state, action) => {
      const {address, provider} = action.payload;
      state.address = address;
      state.provider = provider;
    }
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setWallet } = walletSlice.actions

export default walletSlice.reducer