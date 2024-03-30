import { createSlice } from '@reduxjs/toolkit';

const dateTime = createSlice({
    name: 'dateTime',
    initialState: {},
    reducers: {
      setDateTime: (state, action) => {
        return state = action.payload
      },
    },
  });

  export const { setDateTime } = dateTime.actions;

export default dateTime.reducer;