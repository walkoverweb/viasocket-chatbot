import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { getHelloDetailsApi } from "../../api/InterfaceApis/InterfaceApis.ts";
import { errorToast } from "../../components/customToast";
import { getHelloDetailsSuccess } from "./helloSlice.ts";

export function* getHelloDetailsSaga(
  action: PayloadAction<{ threadId: string; slugName: string }>
): SagaIterator {
  try {
    const { threadId, slugName } = action.payload;
    const response: { [key: string]: any } = yield call(getHelloDetailsApi, {
      slugName,
      threadId,
    });
    const helloId = response?.widgetInfo?.helloId;
    const anonymousClientId = response?.ChannelList?.uuid;
    if (helloId && anonymousClientId) {
      localStorage.setItem("HelloAgentAuth", `${helloId}:${anonymousClientId}`);
    }
    yield put(getHelloDetailsSuccess(response));
  } catch (error) {
    errorToast(
      "Error occurred while fetching hello details, please try again later."
    );
  }
}
