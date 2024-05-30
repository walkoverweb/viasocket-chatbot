import { Box } from "@mui/material";
import React, { useContext } from "react";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import ComponentRenderer from "../ComponentRenderer.tsx";
import { GridContext } from "./Grid.tsx";

function Viewonlygrid({ dragRef, interfaceId, gridId = "root" }) {
  // const { components } = useCustomSelector((state: $ReduxCoreType) => ({
  //   components:
  //     state?.Interface?.interfaceData?.[interfaceId]?.responseTypes?.[gridId]
  //       ?.components || {},
  // }));

  const responseTypeJson: any = useContext(GridContext);
  const components = responseTypeJson?.components;

  return (
    <Box className="column grid_parent">
      {Object.keys(components || {}).map((componentKey: string) => {
        return (
          <div key={componentKey} className="grid-item column not_drag">
            <ComponentRenderer
              componentId={componentKey}
              dragRef={dragRef}
              // gridId={gridId}
              inpreview
            />
          </div>
        );
      })}
      {/* {Object.values(components || {}).map((componentJson: any) => {
        return (
          <div key={componentJson?.key} className="grid-item column not_drag">
            <ComponentRenderer
              componentId={componentJson?.key}
              dragRef={dragRef}
              // gridId={gridId}
              inpreview
            />
          </div>
        );
      })} */}
    </Box>
  );
}
export default React.memo(
  addUrlDataHoc(React.memo(Viewonlygrid), [ParamsEnums?.interfaceId])
);
