import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AiIcon, UserAssistant } from "../../../../assests/assestsIndex.ts";
import { setHuman } from "../../../../store/hello/helloSlice.ts";
import { $ReduxCoreType } from "../../../../types/reduxCore.ts";
import { useCustomSelector } from "../../../../utils/deepCheckSelector";

function ChatbotHeaderTab() {
  const dispatch = useDispatch();
  const { IsHuman, mode } = useCustomSelector((state: $ReduxCoreType) => ({
    IsHuman: state.Hello?.isHuman || false,
    mode: state.Hello?.mode || [],
  }));

  const isHelloAssistantEnabled = mode?.length > 0;
  const [value, setValue] = useState(IsHuman ? "Human" : "AI"); // Set default tab based on IsHuman

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "Human") dispatch(setHuman({}));
    else dispatch(setHuman({ isHuman: false }));
    setValue(newValue);
  };

  if (!isHelloAssistantEnabled) {
    return null;
  }
  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => handleChange(e, newValue)}
      centered
      sx={{ minHeight: "2px", padding: "0" }}
    >
      <Tab
        value="AI"
        label="AI"
        icon={
          <img
            src={AiIcon}
            width="24"
            height="24"
            alt="AI Icon"
            style={{
              marginRight: 4,
              filter: "drop-shadow(0 0 5px pink)",
            }}
          />
        }
        iconPosition="start"
        sx={{
          fontSize: "0.8rem",
          padding: "0 2px",
          color: "black",
          minHeight: "40px",
        }}
      />
      <Tab
        value="Human"
        label="Human"
        icon={
          <img
            src={UserAssistant}
            width="24"
            height="24"
            alt="Human Icon"
            className="icon-visible"
            style={{
              cursor: "pointer",
              filter: !IsHuman ? "drop-shadow(0 0 5px pink)" : "",
            }}
          />
        }
        iconPosition="start"
        sx={{
          fontSize: "0.8rem",
          padding: "0 2px",
          color: "black",
          minHeight: "40px",
        }}
      />
    </Tabs>
  );
}

export default ChatbotHeaderTab;
