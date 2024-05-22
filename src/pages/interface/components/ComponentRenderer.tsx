import React, { useContext } from "react";
import "../Interface.scss";
import InterfaceDropdown from "./Interface-DropDown/InterfaceDropdown.tsx";
import InterfaceButton from "./Interface-Button/InterfaceButton.tsx";
import InterfaceTextfield from "./Interface-TextField/InterfaceTextfield.tsx";
import InterfaceDivider from "./Interface-Divider/InterfaceDivider.tsx";
import InterfaceText from "./Interface-Text/InterfaceText.tsx";
import InterfaceLink from "./Interface-Link/InterfaceLink.tsx";
import InterfaceBox from "./Interface-Box/InterfaceBox.tsx";
import InterfaceCheckbox from "./Interface-Checkbox/InterfaceCheckbox.tsx";
import InterfaceForm from "./Interface-Form/InterfaceForm.tsx";
import InterfaceChatbot from "./Interface-Chatbot/InterfaceChatbot.tsx";
import Interfacedatepicker from "./InterfaceDatepicker/Interfacedatepicker.tsx";
import InterfaceRadio from "./InterfaceRadio/InterfaceRadio.tsx";
import InterfaceIcon from "./Interface-Icon/InterfaceIcon.tsx";
import InterfaceAccordion from "./Interface-Accordion/InterfaceAccordion.tsx";
import InterfaceTable from "./Interface-Table/InterfaceTable.tsx";
import { useCustomSelector } from "../../../utils/deepCheckSelector";
import { $ReduxCoreType } from "../../../types/reduxCore.ts";
import { ParamsEnums } from "../../../enums";
import addUrlDataHoc from "../../../hoc/addUrlDataHoc.tsx";
import { GridContext } from "./Grid/Grid.tsx";

interface ComponentRendererProps {
  gridId?: string;
  id?: string;
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
};

function ComponentRenderer({
  gridId,
  id: componentId,
  dragRef,
  inpreview = false,
  interfaceId,
}: ComponentRendererProps) {
  const responseTypeJson = useContext(GridContext);

  const componentData = useCustomSelector(
    (state: $ReduxCoreType) =>
      state.Interface?.interfaceData?.[interfaceId]?.responseTypes?.[gridId]
        ?.components?.[componentId]
  );
  const { type, props, key, action } = componentData;
  const commonProps = {
    ...(responseTypeJson?.[componentId]?.props || { ...props }),
    key,
  };
  const component = componentMap[type] || null;

  if ((component && type === "Button") || type === "ChatBot") {
    return component({
      props: commonProps,
      gridId,
      componentId,
      action,
      inpreview,
    });
  }

  return component
    ? component({
        props: commonProps,
        gridId,
        componentId,
        action,
        inpreview,
        dragRef,
      })
    : null;
}

export default React.memo(
  addUrlDataHoc(React.memo(ComponentRenderer), [ParamsEnums?.interfaceId])
);
