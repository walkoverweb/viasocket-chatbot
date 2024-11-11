/* eslint-disable */
import React, { useContext } from "react";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc.tsx";
import "../Interface.scss";
import { GridContext } from "./Grid/Grid.tsx";
import InterfaceAccordion from "./Interface-Accordion/InterfaceAccordion.tsx";
import InterfaceBox from "./Interface-Box/InterfaceBox.tsx";
import InterfaceButton from "./Interface-Button/InterfaceButton.tsx";
import InterfaceMarkdown from "./Interface-Chatbot/Interface-Markdown/InterfaceMarkdown.tsx";
import InterfaceChatbot from "./Interface-Chatbot/InterfaceChatbot.tsx";
import InterfaceCheckbox from "./Interface-Checkbox/InterfaceCheckbox.tsx";
import InterfaceDivider from "./Interface-Divider/InterfaceDivider.tsx";
import InterfaceDropdown from "./Interface-DropDown/InterfaceDropdown.tsx";
import InterfaceForm from "./Interface-Form/InterfaceForm.tsx";
import InterfaceIcon from "./Interface-Icon/InterfaceIcon.tsx";
import InterfaceLink from "./Interface-Link/InterfaceLink.tsx";
import InterfaceTable from "./Interface-Table/InterfaceTable.tsx";
import InterfaceText from "./Interface-Text/InterfaceText.tsx";
import InterfaceTextfield from "./Interface-TextField/InterfaceTextfield.tsx";
import Interfacedatepicker from "./InterfaceDatepicker/Interfacedatepicker.tsx";
import InterfaceRadio from "./InterfaceRadio/InterfaceRadio.tsx";
import InterfaceCard from "./Interface-Card/InterfaceCard.tsx";
import InterfaceBarGraph from "./Interface-BarGraph/InterfaceBarGraph.tsx";

interface ComponentRendererProps {
  gridId?: string;
  componentId: string;
  dragRef?: any;
  inpreview?: boolean;
  interfaceId: string;
}
ComponentRenderer.defaultProps = {
  id: "",
  gridId: "root",
  dragRef: {},
  inpreview: false,
};

const componentMap: any = {
  Input: (data: any) => <InterfaceTextfield {...data} />,
  TextField: (data: any) => <InterfaceTextfield {...data} />,
  TextArea: (data: any) => <InterfaceTextfield {...data} />,
  Button: (data: any) => <InterfaceButton {...data} />,
  Select: (data: any) => <InterfaceDropdown {...data} />,
  Divider: (data: any) => <InterfaceDivider {...data} />,
  Text: (data: any) => <InterfaceText {...data} />,
  Link: (data: any) => <InterfaceLink {...data} />,
  Box: (data: any) => <InterfaceBox {...data} ingrid />,
  Checkbox: (data: any) => <InterfaceCheckbox {...data} />,
  Form: (data: any) => <InterfaceForm {...data} ingrid />,
  ChatBot: (data: any) => <InterfaceChatbot {...data} />,
  Typography: (data: any) => <InterfaceText {...data} />,
  DatePicker: (data: any) => <Interfacedatepicker {...data} />,
  Radio: (data: any) => <InterfaceRadio {...data} />,
  Icon: (data: any) => <InterfaceIcon {...data} />,
  Accordion: (data: any) => <InterfaceAccordion {...data} />,
  Table: (data: any) => <InterfaceTable {...data} />,
  Markdown: (data: any) => <InterfaceMarkdown {...data} />,
  Card: (data: any) => <InterfaceCard {...data} />,
  BarGraph: (data: any) => <InterfaceBarGraph {...data} />,
};

function ComponentRenderer({
  // gridId,
  componentId,
  dragRef,
  inpreview = false,
}: ComponentRendererProps) {
  const responseTypeJson: any = useContext(GridContext);
  // const { type, props, key, action } = componentData;
  const type =
    responseTypeJson?.components?.[componentId]?.type ||
    responseTypeJson?.[componentId]?.type;
  const props =
    responseTypeJson?.components?.[componentId]?.props ||
    responseTypeJson?.[componentId]?.props;
  const action =
    responseTypeJson?.components?.[componentId]?.action ||
    responseTypeJson?.[componentId]?.action;

  const component = componentMap[type] || null;

  if ((component && type === "Button") || type === "ChatBot") {
    return component({
      props,
      componentId,
      inpreview,
      action,
    });
  }

  return component
    ? component({
        props,
        componentId,
        inpreview,
        dragRef,
        action,
      })
    : null;
}

export default React.memo(
  addUrlDataHoc(React.memo(ComponentRenderer), [ParamsEnums?.interfaceId])
);
