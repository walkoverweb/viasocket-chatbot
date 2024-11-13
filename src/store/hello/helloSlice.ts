import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers } from "./helloReducer.ts";

const interfaceSlice = createSlice({
  name: "Hello",
  initialState,
  reducers,
});

export const {
  setAllInfo,
  setChannel,
  getHelloDetailsStart,
  getHelloDetailsSuccess,
} = interfaceSlice.actions;
export default interfaceSlice.reducer;
