// todoSlice.js
import { createSlice } from '@reduxjs/toolkit';
// import { auth } from "../components/Firebase";

const activeUser = createSlice({
  name: 'currentuser',
  initialState: {},
  reducers: {
    setUserDetails: (state, action) => {
       return state = action.payload
    },
  },
});

export const { setUserDetails } = activeUser.actions;

export default activeUser.reducer;
