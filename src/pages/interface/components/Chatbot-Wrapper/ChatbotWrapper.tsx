import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  addDefaultContext,
  getInterfaceDataByIdStart,
  setConfig,
  setThreadId,
} from "../../../../store/interface/interfaceSlice.ts";
import { GetSessionStorageData } from "../../utils/InterfaceUtils.ts";

function ChatbotWrapper({
  interfaceId,
  loadInterface = true,
  threadIdUrl,
  slug,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window?.parent?.postMessage({ type: "interfaceLoaded" }, "*");
  }, []);

  const handleMessage = (event: MessageEvent) => {
    if (event?.data?.type === "interfaceData") {
      const receivedData = event?.data?.data;
      if (receivedData) {
        const {
          threadId = null,
          bridgeName = null,
          vision = null,
          helloId = null,
          version_id = null,
        } = receivedData;
        if (threadId) {
          dispatch(setThreadId({ threadId: threadId }));
        }
        if (helloId) {
          dispatch(setThreadId({ helloId: helloId }));
        }
        if (version_id) {
          dispatch(setThreadId({ version_id: version_id }));
        }
        if (bridgeName) {
          dispatch(setThreadId({ bridgeName: bridgeName || "root" }));
          dispatch(
            addDefaultContext({
              variables: { ...receivedData?.variables },
              bridgeName: bridgeName,
            })
          );
        }
        if (vision) {
          dispatch(setConfig({ vision: vision }));
        } else {
          dispatch(
            addDefaultContext({ variables: { ...receivedData?.variables } })
          );
        }
        if (threadId && bridgeName) {
          navigate(`/i/${interfaceId}/${bridgeName}/${threadId}`);
        } else if (threadId) {
          navigate(`/i/${interfaceId}/${slug}/${threadId}`);
        } else if (bridgeName) {
          navigate(`/i/${interfaceId}/${bridgeName}/${threadIdUrl}`);
        } else {
          navigate(`/i/${interfaceId}/${slug}/${threadIdUrl}`);
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      // const interfaceToken = intefaceGetLocalStorage("interfaceToken");
      const interfaceToken = GetSessionStorageData("interfaceToken");
      if (
        interfaceId &&
        interfaceId !== "preview" &&
        interfaceToken &&
        loadInterface
      ) {
        dispatch(getInterfaceDataByIdStart({}));
      }
    })();

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, interfaceId, slug, threadIdUrl]);

  // return <InterfaceChatbot />;
  return null;
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotWrapper), [
    ParamsEnums.interfaceId,
    ParamsEnums.slug,
    ParamsEnums.threadIdUrl,
  ])
);
