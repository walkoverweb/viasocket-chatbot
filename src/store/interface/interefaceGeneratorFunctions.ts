import { call, put } from "redux-saga/effects";
import {
  createInterfaceApi,
  deleteComponentOrGridApi,
  deleteInterfaceApi,
  getAllInterfaceApi,
  getInterfaceByIdApi,
  updateInterfaceActionsApi,
  updateInterfaceApi,
  updateInterfaceDetailsApi,
} from "../../api/InterfaceApis/InterfaceApis.ts";
import { errorToast } from "../../components/customToast";
import { InterFaceDataType } from "../../types/interface/InterfaceReduxType.ts";
import actionType from "../../types/utility.ts";
import {
  createInterfaceError,
  createInterfaceSuccess,
  deleteComponentError,
  deleteComponentSuccess,
  deleteInterfaceError,
  deleteInterfaceSuccess,
  getAllInterfaceError,
  getAllInterfaceSuccess,
  getInterfaceDataByIdError,
  getInterfaceDataByIdSuccess,
  updateInterfaceActionError,
  updateInterfaceActionSuccess,
  updateInterfaceDetailsError,
  updateInterfaceDetailsSuccess,
  updateInterfaceError,
  updateInterfaceFrontendActionError,
  updateInterfaceFrontendActionSuccess,
  updateInterfaceSuccess,
} from "./interfaceSlice.ts";

export function* getAllInterfaceSaga(action: actionType<string>) {
  try {
    const response: { [key: string]: any }[] = yield call(
      getAllInterfaceApi,
      action?.payload
    );
    yield put(getAllInterfaceSuccess(response));
  } catch (error) {
    errorToast("Error Occured while fetching interface try again latter");
    yield put(getAllInterfaceError({}));
  }
}

export function* createInterfaceSaga(action: actionType<InterFaceDataType>) {
  try {
    const response: { [key: string]: any } = yield call(
      createInterfaceApi,
      action?.payload,
      action?.urlData
    );
    yield put(createInterfaceSuccess(response));
    action?.payload?.navigateToInterface(response?._id);
  } catch (error) {
    errorToast("Error Occured while creating interface try again latter");
    yield put(createInterfaceError({}));
  }
}

export function* updateInterfaceSaga(
  action: actionType<InterFaceDataType>
): any {
  try {
    const response: { [key: string]: any }[] = yield call(
      updateInterfaceApi,
      action.payload,
      action?.urlData
    );
    yield put(updateInterfaceSuccess(response));
  } catch (error) {
    yield put(updateInterfaceError({}));
  }
}

export function* updateInterfaceDetailsSaga(
  action: actionType<InterFaceDataType>
): any {
  try {
    const response: { [key: string]: any }[] = yield call(
      updateInterfaceDetailsApi,
      action.payload,
      action?.urlData
    );
    yield put(
      updateInterfaceDetailsSuccess({
        response: response,
        incomingData: action.payload,
      })
    );
  } catch (error) {
    yield put(updateInterfaceDetailsError({}));
  }
}

export function* deleteInterfaceSaga(
  action: actionType<InterFaceDataType>
): any {
  try {
    const response: { [key: string]: any }[] = yield call(
      deleteInterfaceApi,
      action.payload,
      action?.urlData
    );
    yield put(
      deleteInterfaceSuccess({
        interfaceId: action.payload?.interfaceId,
        ...response,
      })
    );
    action?.payload?.navigateToInterface("");
  } catch (error) {
    errorToast("Error Occured while deleting interface try again latter");
    yield put(deleteInterfaceError({}));
  }
}
export function* updateInterfaceActionSaga(
  action: actionType<InterFaceDataType>
): any {
  try {
    const response: { [key: string]: any }[] = yield call(
      updateInterfaceActionsApi,
      action.payload,
      action?.urlData
    );
    yield put(updateInterfaceActionSuccess(response));
  } catch (error) {
    yield put(updateInterfaceActionError({}));
  }
}
export function* updateInterFrontendfaceActionSaga(
  action: actionType<InterFaceDataType>
): any {
  try {
    const response: { [key: string]: any }[] = yield call(
      updateInterfaceActionsApi,
      action.payload,
      action?.urlData
    );
    yield put(updateInterfaceFrontendActionSuccess(response));
  } catch (error) {
    yield put(updateInterfaceFrontendActionError({}));
  }
}

export function* getInterfaceByIdSaga(
  action: actionType<{ gridId: string; componentId: string }>
): any {
  try {
    const { interfaceId } = action.urlData;
    const response: { [key: string]: any }[] = yield call(
      getInterfaceByIdApi,
      interfaceId
    );
    yield put(getInterfaceDataByIdSuccess(response));
  } catch (error) {
    errorToast("Error Occured while fetching interface try again latter");
    yield put(getInterfaceDataByIdError({}));
  }
}

export function* deleteComponentSaga(
  action: actionType<{ gridId: string; componentId: string }>
) {
  try {
    const { interfaceId } = action.urlData;
    const response: { [key: string]: any }[] = yield call(
      deleteComponentOrGridApi,
      interfaceId,
      action?.payload?.gridId,
      action?.payload?.componentId,
      action?.urlData
    );

    yield put(
      deleteComponentSuccess({
        gridId: action?.payload?.gridId,
        componentId: action?.payload?.componentId,
        response,
      })
    );
    // yield put(deleteComponentSuccess(response))
  } catch (error) {
    errorToast("Error Occured while deleting components try again latter");
    yield put(deleteComponentError({}));
  }
}
