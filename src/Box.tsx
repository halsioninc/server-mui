import * as React from "react";
import MuiBox, { type BoxProps as MuiBoxProps } from "@mui/material/Box";
import { isServer } from "./system";
import { styled } from "./styles";

const ServerBox = styled(
  React.forwardRef<HTMLElement, MuiBoxProps>((props, ref) => {
    const { component: Component = "div", ...rest } = props;

    return <Component {...rest} ref={ref} />;
  }),
)();

export const Box = React.forwardRef((props: MuiBoxProps, ref) => {
  return isServer() ? (
    <ServerBox {...props} ref={ref as never} />
  ) : (
    // Call the default Mui Box with all props
    <MuiBox {...props} ref={ref as never} />
  );
}) as typeof MuiBox;

export default Box;
