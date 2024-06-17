// import React, { useRef } from "react";
// import { useDispatch } from "react-redux";
// import SettingsIcon from "@mui/icons-material/Settings";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Divider,
//   Typography,
// } from "@mui/material";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import "./Interface.scss";
// import { useCustomSelector } from "../../utils/deepCheckSelector";
// import Grid from "./components/Grid/Grid.tsx";
// import ComponentConfigs from "./components/componentConfigs/ConfigSlider.tsx";
// import ComponentSlider from "./components/Component-Slider/ComponentSlider.tsx";
// import InterfaceForm from "./components/Interface-Form/InterfaceForm.tsx";
// import { $ReduxCoreType } from "../../types/reduxCore.ts";
// import addUrlDataHoc from "../../hoc/addUrlDataHoc.tsx";
// import { ParamsEnums } from "../../enums";
// import { toggleNestedGridSliderOpen } from "../../store/interface/interfaceSlice.ts";

// interface InterfaceProps {
//   interfaceId: string;
// }
// function Interface({ interfaceId }: InterfaceProps) {
//   const dispatch = useDispatch();
//   const { nestedGridSliderOpen, openConfigModal, isLoading } =
//     useCustomSelector((state: $ReduxCoreType) => ({
//       nestedGridSliderOpen: state.Interface.nestedGridSliderOpen,
//       openConfigModal: state?.Interface?.isConfigSliderOpen,
//       isLoading: state.Interface?.interfaceData?.[interfaceId]?.isLoading,
//     }));

//   const dragRef = useRef();
//   const navigate = useNavigate();

//   const handleClick = () => {
//     dispatch(toggleNestedGridSliderOpen(false));
//   };

//   return (
//     <Box className="flex w-100 h-100vh box-sizing-border-box">
//       <Box>
//         <ComponentSlider dragRef={dragRef} />
//       </Box>
//       <Box className="interface__grid flex-grow h-100vh column box-sizing-border-box ">
//         <div className="flex-spaceBetween-center p-2 box-sizing-border-box grid-header">
//           <Button
//             variant="contained"
//             color="primary"
//             className="ml-3"
//             onClick={() => {
//               navigate(`/i/${interfaceId}`);
//             }}
//           >
//             Preview
//           </Button>
//           <Box className="flex-start-center">
//             {isLoading ? (
//               <>
//                 <CircularProgress size={24} className="mr-2" />
//                 <Typography>Saving...</Typography>
//               </>
//             ) : (
//               <>
//                 <DoneAllIcon className="mr-2" />
//                 <Typography>Saved</Typography>
//               </>
//             )}
//             <Divider orientation="vertical" flexItem className="mx-2" />
//             <Button
//               startIcon={<SettingsIcon />}
//               onClick={() => navigate(`/interfaceSetup`)}
//             >
//               Configuration
//             </Button>
//           </Box>
//         </div>
//         <Box className="w-100 h-100 box-sizing-border-box">
//           <Grid componentId="" inpreview={false} dragRef={dragRef} />
//         </Box>
//       </Box>

//       {nestedGridSliderOpen && (
//         <Box className="interface__child-slider">
//           <Box className="grid_slider_header flex-start-center">
//             <Typography>Drag and drop elements in this component.</Typography>
//             <Button
//               className="ml-2"
//               variant="outlined"
//               onClick={() => handleClick()}
//             >
//               Close
//             </Button>
//           </Box>
//           <InterfaceForm
//             componentId={nestedGridSliderOpen?.id}
//             dragRef={dragRef}
//           />
//         </Box>
//       )}

//       <Box className={openConfigModal ? "" : "d-none"}>
//         <ComponentConfigs />
//       </Box>
//     </Box>
//   );
// }
// export default React.memo(
//   addUrlDataHoc(React.memo(Interface), [ParamsEnums?.interfaceId])
// );
