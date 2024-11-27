import CreateIcon from "@mui/icons-material/Create";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { lighten, useTheme } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewThreadApi } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import CloseSidebarIcon from "../../../../assests/CloseSidebar.tsx";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  setThreadId,
  setThreads,
} from "../../../../store/interface/interfaceSlice.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import isColorLight from "../../../../utils/themeUtility";
import { GetSessionStorageData } from "../../utils/InterfaceUtils.ts";

// function to create random id for new thread
const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

function ChatbotDrawer({ open, toggleDrawer, interfaceId }) {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";
  const dispath = useDispatch();
  const { reduxThreadId, subThreadList } = useCustomSelector(
    (state: $ReduxCoreType) => ({
      reduxThreadId: state.Interface?.threadId || "",
      subThreadList:
        state.Interface?.interfaceContext?.[interfaceId]?.[
          GetSessionStorageData("bridgeName") ||
            state.Interface?.bridgeName ||
            "root"
        ]?.threadList?.[
          GetSessionStorageData("threadId") || state.Interface?.threadId
        ] || [],
    })
  );

  const thread_id = GetSessionStorageData("threadId") || reduxThreadId;
  const [bridgeName] = useState(GetSessionStorageData("bridgeName") || "root");

  // useEffect(() => {
  //     setThreadId(GetSessionStorageData("threadId"));
  // }, [reduxThreadId]);

  const handleCreateNewSubThread = async () => {
    const result = await createNewThreadApi({
      threadId: thread_id,
      subThreadId: createRandomId(),
    });
    if (result?.success) {
      dispath(
        setThreads({
          newThreadData: result?.thread,
          bridgeName,
          threadId: thread_id,
        })
      );
    }
  };

  const handleChangeSubThread = (sub_thread_id: string) => {
    dispath(setThreadId({ subThreadId: sub_thread_id }));
  };

  const DrawerList = (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      {(subThreadList || []).length === 0 ? (
        <Box className="flex-center-center">
          <Typography
            variant="subtitle1"
            className="mt-5"
            color={textColor || "black"}
          >
            No Threads
          </Typography>
        </Box>
      ) : (
        <List>
          {subThreadList.map((thread) => (
            <ListItem
              key={thread?._id}
              disablePadding
              dense
              onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
            >
              <ListItemButton
                selected={
                  thread?.sub_thread_id === GetSessionStorageData("subThreadId")
                }
                sx={{
                  backgroundColor:
                    thread?.sub_thread_id ===
                    GetSessionStorageData("subThreadId")
                      ? "primary.main" // Set to your desired color or theme color
                      : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "primary.main", // Customize the background color of the selected state
                  },
                }}
              >
                <ListItemText
                  primary={thread?.display_name || thread?.sub_thread_id}
                  color="inherit"
                  sx={{ color: textColor || "black" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          backgroundColor: lighten(theme.palette.primary.main, 0.2),
          flex: 1,
        }}
      >
        <Box className="flex-spaceBetween-center p-3 gap-2">
          <Box onClick={toggleDrawer(false)} className="mr-2 cursor-pointer">
            <CloseSidebarIcon color={textColor} />
          </Box>
          <Typography
            variant="body1"
            className="font-bold"
            sx={{ color: textColor }}
          >
            History
          </Typography>
          <CreateIcon
            className="cursor-pointer"
            onClick={handleCreateNewSubThread}
            color="inherit"
            style={{ color: textColor || "black" }}
          />
        </Box>
        <Divider sx={{ borderColor: textColor || "black" }} />
        {DrawerList}
      </Box>
    </Drawer>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.interfaceId])
);
