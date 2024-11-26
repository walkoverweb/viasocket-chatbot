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
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewThreadApi } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import {
  setThreadId,
  setThreads,
} from "../../../../store/interface/interfaceSlice.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import { GetSessionStorageData } from "../../utils/InterfaceUtils.ts";

// function to create random id for new thread
const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

function ChatbotDrawer({ open, toggleDrawer, interfaceId }) {
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
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {(subThreadList || []).length === 0 ? (
        <Box className="flex-center-center">
          <Typography variant="subtitle1">No Threads</Typography>
        </Box>
      ) : (
        <List>
          {subThreadList.map((thread) => (
            <ListItem
              key={thread?._id}
              disablePadding
              onClick={() => handleChangeSubThread(thread?.sub_thread_id)}
            >
              <ListItemButton>
                <ListItemText
                  primary={thread?.display_name || thread?.sub_thread_id}
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
        className="flex-end-center p-3 gap-2 cursor-pointer"
        onClick={handleCreateNewSubThread}
      >
        <Typography variant="body1" className="font-bold">
          New chat
        </Typography>
        <CreateIcon />
      </Box>
      <Divider />
      {DrawerList}
    </Drawer>
  );
}

export default React.memo(
  addUrlDataHoc(React.memo(ChatbotDrawer), [ParamsEnums.interfaceId])
);
