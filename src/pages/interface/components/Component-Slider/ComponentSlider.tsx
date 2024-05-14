import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import "./ComponentSlider.scss";
import {
  RadioIcon,
  TextIcon,
  CalenderIcon,
  CheckboxIcon,
  DropDownIcon,
  FormIcon,
  InputIcon,
  AccordionIcon,
} from "../../assests/InterfaceAssests.tsx";

interface ComponentSliderProps {
  dragRef: React.MutableRefObject<any>;
}

function ButtonComponent() {
  return (
    <div draggable className="">
      <Button variant="contained">Button</Button>
    </div>
  );
}

function IconComponent() {
  return (
    <div draggable className="flex-center-center">
      <Avatar
        alt="Remy Sharp"
        src="https://cdn2.hubspot.net/hubfs/53/image8-2.jpg"
        sx={{ width: 50, height: 50 }}
      />
    </div>
  );
}
function BoxComponent() {
  return (
    <div draggable className="flex-center-center">
      <Box className="border-1 p-3 py-4">
        <Typography variant="h5">Box</Typography>
      </Box>
    </div>
  );
}
function DividerComponent() {
  return (
    <div draggable className="flex-center-center">
      Divider
    </div>
  );
}
function TableComponent() {
  return (
    <div draggable className="flex-center-center">
      Table
    </div>
  );
}

function ComponentSlider({ dragRef }: ComponentSliderProps) {
  const onDragStart = (event: React.DragEvent, type: any) => {
    event.dataTransfer.setData("text/plain", "");
    dragRef.current = type;
  };

  const renderComponent = ({ type }: any) => {
    return (
      <div draggable className="image_container">
        <img
          src={componentIconMapping[type]}
          alt="RadioIcon"
          className="h-100"
        />
      </div>
    );
  };

  const componentIconMapping: any = useMemo(
    () => ({
      TextField: InputIcon,
      Form: FormIcon,
      Button: ButtonComponent,
      Select: DropDownIcon,
      Typography: TextIcon,
      Icon: IconComponent,
      Checkbox: CheckboxIcon,
      DatePicker: CalenderIcon,
      Accordion: AccordionIcon,
      Radio: RadioIcon,
      Box: BoxComponent,
      Divider: DividerComponent,
      Table: TableComponent,
    }),
    []
  );

  const elementJson: any = useMemo(
    () => ({
      TextField: renderComponent,
      Form: renderComponent,
      Button: ButtonComponent,
      Select: renderComponent,
      Typography: renderComponent,
      Icon: IconComponent,
      Checkbox: renderComponent,
      DatePicker: renderComponent,
      Accordion: renderComponent,
      Radio: renderComponent,
      Box: BoxComponent,
      Divider: DividerComponent,
      Table: TableComponent,
    }),
    []
  );

  return (
    <Box className="component_slider box-sizing-border-box overflow-scroll-y">
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 0.5, sm: 0.75, md: 1 }}
        spacing={1}
      >
        {Object.keys(elementJson).map((type) => {
          const Element = elementJson[type];
          return (
            <Grid
              item
              xs={6}
              key={type}
              className="box-sizing-border-box child_grid"
              onDragStart={(e) => onDragStart(e, type)}
            >
              <Card draggable className="flex-col card_box">
                <CardContent className="h-100 flex-center-center card_content bg-white">
                  <Element key={type} type={type} />
                </CardContent>
                <CardActions className="flex-center-center card_bottom_container">
                  <Typography variant="h7">{type}</Typography>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ComponentSlider;
