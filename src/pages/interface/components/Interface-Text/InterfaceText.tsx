import { Typography, TypographyProps } from "@mui/material";

interface InterfaceTextProps {
  props: TypographyProps | any;
}

function InterfaceText({ props }: InterfaceTextProps) {
  return (
    <Typography key={props?.key} {...props}>
      {props?.children || props?.data || `I'm a text component.`}
    </Typography>
  );
}

export default InterfaceText;
