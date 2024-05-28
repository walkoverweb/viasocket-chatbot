/* eslint-disable */
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import InterfaceGrid from "../Grid/Grid.tsx";
import "./Message.scss";

function Message({ message, isJSONString, dragRef }) {
  return (
    <Box className="w-100">
      {message?.role === "user" ? (
        // <Box className="chat-row flex w-100 box-sizing-border-box mr-2">
        // <Box className="chat-user-container">
        //   <Box className="chat-row-user">
        //     <Typography variant="body1" className="ml-2">
        //       {message?.content}
        //     </Typography>
        //   </Box>
        //   <AccountBoxIcon className="botIcon" />
        // </Box>

        <Stack
          sx={{
            alignItems: "center",
            gap: "0px",
            width: "100%",
            minHeight: "50px",
            justifyContent: "flex-end",
            " @media(max-width:479px)": {
              height: "80px",
              columnGap: "5px",
            },
            // flexWrap: 'wrap'
          }}
          direction="row"
        >
          <Box
            sx={{
              backgroundColor: "#d4e9ff",
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "250px",
              borderRadius: "10px 10px 1px 10px",
              boxShadow: "0 4px 2px rgba(0, 0, 0, 0)",
              wordBreak: "break-all",
              maxWidth: "80%",
            }}
          >
            <Typography
              variant="p"
              sx={{
                fontFamily: "var(--theme-font-family)",
                color: "var(--theme-color-base)",
                fontSize: "15px",
                " @media(max-width:991px)": { fontSize: "14px" },
                " @media(max-width:479px)": { fontSize: "12px" },
              }}
            >
              {message?.content}
            </Typography>
          </Box>
          <Stack
            sx={{
              alignItems: "center",
              width: "40px",
              justifyContent: "flex-end",
              " @media(max-width:479px)": { width: "50px" },
            }}
            spacing="5px"
          >
            {/* <Avatar
              src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/aaec5f35-44d0-4230-a9e6-bb127f2ff6eb-profile-picture-smiling-successful-young-260nw-2040223583.png"
              sx={{
                borderRadius: 'calc(16px*1.5)',
                boxShadow: '0px 0px calc(16px*1.5) gray',
                fontFamily: 'var(--theme-font-family)',
                height: '50px',
                width: '50px',
                objectFit: 'cover',
                '&.MuiAvatar-root': { boxShadow: 'none' },
                ' @media(max-width:991px)': {
                  height: '35px',
                  width: '35px',
                },
                ' @media(max-width:479px)': {
                  height: '25px',
                  width: '25px',
                },
              }}
              alt=""></Avatar> */}
            <AccountBoxIcon
              sx={{
                borderRadius: "calc(16px*1.5)",
                // boxShadow: '0px 0px calc(16px*1.5) gray',
                // fontFamily: 'var(--theme-font-family)',
                height: "30px",
                width: "30px",
                objectFit: "cover",
                "&.MuiAvatar-root": { boxShadow: "none" },
                " @media(max-width:991px)": {
                  height: "25px",
                  width: "25px",
                },
                " @media(max-width:479px)": {
                  height: "25px",
                  width: "25px",
                },
              }}
            />

            {/* <Typography
              variant="p"
              sx={{
                fontFamily: 'var(--theme-font-family)',
                color: 'var(--theme-color-base)',
                fontSize: '12px',
                ' @media(max-width:991px)': { fontSize: '12px' },
                ' @media(max-width:479px)': { fontSize: '10px' },
              }}>
              11:00 AM
            </Typography> */}
          </Stack>
        </Stack>
      ) : (
        // </Box>
        // <Box className="chat-row w-100 box-sizing-border-box mr-2">
        //   <Box className="w-100 flex-start-start">
        //     <SmartToyIcon className="mr-1" />
        //     {message?.wait ? (
        //       <Box className="flex-start-center w-100 gap-2 p-1 ml-3">
        //         <div className="loader" />
        //         <Typography variant="body">{message?.content}</Typography>
        //       </Box>
        //     ) : message?.timeOut ? (
        //       <Box className="flex-start-center w-100 gap-5 p-1">
        //         <Typography variant="body">
        //           Timeout reached. Please try again later.
        //         </Typography>
        //       </Box>
        //     ) : (
        //       <Box className="w-100 flex-start-center">
        //         {isJSONString(message?.content || "{}")?.responseId ? (
        //           <InterfaceGrid
        //             style={{ height: window.innerHeight }}
        //             dragRef={dragRef}
        //             inpreview={false}
        //             ingrid={false}
        //             gridId={
        //               JSON.parse(message?.content || "{}")?.responseId ||
        //               "default"
        //             }
        //             loadInterface={false}
        //             componentJson={JSON.parse(message?.content || "{}")}
        //             msgId={message?.createdAt}
        //           />
        //         ) : (
        //           <Typography className="ml-1 flex-start-center">
        //             {message?.content}
        //             <ReportProblemIcon
        //               fontSize="small"
        //               color="error"
        //               className="ml-2"
        //             />
        //           </Typography>
        //         )}
        //       </Box>
        //     )}
        //   </Box>
        // </Box>
        <Stack
          sx={{
            alignItems: "center",
            gap: "10px",
            width: "100%",
            height: "110px",
            " @media(max-width:479px)": {
              height: "90px",
              columnGap: "5px",
            },
          }}
          direction="row"
        >
          <Stack
            sx={{
              alignItems: "center",
              width: "30px",
              justifyContent: "flex-end",
              " @media(max-width:479px)": { width: "50px" },
            }}
            spacing="5px"
          >
            {/* <Avatar
              src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/0c1606a6-23b7-4817-82c1-39da53650fec-round_profil_picture_before_ (1).png"
              sx={{
                borderRadius: 'calc(16px*1.5)',
                boxShadow: '0px 0px calc(16px*1.5) gray',
                fontFamily: 'var(--theme-font-family)',
                height: '50px',
                width: '50px',
                objectFit: 'cover',
                '&.MuiAvatar-root': { boxShadow: 'none' },
                ' @media(max-width:991px)': {
                  height: '35px',
                  width: '35px',
                },
                ' @media(max-width:479px)': {
                  height: '25px',
                  width: '25px',
                },
              }}
              alt=""></Avatar> */}
            <SmartToyIcon
              sx={{
                borderRadius: "calc(16px*1.5)",
                // boxShadow: '0px 0px calc(16px*1.5) gray',
                // fontFamily: 'var(--theme-font-family)',
                height: "30px",
                width: "30px",
                objectFit: "cover",
                "&.MuiAvatar-root": { boxShadow: "none" },
                " @media(max-width:991px)": {
                  height: "25px",
                  width: "25px",
                },
                " @media(max-width:479px)": {
                  height: "25px",
                  width: "25px",
                },
              }}
            />
            {/* <Typography
              variant="p"
              sx={{
                fontFamily: 'var(--theme-font-family)',
                color: 'var(--theme-color-base)',
                fontSize: '12px',
                ' @media(max-width:991px)': { fontSize: '12px' },
                ' @media(max-width:479px)': { fontSize: '10px' },
              }}>
              11:00 AM
            </Typography> */}
          </Stack>
          <Box
            sx={{
              backgroundColor: "#EAEAEA",
              padding: "10px",
              boxSizing: "border-box",
              height: "fit-content",
              minWidth: "250px",
              borderRadius: "10px 10px 10px 1px",
              maxWidth: "90%",
            }}
          >
            {message?.wait ? (
              <Box className="flex-start-center w-100 gap-2 p-1">
                <div className="loader" />
                <Typography variant="body">{message?.content}</Typography>
              </Box>
            ) : message?.timeOut ? (
              <Box className="flex-start-center w-100 gap-5 p-1">
                <Typography variant="body">
                  Timeout reached. Please try again later.
                </Typography>
              </Box>
            ) : (
              <Box className="w-100 flex-start-center">
                {isJSONString(message?.content || "{}")?.responseId ? (
                  <InterfaceGrid
                    style={{ height: window.innerHeight }}
                    dragRef={dragRef}
                    inpreview={false}
                    ingrid={false}
                    gridId={
                      JSON.parse(message?.content || "{}")?.responseId ||
                      "default"
                    }
                    loadInterface={false}
                    componentJson={JSON.parse(message?.content || "{}")}
                    msgId={message?.createdAt}
                  />
                ) : (
                  <Typography className="ml-1 flex-start-center">
                    {message?.content}
                    <ReportProblemIcon
                      fontSize="small"
                      color="error"
                      className="ml-2"
                    />
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
export default Message;
