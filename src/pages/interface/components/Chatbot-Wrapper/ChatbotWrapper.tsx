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
      if (interfaceId && interfaceToken && loadInterface) {
        dispatch(getInterfaceDataByIdStart({}));
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === "interfaceData") {
        const receivedData = event?.data?.data;
        console.log(receivedData, "receivedData");
        dispatch(
          setThreadId({
            threadId: receivedData?.threadId,
            bridgeName: receivedData?.bridgeName || "root",
          })
        );
        dispatch(addDefaultContext({ ...receivedData?.variables }));
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
