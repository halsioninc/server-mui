import * as React from "react";
import MuiContainer, {
  type ContainerProps as MuiContainerProps,
} from "@mui/material/Container";
import type { Breakpoint, Theme } from "@mui/material/styles";
import { isServer, serverTheme } from "./system";
import { Base } from "./Base";

export const Container = React.forwardRef((props: MuiContainerProps, ref) => {
  const {
    disableGutters = false,
    fixed = false,
    maxWidth = "lg",
    sx: userSx,
    ...other
  } = props;

  const baseSx = (theme: Theme) => {
    // Basic styles that apply to all containers
    const styles: Record<string, any> = {
      "--Container-maxWidth": "none",
      "--Container-paddingX": disableGutters
        ? 0
        : {
            xs: theme.spacing(2),
            sm: theme.spacing(3),
          },

      // Base container styles
      width: "100%",
      ml: "auto",
      mr: "auto",
      boxSizing: "border-box",
      px: "var(--Container-paddingX)",
    };

    // Handle maxWidth for xs specially
    if (maxWidth === "xs") {
      const xsValue = Math.max(theme.breakpoints.values.xs, 444);
      styles.maxWidth = {
        xs: `${xsValue}${theme.breakpoints.unit}`,
      };
    }
    // Handle other maxWidth values
    else if (maxWidth) {
      styles.maxWidth = {
        [maxWidth]: `${theme.breakpoints.values[maxWidth]}${theme.breakpoints.unit}`,
      };
    }

    // Handle fixed width
    if (fixed) {
      const fixedMaxWidth: Partial<Record<Breakpoint, string>> = {};
      theme.breakpoints.keys.forEach((breakpoint) => {
        if (breakpoint !== "xs") {
          const value = theme.breakpoints.values[breakpoint];
          fixedMaxWidth[breakpoint as Breakpoint] =
            `${value}${theme.breakpoints.unit}`;
        }
      });

      styles.maxWidth = {
        ...styles.maxWidth,
        ...fixedMaxWidth,
      };
    }

    return styles;
  };

  // Merge base styles with user-provided sx
  const mergedSx = (theme: Theme) => ({
    ...baseSx(theme),
    ...(typeof userSx === "function" ? userSx(theme) : userSx),
  });

  return isServer() ? (
    <Base {...other} sx={mergedSx(serverTheme())} ref={ref as never} />
  ) : (
    <MuiContainer {...props} ref={ref as never} />
  );
});

export default Container;
