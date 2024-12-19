import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers } from "./interfaceReducer.ts";

const interfaceSlice = createSlice({
  name: "Interface",
  initialState,
  reducers,
});

export const {
  toggleNestedGridSliderOpen,
  getAllInterfaceStart,
  getAllInterfaceSuccess,
  getAllInterfaceError,

  createInterfaceStart,
  createInterfaceSuccess,
  createInterfaceError,

  deleteInterfaceStart,
  deleteInterfaceSuccess,
  deleteInterfaceError,

  updateRenderingJson,
  setConfigModalState,
  updateComponentProps,
  deleteComponentStart,
  deleteComponentSuccess,
  deleteComponentError,
  updateInterfaceStart,
  updateInterfaceDetailsSuccess,
  updateInterfaceDetailsError,
  updateInterfaceDetailsStart,
  updateInterfaceSuccess,
  updateInterfaceError,
  getInterfaceDataByIdStart,
  getInterfaceDataByIdSuccess,
  getInterfaceDataByIdError,
  updateInterfaceActionStart,
  updateInterfaceActionSuccess,
  updateInterfaceActionError,
  updateInterfaceFrontendActionStart,
  updateInterfaceFrontendActionSuccess,
  updateInterfaceFrontendActionError,
  setConfigSlider,
  resetConfigModalState,
  addInterfaceContext,
  addDefaultContext,
  setThreadId,
  setThreads,
} = interfaceSlice.actions;
export default interfaceSlice.reducer;
