import React, { useContext } from "react";
import InterfaceTable from "../../components/Interface-Table/InterfaceTable";
import { GridContext } from "../../components/Grid/Grid.tsx";

function ChatbotComponentPreview({
  props,
  componentName,
}: {
  props: any;
  componentName: string;
}) {
  const GridContextValue = useContext(GridContext);
  console.log(GridContextValue, "GridContextValue");
  switch (componentName) {
    case "Table":
      return <InterfaceTable {...props} />;
    default:
      return <h3>No valid component found.</h3>;
  }
}

export default ChatbotComponentPreview;
