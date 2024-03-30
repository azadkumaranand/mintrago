import { createSlice } from '@reduxjs/toolkit';
// import { auth } from "../components/Firebase";

const dressOrderData = createSlice({
  name: 'DressOrderData',
  initialState: [],
  reducers: {
    setDressOrderData: (state, action) => {
       return state = action.payload
    },
  },
});

export const { setDressOrderData } = dressOrderData.actions;

export default dressOrderData.reducer;