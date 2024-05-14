// @author-ArthrajRathore, updated by @idrisbohra
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, IconButton, Tooltip } from "@mui/material";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/text";
import "ace-builds/src-noconflict/theme-iplastic";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
import AceEditor from "react-ace";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import "./templateCode.scss";

export function TemplateCode() {
  const [tipForCopy, setTipForCopy] = useState(false);
  let hrefLinkForSDK;

  if (process.env.REACT_APP_API_ENVIRONMENT === "local") {
    hrefLinkForSDK = "https://embed.viasocket.com/local-embedcomponent.js";
  } else if (process.env.REACT_APP_API_ENVIRONMENT === "testing") {
    hrefLinkForSDK = "https://embed.viasocket.com/test-embedcomponent.js";
  } else if (process.env.REACT_APP_API_ENVIRONMENT === "prod") {
    hrefLinkForSDK = "https://embed.viasocket.com/prod-embedcomponent.js";
  }

  const code = `
  <button id="viasocket-embed-open-button" onclick="openViasocket(flowId, serviceData)" >Open Integrations</button>
<!-- you can pass scriptid in openViasocket function parameters -->
<script
  id="viasocket-embed-main-script"
  embedToken="your embed token"
  src="${hrefLinkForSDK}"
></script>
<script>
window.addEventListener('message', (event) => {
  if (event.origin === "${process.env.REACT_APP_FRONTEND_URL}") {
  const receivedData = event.data;
  }
  });
  </script>
    `;

  const handlecopyfunction = () => {
    copy(code);
    setTipForCopy(true);
    setTimeout(() => {
      setTipForCopy(false);
    }, 800);
  };

  return (
    <Box className="flex-start-start template mt-2" id="editor">
      <AceEditor
        readOnly
        setOptions={{ useWorker: false }}
        theme="iplastic"
        name="functionScript"
        value={code}
        mode="html"
        height="280px"
        width="100%"
        showGutter={false}
        showPrintMargin={false}
        wrapEnabled
      />
      <Tooltip
        placement="top"
        className="mt-2 ml-1"
        onClick={handlecopyfunction}
        title={tipForCopy ? "copied" : "copy"}
      >
        <IconButton>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
// Url for interface embed
export function useSdkUrl() {
  switch (process.env.REACT_APP_FRONTEND_URL) {
    case "http://localhost:3000":
      return "https://interface-embed.viasocket.com/interface-local.js";
    case "https://dev-flow.viasocket.com":
      return "https://interface-embed.viasocket.com/interface-dev.js";
    case "https://flow.viasocket.com":
      return "https://interface-embed.viasocket.com/interface-prod.js";
    default:
      return ""; // Default case
  }
}

function InterfaceTemplateCode({ interfaceId }) {
  const { interfaceAccessType } = useCustomSelector((state) => ({
    interfaceAccessType:
      state?.Interface?.interfaceData?.[interfaceId]?.accessType,
  }));
  const [tipForCopy, setTipForCopy] = useState(false);
  const hrefLinkForSDK = useSdkUrl();
  const code = `
    <script
      id="interface-main-script"
      ${
        interfaceAccessType === "Public"
          ? `interface_id="${interfaceId}"`
          : `embedToken="your embed token"`
      }
      src="${hrefLinkForSDK}"
    ></script>`;

  const handlecopyfunction = () => {
    copy(code);
    setTipForCopy(true);
    setTimeout(() => {
      setTipForCopy(false);
    }, 800);
  };

  return (
    <Box className="flex-start-start template mt-2" id="editor">
      <AceEditor
        readOnly
        setOptions={{ useWorker: false }}
        theme="iplastic"
        name="functionScript"
        value={code}
        mode="html"
        height="120px"
        width="100%"
        showGutter={false}
        showPrintMargin={false}
        wrapEnabled
      />
      <Tooltip
        placement="top"
        className="mt-2 ml-1"
        onClick={handlecopyfunction}
        title={tipForCopy ? "copied" : "copy"}
      >
        <IconButton>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(InterfaceTemplateCode), [ParamsEnums?.interfaceId])
);

export function InterfaceEmbedCodeUsage() {
  const [tipForCopy, setTipForCopy] = useState(false);
  const code = `
   <!-- Use this event listner to listen for the event, sent by iframe -->
      window.addEventListener('message', (event) => {
      const receivedData = event.data;
      });

   <!-- Use This method to send data when needed -->
      window.SendDataToInterface({ bridgeName: 'Hello World', threadId: projectId, variables: {}, ...});
  `;

  const handlecopyfunction = () => {
    copy(code);
    setTipForCopy(true);
    setTimeout(() => {
      setTipForCopy(false);
    }, 800);
  };

  return (
    <Box className="flex-start-start template mt-2" id="editor">
      <AceEditor
        readOnly
        setOptions={{ useWorker: false }}
        theme="iplastic"
        name="functionScript"
        value={code}
        mode="html"
        height="180px"
        width="100%"
        showGutter={false}
        showPrintMargin={false}
        wrapEnabled
      />
      <Tooltip
        placement="top"
        className="mt-2 ml-1"
        onClick={handlecopyfunction}
        title={tipForCopy ? "copied" : "copy"}
      >
        <IconButton>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
