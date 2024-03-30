import { createSlice } from '@reduxjs/toolkit';
// import { auth } from "../components/Firebase";

const listedDressData = createSlice({
  name: 'ListedDressData',
  initialState: [],
  reducers: {
    setListedDressData: (state, action) => {
       return state = action.payload
    },
  },
});

export const { setListedDressData } = listedDressData.actions;

export default listedDressData.reducer;