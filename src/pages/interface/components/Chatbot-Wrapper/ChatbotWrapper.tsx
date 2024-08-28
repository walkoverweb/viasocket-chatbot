import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  addDefaultContext,
  getInterfaceDataByIdStart,
  setThreadId,
} from "../../../../store/interface/interfaceSlice.ts";
import { intefaceGetLocalStorage } from "../../utils/InterfaceUtils.ts";
import InterfaceChatbot from "../Interface-Chatbot/InterfaceChatbot.tsx";

function ChatbotWrapper({ interfaceId, loadInterface = true }) {
  console.log("chatbotwrapper");
  const dispatch = useDispatch();

  useEffect(() => {
    window?.parent?.postMessage({ type: "interfaceLoaded" }, "*");
  }, []);

  useEffect(() => {
    (async () => {
      const interfaceToken = intefaceGetLocalStorage("interfaceToken");
      if (
        interfaceId &&
        interfaceId !== "preview" &&
        interfaceToken &&
        loadInterface
      ) {
        dispatch(getInterfaceDataByIdStart({}));
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === "interfaceData") {
        const receivedData = event?.data?.data;
        if (receivedData) {
          const { threadId = null, bridgeName = null } = receivedData;
          if (threadId) {
            dispatch(setThreadId({ threadId: threadId }));
          }
          if (bridgeName) {
            dispatch(setThreadId({ bridgeName: bridgeName || "root" }));
            dispatch(
              addDefaultContext({
                variables: { ...receivedData?.variables },
                bridgeName: bridgeName,
              })
            );
          } else {
            dispatch(
              addDefaultContext({ variables: { ...receivedData?.variables } })
            );
          }
        }
      }
    };

    if (loadInterface) {
      window.addEventListener("message", handleMessage);
    }
    return () => {
      if (loadInterface) {
        window.removeEventListener("message", handleMessage);
      }
    };
  }, [dispatch, interfaceId, loadInterface]);

  return <InterfaceChatbot />;
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotWrapper), [ParamsEnums.interfaceId])
);
