import { Box } from "@mui/material";
import React, { createContext, useMemo } from "react";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import "./Grid.scss";

const Editabledgrid = React.lazy(() => import("./Editabledgrid.tsx"));
const Viewonlygrid = React.lazy(() => import("./Viewonlygrid.tsx"));
export const GridContext = createContext({});

function Grid({ componentJson, msgId, ...props }) {
  function getValueByPath(path, context) {
    return path.split(".").reduce((acc, part) => acc && acc[part], context);
  }

  function replaceDynamicPaths(obj, context) {
    if (typeof obj === "string") {
      const dynamicPathRegex = /variables\.[a-zA-Z0-9_.]+/g;
      return obj.replace(dynamicPathRegex, (match) =>
        getValueByPath(match, context)
      );
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => replaceDynamicPaths(item, context));
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = replaceDynamicPaths(obj[key], context);
        return acc;
      }, {});
    }

    return obj;
  }

  const resolvedJson = replaceDynamicPaths(componentJson, componentJson);
  // console.log(resolvedJson, 'resolvedJson')

  const gridContextValue = useMemo(() => {
    return { ...resolvedJson, msgId };
  }, [componentJson, msgId, resolvedJson]);
  return (
    <GridContext.Provider value={gridContextValue}>
      <Box className="column h-100 w-100 box-sizing-border-box">
        <React.Suspense fallback={<div>Loading...</div>}>
          {props?.projectId ? (
            <Editabledgrid {...props} />
          ) : (
            <Viewonlygrid {...props} />
          )}
        </React.Suspense>
      </Box>
    </GridContext.Provider>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(Grid), [ParamsEnums?.projectId])
);
