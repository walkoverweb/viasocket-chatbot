/* eslint-disable */
import { SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";
// import { successToast } from '../../components/customToast'
import {
  $InterfaceReduxType,
  InterFaceDataType,
} from "../../types/interface/InterfaceReduxType.ts";
import actionType from "../../types/utility.ts";

const sampleInterfaceData: any = {
  interfaceContext: {},
  isLoading: false,
  _id: "",
  title: "",
  org_id: "",
  project_id: "",
  created_by: "",
  updated_by: "",
  components: { root: {} },
  coordinates: { root: {} },
  config: {},
  actions: { root: {} },
  frontendActions: { root: {} },
  createdAt: "",
  updatedAt: "",
  threadId: "",
  bridgeName: "root",
};

export const initialState: $InterfaceReduxType = {
  isLoading: false,
  interfaceData: {},
  interfaceContext: {},
  currentSelectedComponent: {},
};

export const reducers: ValidateSliceCaseReducers<
  $InterfaceReduxType,
  SliceCaseReducers<$InterfaceReduxType>
> = {
  // createInterfaceStart(state, action: actionType<InterFaceDataType>) {
  //   state.interfaceData.NEW_INTERFACE = {
  //     ...sampleInterfaceData,
  //     isLoading: true,
  //     title: action?.payload?.title,
  //   };
  // },
  // createInterfaceSuccess(state, action: actionType<InterFaceDataType>) {
  //   state.interfaceData[action?.payload?._id] = {
  //     ...action.payload,
  //     isLoading: false,
  //   };
  //   state.interfaceData[action?.payload?._id].actions = { root: {} };
  //   state.interfaceData[action?.payload?._id].frontendActions = { root: {} };
  //   delete state.interfaceData.NEW_INTERFACE;
  // },
  // createInterfaceError(state) {
  //   delete state.interfaceData.NEW_INTERFACE;
  // },

  // getAllInterfaceStart(state) {
  //   state.isLoading = true;
  // },
  // getAllInterfaceSuccess(state, action: actionType<InterFaceDataType[]>) {
  //   const tempMapping: { [key: string]: any } = {};
  //   for (let i = 0; i < action.payload.length; i++) {
  //     const interfaceObj = action.payload[i];
  //     tempMapping[interfaceObj._id] = {
  //       ...state?.interfaceData[interfaceObj._id],
  //       ...interfaceObj,
  //     };
  //   }
  //   state.interfaceData = { ...state?.interfaceData, ...tempMapping };
  //   state.isLoading = false;
  // },
  // getAllInterfaceError(state) {
  //   state.isLoading = false;
  // },

  // updateInterfaceDetailsStart(state, action: actionType<any>) {
  //   const { interfaceId, ...keyValue } = action.payload;
  //   const keValueEntries = Object.entries(keyValue);
  //   for (const [keyName, value] of keValueEntries) {
  //     if (state.interfaceData[interfaceId]) {
  //       state.interfaceData[interfaceId][keyName] = value;
  //     }
  //   }
  // },
  // updateInterfaceDetailsSuccess(state, action: actionType<any>) {
  //   const { interfaceId, ...keyValue } = action.payload.incomingData;
  //   const keValueEntries = Object.entries(keyValue);
  //   for (const [keyName, _] of keValueEntries) {
  //     state.interfaceData[interfaceId][keyName] =
  //       action.payload?.response?.[keyName];
  //   }
  //   state.interfaceData[interfaceId].isLoading = false;
  // },
  // updateInterfaceDetailsError(state, action: actionType<any>) {
  //   const { interfaceId } = action?.urlData;
  //   state.interfaceData[interfaceId].isLoading = false;
  // },
  // updateInterfaceStart(state, action: actionType<any>) {
  //   const { interfaceId } = action.urlData;
  //   const { response_id, gridId, componentId, ...data } = action.payload;

  //   state.interfaceData[interfaceId].isLoading = true;
  //   if (componentId) {
  //     Object.keys(data)?.forEach((element: string) => {
  //       state.interfaceData[interfaceId][element][gridId] = {
  //         ...state?.interfaceData[interfaceId]?.[element]?.[gridId],
  //         [componentId]: {
  //           ...(state?.interfaceData[interfaceId]?.[element]?.[gridId]?.[
  //             componentId
  //           ] || {}),
  //           ...(data[element] || {}),
  //         },
  //       };
  //     });
  //   } else {
  //     Object.keys(data).forEach((element: string) => {
  //       state.interfaceData[interfaceId][element][gridId] = {
  //         ...state.interfaceData[interfaceId]?.[element]?.[gridId],
  //         ...(data[element] || {}),
  //       };
  //     });
  //   }
  // },
  // updateInterfaceSuccess(state, action: actionType<InterFaceDataType>) {
  //   // const interfaceId =  action.urlData.interfaceId // urldata not found interfaceid on config page
  //   // const elements = ['components', 'coordinates', 'config']
  //   // elements.forEach((element: string) => {
  //   //   state.interfaceData[interfaceId] = {
  //   //     ...state.interfaceData[interfaceId],
  //   //     [element]: { ...state?.interfaceData[interfaceId]?.[element], ...(data[element] || {}) }
  //   //   }
  //   // })
  //   const { interfaceId } = action.urlData;
  //   const data = action.payload;

  //   const elements = ["components", "coordinates"];
  //   elements.forEach((element: string) => {
  //     state.interfaceData[interfaceId][element] = {
  //       ...state?.interfaceData[interfaceId]?.[element],
  //       ...(data?.[element] || {}),
  //     };
  //   });
  //   state.interfaceData[interfaceId].isLoading = false;
  // },
  // updateInterfaceError(state, action: actionType<any>) {
  //   const { interfaceId } = action.urlData;
  //   state.interfaceData[interfaceId].isLoading = false;
  //   delete state.interfaceData.NEW_INTERFACE;
  // },

  // deleteInterfaceStart(state, action: actionType<any>) {},
  // deleteInterfaceSuccess(state, action: actionType<InterFaceDataType>) {
  //   const { acknowledged, deletedCount, interfaceId } = action.payload;
  //   if (acknowledged && deletedCount && interfaceId) {
  //     delete state.interfaceData[interfaceId];
  //   }
  // },
  // deleteInterfaceError(state, action: actionType<any>) {},

  getInterfaceDataByIdStart(state, action: actionType<string>) {
    const { interfaceId } = action?.urlData;
    if (!state.interfaceData?.[interfaceId]) {
      state.interfaceData = {
        [interfaceId]: { ...sampleInterfaceData, isLoading: true },
      };
    } else {
      state.interfaceData[interfaceId].isLoading = true;
    }
  },
  getInterfaceDataByIdSuccess(state, action: actionType<InterFaceDataType>) {
    const { interfaceId } = action?.urlData;
    const tempData = { ...action.payload };

    // if (tempData.actions) {
    //   tempData.actions = tempData.actions.reduce((acc, actionData) => {
    //     if (actionData.gridId && actionData.componentId) {
    //       acc[actionData.gridId] = {
    //         ...acc[actionData.gridId],
    //         [actionData.componentId]: {
    //           actionId: actionData?.actionId,
    //           ...actionData?.actionIdMapping,
    //         },
    //       };
    //     }
    //     return acc;
    //   }, {});
    // }

    state.interfaceData[interfaceId] = { ...tempData, isLoading: false };
  },
  getInterfaceDataByIdError(state, action: actionType<any>) {
    const { interfaceId } = action?.urlData;
    state.interfaceData[interfaceId].isLoading = false;
  },

  // updateInterfaceActionStart(state, action: actionType<any>) {
  //   const { interfaceId } = action.urlData;
  //   state.interfaceData[interfaceId].isLoading = true;
  // },

  // updateInterfaceActionSuccess(state, action: actionType<InterFaceDataType>) {
  //   const { interfaceId } = action.urlData;
  //   const data = action.payload;
  //   if (Array.isArray(state.interfaceData[interfaceId].actions)) {
  //     state.interfaceData[interfaceId].actions = {};
  //   }
  //   state.interfaceData[interfaceId].actions[data.gridId] = {
  //     ...state?.interfaceData[interfaceId].actions[data.gridId],
  //     [data.componentId]: {
  //       ...(data || {}),
  //       ...state?.interfaceData[interfaceId].actions?.[data.gridId]?.[
  //         data.componentId
  //       ],
  //       actionsArr: [...data.actionsArr],
  //       responseArr: [...data.responseArr],
  //       bridge: { ...data.bridge },
  //     },
  //   };
  //   state.interfaceData[interfaceId].isLoading = false;
  // },
  // updateInterfaceActionError(state, action: actionType<InterFaceDataType>) {
  //   const { interfaceId } = action.urlData;
  //   state.interfaceData[interfaceId].isLoading = false;
  // },

  // updateInterfaceFrontendActionStart(state, action: actionType<any>) {
  //   const { interfaceId } = action.urlData;
  //   state.interfaceData[interfaceId].isLoading = true;
  // },
  // updateInterfaceFrontendActionSuccess(
  //   state,
  //   action: actionType<InterFaceDataType>
  // ) {
  //   const { interfaceId } = action.urlData;
  //   const data = action.payload;
  //   state.interfaceData[interfaceId].frontendActions = {
  //     ...state.interfaceData[interfaceId].frontendActions,
  //     ...(data.frontendActions || {}),
  //   };
  //   state.interfaceData[interfaceId].isLoading = false;
  // },

  // updateInterfaceFrontendActionError(
  //   state,
  //   action: actionType<InterFaceDataType>
  // ) {
  //   const { interfaceId } = action.urlData;
  //   state.interfaceData[interfaceId].isLoading = false;
  // },

  updateComponentProps(state, action: actionType<any>) {
    const { interfaceId } = action.urlData;
    const { data, gridId, componentId } = action.payload;
    state.interfaceData[interfaceId].components[gridId][componentId].props = {
      ...state.interfaceData[interfaceId].components[gridId][componentId].props,
      ...data,
    };
  },

  // deleteComponentStart(
  //   state,
  //   action: actionType<{ gridId: string; componentId: string }>
  // ) {
  //   const { interfaceId } = action.urlData;
  //   const { gridId, componentId } = action.payload;

  //   if (!gridId && componentId) {
  //     ["components", "coordinates", "frontendActions"].forEach(
  //       (element: string) => {
  //         if (state.interfaceData?.[interfaceId]?.hasOwnProperty(element)) {
  //           delete state.interfaceData?.[interfaceId]?.[element]?.[componentId];
  //         }
  //       }
  //     );
  //   }
  //   if (gridId && componentId) {
  //     ["components", "coordinates", "frontendActions", "actions"].forEach(
  //       (element: string) => {
  //         if (state.interfaceData?.[interfaceId]?.hasOwnProperty(element)) {
  //           delete state.interfaceData?.[interfaceId]?.[element]?.[gridId]?.[
  //             componentId
  //           ];
  //         }
  //       }
  //     );
  //   } else if (!componentId && gridId) {
  //     ["components", "coordinates", "frontendActions", "actions"].forEach(
  //       (element: string) => {
  //         if (state.interfaceData?.[interfaceId]?.hasOwnProperty(element)) {
  //           delete state.interfaceData?.[interfaceId]?.[element]?.[gridId];
  //         }
  //       }
  //     );
  //   }
  //   state.interfaceData[interfaceId].isLoading = true;
  // },
  // deleteComponentSuccess(state, action: actionType<InterFaceDataType>) {
  //   const { interfaceId } = action.urlData;
  //   const { gridId, componentId, response } = action.payload;

  //   const elements = ["components", "coordinates", "frontendActions"];
  //   elements?.forEach((element: string) => {
  //     state.interfaceData[interfaceId][element] = {
  //       ...state?.interfaceData[interfaceId]?.[element],
  //       ...(response[element] || {}),
  //     };
  //   });
  //   componentId &&
  //     gridId &&
  //     delete state.interfaceData?.[interfaceId]?.actions?.[gridId]?.[
  //       componentId
  //     ];
  //   // successToast('delete successfull')
  //   state.interfaceData[interfaceId].isLoading = false;
  // },
  // deleteComponentError(
  //   state,
  //   action: actionType<{ gridId: string; componentId: string }>
  // ) {},

  toggleNestedGridSliderOpen(state, action) {
    state.nestedGridSliderOpen = action.payload || false;
  },

  setConfigModalState(state, action) {
    state.currentSelectedComponent = {
      ...state.currentSelectedComponent,
      ...action.payload,
    };
  },

  resetConfigModalState(state) {
    state.currentSelectedComponent = {
      componentType: null,
      componentId: null,
      gridId: null,
    };
  },

  setConfigSlider(state, action) {
    state.isConfigSliderOpen = action?.payload?.openSlider || false;
  },

  addInterfaceContext(
    state,
    action: actionType<{
      gridId: string;
      msgId: string;
      componentId: string;
      value: string;
    }>
  ) {
    const { interfaceId } = action.urlData;
    const { msgId = "", gridId } = action.payload;
    const newGridId = msgId?.length > 0 ? `${gridId}_${msgId}` : gridId;

    state.interfaceContext[interfaceId] = {
      ...state.interfaceContext[interfaceId],
      context: {
        ...state.interfaceContext[interfaceId]?.context,
        [newGridId]: {
          ...state.interfaceContext[interfaceId]?.context?.[newGridId],
          [action.payload.componentId]: action.payload.value || "",
        },
      },
    };
  },
  addDefaultContext(state, action: actionType<any>) {
    const { interfaceId } = action.urlData;
    state.interfaceContext[interfaceId] = {
      ...state.interfaceContext[interfaceId],
      interfaceData: {
        ...state.interfaceContext[interfaceId]?.interfaceData,
        ...action?.payload,
      },
    };
  },
  setThreadId(state, action: actionType<any>) {
    const data = action.payload;
    const tempData = {};
    Object.keys(data || {})?.map((element) => {
      tempData[element] = data[element];
    });
    return { ...state, ...tempData };
  },
};
