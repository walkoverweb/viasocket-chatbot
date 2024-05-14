import { combineReducers } from "redux";
import InterfaceReducer from "./interface/interfaceSlice.ts";

const rootReducer = combineReducers({
  Interface: InterfaceReducer,
});

export default rootReducer;
