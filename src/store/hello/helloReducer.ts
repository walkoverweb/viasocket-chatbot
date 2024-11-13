import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";
import { $HelloReduxType } from "../../types/hello/HelloReduxType.ts";

export const initialState: $HelloReduxType = {
  isHuman: false,
  widgetInfo: {},
  ChannelList: {},
  anonymousClientId: {},
  socketJwt: {},
  isLoading: false,
};

export const reducers: ValidateSliceCaseReducers<
  $HelloReduxType,
  SliceCaseReducers<$HelloReduxType>
> = {
  setAllInfo(state, action) {
    state.widgetInfo = action.payload.widgetInfo;
    state.anonymousClientId = action.payload.anonymousClientId;
    state.socketJwt = { jwt: action.payload.Jwt };
    state.ChannelList = action.payload.ChannelList;
    state.isHuman = true;
  },
  getHelloDetailsStart(state) {
    return { ...state, isLoading: true };
  },
  getHelloDetailsSuccess(state, action) {
    const { widgetInfo, ChannelList, Jwt, anonymousClientId } = action.payload;
    state.widgetInfo = widgetInfo;
    state.anonymousClientId = anonymousClientId;
    state.socketJwt = { jwt: Jwt };
    state.ChannelList = ChannelList;
    state.isHuman = true;
    state.isLoading = false;
  },
  setChannel(state, action) {
    state.Channel = action.payload.Channel;
  },
};
