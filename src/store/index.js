import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
/* eslint-disable-next-line import/no-cycle */
import rootReducer from "./combineReducer";
import rootSaga from "./rootSaga.ts";
import { getInfoParamtersFromUrl } from "../utils/utilities";

const customMiddleware = () => (next) => (action) => {
  action.urlData = getInfoParamtersFromUrl();
  return next(action);
};
const persistConfig = { key: "root", storage, blackList: ["appInfo"] };
const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [...getDefaultMiddleware(), customMiddleware, sagaMiddleware], // Use 'thunk' directly here
});
sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
