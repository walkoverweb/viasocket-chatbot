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
    const response: { [key: string]: any }[] = yield call(getHelloDetailsApi, {
      slugName,
      threadId,
    });
    yield put(getHelloDetailsSuccess(response));
  } catch (error) {
    errorToast(
      "Error occurred while fetching hello details, please try again later."
    );
  }
}
