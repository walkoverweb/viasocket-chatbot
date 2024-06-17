// import {
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { ParamsEnums } from "../../../../enums";
// import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
// import { updateInterfaceFrontendActionStart } from "../../../../store/interface/interfaceSlice.ts";
// import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
// import { useCustomSelector } from "../../../../utils/deepCheckSelector";
// import { DataforComponents } from "../../utils/InterfaceUtils.ts";
// import ComponentToTakePropValue from "./PropsRenderer.tsx";

// const newId = ((Date.now() / 1000) * 1000)?.toString();
// function ActionsTab({
//   projectId,
//   interfaceId,
// }: {
//   projectId: string;
//   interfaceId: string;
// }) {
//   const [isDropdownVisible, setIsDropDownVisible] = React.useState<
//     boolean | null
//   >(false);
//   const [actionType, setActionType] = React.useState<string | null>(null);
//   const currentSelectedComponent = useCustomSelector(
//     (state: $ReduxCoreType) => state?.Interface?.currentSelectedComponent
//   );
//   const { gridId, componentId, componentType } = currentSelectedComponent || {};
//   const dispatch = useDispatch();
//   const { actionsArray, frontendActionsData } = useCustomSelector(
//     (state: $ReduxCoreType) => ({
//       actionsArray:
//         state?.Interface?.interfaceData?.[interfaceId]?.actions?.[gridId]?.[
//           componentId
//         ]?.actionsArr,
//       frontendActionsData:
//         state?.Interface?.interfaceData?.[interfaceId]?.frontendActions?.[
//           gridId
//         ]?.[componentId],
//     })
//   );

//   const handleChange = (event: SelectChangeEvent) => {
//     const selectedActionType = event.target.value as string;
//     setActionType(selectedActionType);
//     if (selectedActionType === "sendDataToFrontend") {
//       dispatch(
//         updateInterfaceFrontendActionStart({
//           gridId,
//           componentId,
//           frontendActionId: newId,
//           frontendActions: {
//             type: "sendDataToFrontend",
//             data: "sendDataToFrontend",
//           },
//         })
//       );
//       setActionType(null);
//     }
//     hideDropDown();
//   };
//   const showDropDown = () => {
//     setIsDropDownVisible(true);
//   };
//   const hideDropDown = () => {
//     setIsDropDownVisible(false);
//   };

//   return (
//     <Box className="column w-100 gap-2">
//       <Box className="flex-col">
//         {actionsArray?.length > 0 && (
//           <>
//             <Typography variant="inherit">Actions</Typography>
//             <Divider className="my-2" />
//           </>
//         )}
//         {actionsArray?.map((actionElement: any) => {
//           if (actionElement?.type === "chatbot") return null;
//           return (
//             <ComponentToTakePropValue
//               key={actionElement?.value}
//               propName={actionElement?.type}
//               projectId={projectId}
//               gridId={gridId}
//               componentId={componentId}
//               setActionType={setActionType}
//               handleChange={handleChange}
//               actionElement={actionElement}
//               actionKey={actionElement?.value}
//             />
//           );
//         })}
//         {Object.values(frontendActionsData || {}).length > 0 && (
//           <>
//             <Typography variant="inherit" className="">
//               Frontend Actions
//             </Typography>
//             <Divider className="my-2" />
//           </>
//         )}
//         {Object.entries(frontendActionsData || {}).map(
//           ([key, actionElement]) => {
//             return (
//               <ComponentToTakePropValue
//                 key={key}
//                 propName={actionElement?.type}
//                 projectId={projectId}
//                 gridId={gridId}
//                 componentId={componentId}
//                 setActionType={setActionType}
//                 handleChange={handleChange}
//                 actionElement={actionElement}
//                 actionKey={key}
//               />
//             );
//           }
//         )}
//       </Box>
//       {actionType && (
//         <ComponentToTakePropValue
//           propName={actionType}
//           setActionType={setActionType}
//         />
//       )}

//       <Divider className="my-2" />
//       {!isDropdownVisible ? (
//         DataforComponents[componentType]?.actions ? (
//           <Button variant="outlined" onClick={showDropDown}>
//             Add Action +
//           </Button>
//         ) : (
//           <Typography variant="h5">No Actions Available</Typography>
//         )
//       ) : (
//         <FormControl fullWidth>
//           <Select
//             labelId="demo-simple-select-label"
//             id="demo-simple-select"
//             value={actionType}
//             displayEmpty
//             onChange={handleChange}
//           >
//             <MenuItem value={null} disabled>
//               Select Action Type
//             </MenuItem>
//             {DataforComponents[componentType]?.actions?.map((action: any) => {
//               // const isKeyUsed =
//               //   actionData?.actionsArr?.some(() => ['chatbot']?.includes(action?.type)) ||
//               //   Object.values(frontendActionsData || {}).some(() => ['navigate']?.includes(action?.type))
//               return (
//                 <MenuItem key={action?.type} value={action?.type}>
//                   {action?.title}
//                 </MenuItem>
//               );
//             })}
//           </Select>
//         </FormControl>
//       )}
//     </Box>
//   );
// }

// export default React.memo(
//   addUrlDataHoc(React.memo(ActionsTab), [
//     ParamsEnums?.orgId,
//     ParamsEnums?.projectId,
//     ParamsEnums?.interfaceId,
//   ])
// );
