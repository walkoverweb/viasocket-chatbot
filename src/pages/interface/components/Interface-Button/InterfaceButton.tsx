import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { perFormAction } from "../../utils/InterfaceUtils.ts";
import { sendDataToAction } from "../../../../api/InterfaceApis/InterfaceApis.ts";
// import { GridContext } from "../Grid/Grid.tsx";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";

interface InterfaceButtonProps {
  props: ButtonProps | any;
  interfaceId: string;
  gridId: string;
  componentId: string;
  inpreview: boolean;
  action?: any;
}
// const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[^\s/$.?#].[^\s]*$/i

function InterfaceButton({
  props,
  action,
  interfaceId,
}: InterfaceButtonProps): JSX.Element {
  // const payload = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.context?.[gridId])
  // const interfaceContextData = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.interfaceData)
  // const ContextData = useCustomSelector((state: $ReduxCoreType) => state.Interface?.interfaceContext?.[interfaceId]?.context)
  const { slugName, threadId } = useCustomSelector((state: $ReduxCoreType) => ({
    slugName: state.Interface?.bridgeName,
    threadId: state.Interface?.threadId,
  }));

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

  const handleOnClick = async () => {
    // if (!inpreview) return
    // if (actionId) sendDataToAction(actionId, { payload: payload, interfaceContextData: interfaceContextData, threadId: threadId })
    // if (frontEndActions) handleFrontEndActions()
    if (action?.actionId) {
      const data = perFormAction(action);
      // debugger
      await sendDataToAction({
        message: "",
        optionSelected: data,
        userId: null,
        interfaceContextData: {},
        threadId: threadId,
        slugName: slugName,
        chatBotId: interfaceId,
      });
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
