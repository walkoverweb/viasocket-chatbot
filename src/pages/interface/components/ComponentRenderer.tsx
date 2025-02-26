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
  input: (data: any) => <InterfaceTextfield {...data} />,
  textfield: (data: any) => <InterfaceTextfield {...data} />,
  textarea: (data: any) => <InterfaceTextfield {...data} />,
  button: (data: any) => <InterfaceButton {...data} />,
  select: (data: any) => <InterfaceDropdown {...data} />,
  divider: (data: any) => <InterfaceDivider {...data} />,
  text: (data: any) => <InterfaceText {...data} />,
  link: (data: any) => <InterfaceLink {...data} />,
  box: (data: any) => <InterfaceBox {...data} ingrid />,
  checkbox: (data: any) => <InterfaceCheckbox {...data} />,
  form: (data: any) => <InterfaceForm {...data} ingrid />,
  chatbot: (data: any) => <InterfaceChatbot {...data} />,
  typography: (data: any) => <InterfaceText {...data} />,
  datepicker: (data: any) => <Interfacedatepicker {...data} />,
  radio: (data: any) => <InterfaceRadio {...data} />,
  icon: (data: any) => <InterfaceIcon {...data} />,
  accordion: (data: any) => <InterfaceAccordion {...data} />,
  table: (data: any) => <InterfaceTable {...data} />,
  markdown: (data: any) => <InterfaceMarkdown {...data} />,
  card: (data: any) => <InterfaceCard {...data} />,
};

function ComponentRenderer({
  // gridId,
  componentId,
  dragRef,
  inpreview = false,
  index,
}: ComponentRendererProps) {
  const { gridContextValue: responseTypeJson, componentJson }: any =
    useContext(GridContext);
  const type = (
    responseTypeJson?.components?.[index]?.type ||
    responseTypeJson?.[index]?.type
  )?.toLowerCase();
  const propsPath = componentJson?.components?.[index]?.props;
  const props =
    responseTypeJson?.components?.[index]?.props ||
    responseTypeJson?.[index]?.props;
  const meta =
    responseTypeJson?.components?.[index]?.meta ||
    responseTypeJson?.[index]?.meta;
  const action =
    responseTypeJson?.components?.[index]?.action ||
    responseTypeJson?.[index]?.action;

  const component = componentMap[type] || null;

  if ((component && type === "Button") || type === "ChatBot") {
    return component({
      props,
      componentId,
      inpreview,
      action,
      meta,
      propsPath,
    });
  }

  return component
    ? component({
        props,
        componentId,
        inpreview,
        dragRef,
        action,
        meta,
        propsPath,
      })
    : null;
}

export default React.memo(
  addUrlDataHoc(React.memo(ComponentRenderer), [ParamsEnums?.interfaceId])
);
