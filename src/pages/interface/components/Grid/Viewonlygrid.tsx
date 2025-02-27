import { Box } from "@mui/material";
import React, { useContext } from "react";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import ComponentRenderer from "../ComponentRenderer.tsx";
import { GridContext } from "./Grid.tsx";

function Viewonlygrid({ dragRef }) {
  const { gridContextValue: responseTypeJson }: any = useContext(GridContext);
  const components = responseTypeJson?.components || responseTypeJson;

  return (
    <Box className="w-100">
      {(components || {}).map((component: { type: string }, index) => {
        return (
          <div key={component?.type}>
            <ComponentRenderer
              componentId={component}
              dragRef={dragRef}
              index={index}
              inpreview
            />
          </div>
        );
      })}
    </Box>
  );
}
export default React.memo(
  addUrlDataHoc(React.memo(Viewonlygrid), [ParamsEnums?.interfaceId])
);
