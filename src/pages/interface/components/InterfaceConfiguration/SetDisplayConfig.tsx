import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/text";
import "ace-builds/src-noconflict/theme-iplastic";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useDispatch } from "react-redux";
import { updateInterfaceDetailsApi } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ApiTypes, ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { updateInterfaceSuccess } from "../../../../store/interface/interfaceSlice.ts";
// import { updateProjects } from '../../../../store/projects/projectsThunk'
import { useCustomSelector } from "../../../../utils/deepCheckSelector";

function SetDisplayConfig({
  interfaceId,
  projectId,
  inIntegration = false,
  orgId,
}) {
  const dispatch = useDispatch();
  const config = useCustomSelector((state) =>
    inIntegration
      ? state.projects.embedProject[orgId]?.["active"]?.[projectId]?.settings
          ?.config
      : state.Interface.interfaceData[interfaceId].config || {}
  );
  const currentIntegration = useCustomSelector(
    (state) => state.projects.embedProject[orgId]?.["active"]?.[projectId] || {}
  );
  const [localConfig, setLocalConfig] = useState(config);
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  function setValuesLocalConfig(key, value) {
    setLocalConfig({ ...localConfig, [key]: value });
  }

  const updateConfig = async () => {
    if (inIntegration) {
      const dataTosend = {
        settings: { ...currentIntegration?.settings, config: localConfig },
        org_id: orgId,
        project_id: projectId,
        title: currentIntegration?.title,
      };
      // dispatch(updateProjects({ id: projectId, dataTosend, type: ApiTypes.EMBED })).then(() => {
      // successToast('Configuration updated successfully.')
      // })
    } else {
      const res = await updateInterfaceDetailsApi(
        { config: localConfig, interfaceId },
        { projectId }
      );
      if (res?.success) dispatch(updateInterfaceSuccess(res?.data || {}));
    }
  };
  const buttonCode = `
  <button onclick="openViasocket()" >Open viasocket</button> 
  <!-- you can also pass scriptId in this function if you want to redirect to any script like openViasocket('scr435678')  -->
  `;
  return (
    <Box className="column w-100 gap-1  p-3 boxShadow">
      {inIntegration && (
        <Box className="column w-100 gap-1">
          <Typography>Endpoint URL for Flow Modification event</Typography>
          <TextField
            value={localConfig?.webhook}
            placeholder="Enter URL"
            onChange={(e) => setValuesLocalConfig("webhook", e.target.value)}
          />
        </Box>
      )}
      <Typography className="mt-2">Choose the display :</Typography>
      <Box className="flex-start-center gap-2 ">
        {!inIntegration && (
          <TextField
            label="Title"
            value={localConfig?.title}
            placeholder="enter title"
            onChange={(e) => setValuesLocalConfig("title", e.target.value)}
          />
        )}
        <TextField
          label="Button title"
          value={localConfig?.buttonName}
          placeholder="enter button title"
          onChange={(e) => setValuesLocalConfig("buttonName", e.target.value)}
        />
      </Box>
      <RadioGroup
        row
        aria-label="config-options"
        name="config-options"
        value={localConfig?.type}
        className="mt-2"
        onChange={(e) => setValuesLocalConfig("type", e.target.value)}
      >
        <FormControlLabel
          value="all_space"
          control={<Radio />}
          label="All Available space"
        />
        <FormControlLabel
          value="left_slider"
          control={<Radio />}
          label="Left slider"
        />
        <FormControlLabel
          value="right_slider"
          control={<Radio />}
          label="Right slider"
        />
        <FormControlLabel
          value="popover"
          control={<Radio />}
          label="Pop over"
        />
        <FormControlLabel value="popup" control={<Radio />} label="Popup" />
      </RadioGroup>

      {inIntegration && (
        <Box className="w-100 mt-2">
          <Typography>Button type</Typography>
          <RadioGroup
            aria-label="authentication-type"
            name="authentication-type"
            value={localConfig?.buttonType}
            onChange={(e) => setValuesLocalConfig("buttonType", e.target.value)}
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="Default"
            />
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>
          {localConfig?.buttonType === "custom" && (
            <AceEditor
              readOnly
              setOptions={{ useWorker: false }}
              theme="iplastic"
              name="functionScript"
              value={buttonCode}
              mode="html"
              height="80px"
              width="100%"
              showGutter={false}
              showPrintMargin={false}
              wrapEnabled
            />
          )}
        </Box>
      )}
      <Typography className="mt-2">Dimensions</Typography>

      <Box className="flex-start-center gap-5 ">
        <Box className="flex-start-center gap-1 w-20vw">
          <TextField
            label="Height"
            className="w-100"
            type="number"
            disabled={localConfig?.type === "all_space"}
            value={localConfig?.height}
            onChange={(e) => setValuesLocalConfig("height", e.target.value)}
          />

          <Select
            value={localConfig?.heightUnit}
            disabled={localConfig?.type === "all_space"}
            onChange={(e) => setValuesLocalConfig("heightUnit", e.target.value)}
            name="unit"
          >
            <MenuItem value="px">px</MenuItem>
            <MenuItem value="%">%</MenuItem>
          </Select>
        </Box>
        <Box className="flex-start-center gap-1 w-20vw">
          <TextField
            label="Width"
            type="number"
            className="w-100"
            disabled={localConfig?.type === "all_space"}
            value={localConfig?.width}
            onChange={(e) => setValuesLocalConfig("width", e.target.value)}
          />
          <Select
            value={localConfig?.widthUnit}
            disabled={localConfig?.type === "all_space"}
            onChange={(e) => setValuesLocalConfig("widthUnit", e.target.value)}
            name="unit"
          >
            <MenuItem value="px">px</MenuItem>
            <MenuItem value="%">%</MenuItem>
          </Select>
        </Box>
      </Box>
      <Button variant="contained" className="mt-2" onClick={updateConfig}>
        Save
      </Button>
    </Box>
  );
}
export default React.memo(
  addUrlDataHoc(React.memo(SetDisplayConfig), [
    ParamsEnums?.projectId,
    ParamsEnums?.interfaceId,
    ParamsEnums.orgId,
  ])
);
