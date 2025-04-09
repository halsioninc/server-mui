import * as React from "react";
import type { BoxProps as MuiBoxProps } from "@mui/material/Box";
import { styled } from "./styles";

/**
 * A base styled component to use in all components.
 * Defaults to "div"
 */
export const Base = styled(
  React.forwardRef<HTMLElement, MuiBoxProps>((props, ref) => {
    const { component: Component = "div", ...rest } = props;

    return <Component {...rest} ref={ref} />;
  }),
)();
