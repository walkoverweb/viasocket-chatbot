/* eslint-disable */
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";
// import { successToast } from '../../components/customToast'
import { $HelloReduxType } from "../../types/hello/HelloReduxType.ts";
import actionType from "../../types/utility.ts";

export const initialState: $HelloReduxType = {
  isHuman: false,
  widgetInfo: {},
  ChannelList: {},
  anonymousClientId: {},
  socketJwt: {},
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
  setChannel(state, action) {
    state.Channel = action.payload.Channel;
  },
};
