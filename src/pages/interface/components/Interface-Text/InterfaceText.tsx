import { useContext, useEffect } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { useDispatch } from "react-redux";
import { addInterfaceContext } from "../../../../store/interface/interfaceSlice.ts";
import { GridContext } from "../Grid/Grid.tsx";

interface InterfaceTextProps {
  props: TypographyProps | any;
}

function InterfaceText({ props, componentId }: InterfaceTextProps) {
  const dispatch = useDispatch();
  const responseJson = useContext(GridContext);
  useEffect(() => {
    dispatch(
      addInterfaceContext({
        gridId: responseJson?.responseId + responseJson?.msgId,
        componentId: componentId,
        value: responseJson?.[componentId]?.props?.children,
      })
    );
  }, [responseJson, responseJson?.msgId]);

  return (
    <Typography key={props?.key} {...props}>
      {props?.children || `I'm a text component.`}
    </Typography>
  );
}

export default InterfaceText;
