import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { resetChatsAction } from "../../../../api/InterfaceApis/InterfaceApis.ts";
import { ChatbotContext } from "../../../../App";
import { ParamsEnums } from "../../../../enums";
import addUrlDataHoc from "../../../../hoc/addUrlDataHoc.tsx";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";
import isColorLight from "../../../../utils/themeUtility";
import "./InterfaceChatbot.scss";

function ChatbotHeader({ setChatsLoading }) {
  const theme = useTheme();
  const {
    chatbotConfig: { chatbotTitle, chatbotSubtitle },
  } = useContext<any>(ChatbotContext);
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 2, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Box className="flex-center-center">
          <Typography
            variant="h6"
            className="interface-chatbot__header__title"
            sx={{ color: textColor }}
          >
            {chatbotTitle || "AI Assistant"}
          </Typography>
          <ResetChatOption
            textColor={textColor}
            setChatsLoading={setChatsLoading}
          />
        </Box>
        {chatbotSubtitle && (
          <Typography
            variant="subtitle2"
            className="interface-chatbot__header__subtitle"
            sx={{ color: textColor }}
          >
            {chatbotSubtitle || "Do you have any questions? Ask us!"}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}
export default ChatbotHeader;

export function ChatbotHeaderPreview() {
  const theme = useTheme();
  const isLightBackground = isColorLight(theme.palette.primary.main);
  const textColor = isLightBackground ? "black" : "white";

  return (
    <Grid
      item
      xs={12}
      className="first-grid"
      sx={{ paddingX: 2, paddingY: 1, background: theme.palette.primary.main }}
    >
      <Box className="flex-col-start-start">
        <Box className="flex-center-center">
          <Typography
            variant="h6"
            className="interface-chatbot__header__title flex-center-center"
            sx={{ color: textColor }}
          >
            AI Assistant
          </Typography>
          <ResetChatOption textColor={textColor} preview />
        </Box>
        <Typography
          variant="subtitle2"
          className="interface-chatbot__header__subtitle"
          sx={{ color: textColor }}
        >
          Do you have any questions? Ask us!
        </Typography>
      </Box>
    </Grid>
  );
}

const ResetChatOption = React.memo(
  addUrlDataHoc(
    ({
      textColor,
      setChatsLoading = () => {},
      preview = false,
      interfaceId,
    }) => {
      const { threadId, bridgeName } = useCustomSelector(
        (state: $ReduxCoreType) => ({
          threadId: state.Interface?.threadId || "",
          bridgeName: state.Interface?.bridgeName || "root",
        })
      );

      const userId = localStorage.getItem("interfaceUserId");
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = async () => {
        setAnchorEl(null);
      };

      const resetHistory = async () => {
        if (preview) return;
        setChatsLoading(true);
        await resetChatsAction({
          userId,
          thread_id: threadId,
          slugName: bridgeName,
          chatBotId: interfaceId,
        });
        handleClose();
        setChatsLoading(false);
      };

      return (
        <Box className="ml-2 flex-center-center">
          <KeyboardArrowDownIcon
            className="cursor-pointer"
            style={{ color: textColor }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={resetHistory}>
              <ListItemIcon>
                <SyncIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Chat</ListItemText>
            </MenuItem>
            <MenuItem onClick={resetHistory} disabled>
              <ListItemIcon>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send feedback</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      );
    },
    [ParamsEnums.interfaceId]
  )
);
