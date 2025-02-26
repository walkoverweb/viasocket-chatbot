import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers } from "./helloReducer.ts";

const interfaceSlice = createSlice({
  name: "Hello",
  initialState,
  reducers,
});

export const {
  setChannel,
  getHelloDetailsStart,
  getHelloDetailsSuccess,
  setHuman,
  setIsVision,
} = interfaceSlice.actions;
export default interfaceSlice.reducer;
