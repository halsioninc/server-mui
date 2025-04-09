import * as React from "react";
import MuiBox, { type BoxProps as MuiBoxProps } from "@mui/material/Box";
import { isServer } from "./system";
import { Base } from "./Base";

export const Box = React.forwardRef((props: MuiBoxProps, ref) => {
  return isServer() ? (
    <Base {...props} ref={ref as never} />
  ) : (
    // Call the default Mui Box with all props
    <MuiBox {...props} ref={ref as never} />
  );
}) as typeof MuiBox;

export default Box;
