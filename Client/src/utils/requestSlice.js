import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) =>
      state.filter((request) => request._id !== action.payload),
    clearRequests: () => [],
  },
});

export const { addRequests, removeRequest, clearRequests } =
  requestSlice.actions;
export default requestSlice.reducer;
