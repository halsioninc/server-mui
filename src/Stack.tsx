import * as React from "react";
import MuiStack, {
  type StackProps as MuiStackProps,
} from "@mui/material/Stack";
import { isServer, serverTheme } from "./system";
import { Theme } from "@mui/material/styles";
import { Base } from "./Base";

/**
 * Combines an array of child components with a divider separating them
 */
const joinChildren = (
  children: React.ReactNode,
  divider: React.ReactElement,
) => {
  const childrenArray = React.Children.toArray(children).filter(Boolean);

  return childrenArray.reduce((output: React.ReactNode[], child, index) => {
    output.push(child);

    if (index < childrenArray.length - 1) {
      output.push(React.cloneElement(divider, { key: `divider-${index}` }));
    }

    return output;
  }, []);
};

export const Stack = React.forwardRef((props: MuiStackProps, ref) => {
  const {
    children,
    spacing = 0,
    direction = "column",
    divider,
    sx,
    ...other
  } = props;

  const baseSx = {
    display: "flex",
    flexDirection: direction,
    gap: spacing,
  };

  const mergedSx = (theme: Theme) => ({
    ...baseSx,
    ...(typeof sx === "function" ? sx(theme) : sx),
  });

  if (isServer()) {
    return (
      <Base {...other} sx={mergedSx(serverTheme())} ref={ref as never}>
        {divider
          ? joinChildren(children, divider as React.ReactElement)
          : children}
      </Base>
    );
  }

  return <MuiStack {...props} ref={ref as never} />;
});

export default Stack;
