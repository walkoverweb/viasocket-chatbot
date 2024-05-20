import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  addDefaultContext,
  getInterfaceDataByIdStart,
  setThreadId,
} from "../../../../store/interface/interfaceSlice.ts";
import {
  intefaceGetLocalStorage,
  intefaceSetLocalStorage,
} from "../../utils/InterfaceUtils.ts";
import InterfaceChatbot from "../Interface-Chatbot/InterfaceChatbot.tsx";

async function authorizeUser(): Promise<string | null> {
  try {
    const verifiedUserDetails: any = await loginUser({ isAnonymousUser: true });
    intefaceSetLocalStorage("interfaceToken", verifiedUserDetails?.token);
    localStorage.setItem("interfaceUserId", verifiedUserDetails?.userId);
    return verifiedUserDetails?.token;
  } catch (error) {
    console.error("Error during user authorization:", error);
    return null;
  }
}
function ChatbotWrapper({ chatBotId, loadInterface = true }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let interfaceToken = intefaceGetLocalStorage("interfaceToken");
      if (!interfaceToken) {
        interfaceToken = await authorizeUser();
      }
      if (chatBotId && interfaceToken && loadInterface) {
        dispatch(getInterfaceDataByIdStart({}));
      }
    })();

    const handleMessage = (event: MessageEvent) => {
      if (event?.data?.type === "interfaceData") {
        const receivedData = event?.data?.data;
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
  }, [chatBotId]);
  return <InterfaceChatbot />;
}

// export default ChatbotWrapper
export default React.memo(
  addUrlDataHoc(React.memo(ChatbotWrapper), [ParamsEnums?.chatBotId])
);
