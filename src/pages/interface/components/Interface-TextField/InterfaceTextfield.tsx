import React, { useContext, useEffect } from "react";
import { Box, TextField, TextFieldProps } from "@mui/material";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { addInterfaceContext } from "../../../../store/interface/interfaceSlice.ts";
import { GridContext } from "../Grid/Grid.tsx";

interface InterfaceTextFieldProps {
  props: TextFieldProps;
  gridId: string;
  componentId: string;
}

function InterfaceTextfield({
  props,
  gridId,
  componentId,
}: InterfaceTextFieldProps) {
  const { gridContextValue: responseJson } = useContext(GridContext);
  useEffect(() => {
    dispatch(
      addInterfaceContext({
        gridId: responseJson?.responseId + responseJson?.msgId,
        componentId: componentId,
        value: responseJson?.[componentId]?.props?.defaultValue,
      })
    );
  }, [responseJson, responseJson?.msgId]);

  const dispatch = useDispatch();

  const addData = (value: string) => {
    dispatch(addInterfaceContext({ gridId, componentId, value }));
  };
  const debouncedDispatch = debounce((value) => {
    addData(value);
  }, 300);

  const handleChange = (e) => {
    const { value } = e.target;
    debouncedDispatch(value);
  };

  return (
    <Box className="w-100 h-100">
      <TextField
        fullWidth
        {...props}
        onChange={handleChange}
        onBlur={(e) => addData(e.target.value)}
        className="mb-2"
        variant="outlined"
        InputLabelProps={{
          sx: {
            // Default label color when not focused
            color: "gray",
          },
        }}
      />
    </Box>
  );
}
export default React.memo(InterfaceTextfield);
