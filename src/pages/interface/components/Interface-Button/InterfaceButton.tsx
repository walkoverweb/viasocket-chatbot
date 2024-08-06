import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { perFormAction } from "../../utils/InterfaceUtils.ts";
// import { GridContext } from "../Grid/Grid.tsx";

interface InterfaceButtonProps {
  props: ButtonProps | any;
  interfaceId: string;
  gridId: string;
  componentId: string;
  inpreview: boolean;
  action?: any;
}
// const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[^\s/$.?#].[^\s]*$/i

function InterfaceButton({ props, action }: InterfaceButtonProps): JSX.Element {
  delete props?.action;
  // const payload = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.context?.[gridId])
  // const interfaceContextData = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.interfaceData)
  // const ContextData = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.context)
  // const { actionId, frontEndActions, threadId } = useCustomSelector((state: $ReduxCoreType) => ({
  //   actionId: state.Interface?.interfaceData?.[interfaceId]?.actions?.[gridId]?.[componentId]?.actionId,
  //   frontEndActions: state.Interface?.interfaceData?.[interfaceId]?.frontendActions?.[gridId]?.[componentId],
  //   threadId: state.Interface?.threadId
  // }))

  // const handleFrontEndActions = () => {
  // const actions: any = Object.values(frontEndActions || {})
  // actions?.forEach((action: any) => {
  //   if (action?.type === 'sendDataToFrontend') {
  //     Object?.entries(ContextData)?.forEach(([responseKey, responseData]) => {
  //       if (responseKey?.includes(responseJson?.msgId)) {
  //         const data = {
  //           message: responseData,
  //           type: 'ChatbotResponse'
  //         }
  //         window?.parent?.postMessage(data, '*')
  //       }
  //     })
  //   }
  //   if (action?.type === 'navigate') {
  //     let url = action?.url
  //     if (urlPattern.test(url)) {
  //       if (!url.startsWith('http://') && !url.startsWith('https://')) {
  //         url = `https://${url}`
  //       }
  //       if (action?.openInNewTab) {
  //         window.open(url, '_blank')
  //       } else {
  //         window.open(url, '_self')
  //       }
  //     }
  //   }
  //   if (action?.type === 'alert') {
  //     infoToast(action?.message || '')
  //   }
  // })
  // };

  const handleOnClick = () => {
    // if (!inpreview) return
    // if (actionId) sendDataToAction(actionId, { payload: payload, interfaceContextData: interfaceContextData, threadId: threadId })
    // if (frontEndActions) handleFrontEndActions()
    if (action?.actionId) {
      perFormAction(action);
    }
  };

  return (
    <Button
      variant="contained"
      className="w-100 h-100"
      {...props}
      onClick={handleOnClick}
    >
      {props?.label || props?.children || ""}
    </Button>
  );
}
export default React.memo(
  addUrlDataHoc(React.memo(InterfaceButton), [ParamsEnums?.interfaceId])
);
