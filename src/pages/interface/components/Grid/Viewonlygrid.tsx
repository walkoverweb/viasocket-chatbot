import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import { gridXY } from "../../utils/InterfaceUtils.ts";
import ComponentRenderer from "../ComponentRenderer.tsx";
import { ReactGridItemWrapper } from "./ReactGridItemWrapper.tsx";

const calculateWH = (heightPx: number, rowHeight: number, margin: number[]) => {
  const h = Math.ceil((heightPx - margin[1]) / (rowHeight + margin[1]));
  return h;
};

const GridLayout = WidthProvider(RGL);
function Viewonlygrid({ dragRef, interfaceId, gridId = "root" }) {
  const [rowHeight, setRowHieght] = useState(window.innerHeight / 200);

  const { coordinates, components } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      coordinates:
        state?.Interface?.interfaceData?.[interfaceId]?.coordinates?.[gridId] ||
        {},
      components:
        state?.Interface?.interfaceData?.[interfaceId]?.components?.[gridId] ||
        {},
    })
  );

  const [coordinatesState, setCoordinatesState] = useState(coordinates || {});

  useEffect(() => {
    setCoordinatesState(coordinates);
  }, [coordinates]);

  const handleSizeChange = (size: any) => {
    setCoordinatesState((prevCoordinates: any) => {
      const calculatedH = calculateWH(size.height, rowHeight, [10, 10]);
      if (coordinates?.[size.key]?.h > calculatedH) {
        return {
          ...prevCoordinates,
          [size.key]: {
            ...prevCoordinates?.[size.key],
            h: coordinates?.[size.key]?.h,
          },
        };
      }
      return {
        ...prevCoordinates,
        [size.key]: { ...prevCoordinates?.[size.key], h: calculatedH },
      };
    });
  };

  const handleResize = () => {
    setRowHieght(window.innerHeight / 200);
  };

  useEffect(() => {
    window?.parent?.postMessage({ type: "interfaceLoaded" }, "*");
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  return (
    <Box className="column grid_parent">
      {Object.values(coordinates || {}).map((coord: any) => {
        const element = components?.[coord?.i] || <div />;
        if (element.type === "ChatBot" || gridId.includes("Response")) {
          return (
            <div key={coord?.i} className="grid-item column not_drag">
              <ComponentRenderer
                style={styles}
                id={coord?.i}
                dragRef={dragRef}
                gridId={gridId}
                inpreview
              />
            </div>
          );
        }
        return null;
      })}
      {!Object.values(coordinates || {}).some((coord) => {
        const element = components?.[coord?.i] || <div />;
        return element.type === "ChatBot" || gridId.includes("Response");
      }) && (
        <GridLayout
          className="main_layout layout"
          layout={Object.values(coordinatesState || {}) || []}
          compactType={null}
          cols={gridXY.cols}
          rowHeight={rowHeight}
          draggableHandle=".dragHandle"
          draggableCancel=".not_drag"
          isDroppable={false}
          isResizable={false}
          isDraggable={false}
          resizeHandles={[]}
        >
          {Object.values(coordinates || {}).map((coord: any) => {
            const element = components?.[coord?.i] || <div />;
            if (element.type !== "ChatBot" && !gridId.includes("Response")) {
              return (
                <div
                  key={coord?.i}
                  className="grid-item not_drag"
                  style={styles}
                >
                  <ReactGridItemWrapper
                    keyName={coord?.i}
                    onResizeItem={handleSizeChange}
                    className="grid-item not_drag"
                  >
                    <ComponentRenderer
                      componentData={element}
                      id={coord?.i}
                      dragRef={dragRef}
                      gridId={gridId}
                      inpreview
                    />
                  </ReactGridItemWrapper>
                </div>
              );
            }
            return null;
          })}
        </GridLayout>
      )}
    </Box>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(Viewonlygrid), [ParamsEnums?.interfaceId])
);
