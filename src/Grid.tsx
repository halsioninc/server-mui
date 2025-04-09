import * as React from "react";
import MuiGrid, { type GridProps as MuiGridProps } from "@mui/material/Grid";
import { isServer, serverTheme } from "./system";
import { Base } from "./Base";
import type { Theme } from "@mui/material/styles";

/**
 * These props are used to pass parent context down to child components.
 */
interface GridContextProps {
  unstable_parent_columns?: MuiGridProps["columns"];
  unstable_parent_column_spacing?: MuiGridProps["spacing"];
  unstable_parent_row_spacing?: MuiGridProps["spacing"];
}

const isGridComponent = (element: React.ReactElement) => {
  return element.type === Grid;
};

export const Grid = React.forwardRef(
  (props: MuiGridProps & GridContextProps, ref) => {
    const {
      children,
      columns,
      spacing,
      columnSpacing,
      rowSpacing,
      direction = "row",
      container = false,
      size,
      offset,
      wrap = "wrap",
      sx: userSx,
      unstable_parent_columns,
      unstable_parent_column_spacing,
      unstable_parent_row_spacing,
      ...other
    } = props;

    // Determine effective values based on props and parent context
    const selfColumns = columns ?? unstable_parent_columns ?? 12;
    const selfColumnSpacing =
      columnSpacing ?? spacing ?? unstable_parent_column_spacing ?? 0;
    const selfRowSpacing =
      rowSpacing ?? spacing ?? unstable_parent_row_spacing ?? 0;

    const baseSx = {
      // CSS variables to capture parent context
      "--Grid-columns": selfColumns,
      "--Grid-column-spacing": selfColumnSpacing,
      "--Grid-row-spacing": selfRowSpacing,

      // Container styles
      ...(container && {
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap,
        gap: "var(--Grid-row-spacing) var(--Grid-column-spacing)",
        width: "100%", // Added to ensure container takes full width
      }),

      // Item styles
      ...(size !== undefined && {
        // For "grow" and "auto" values
        ...(size === "grow" && {
          flex: "1 1 0",
          width: "unset",
          maxWidth: "100%",
        }),
        ...(size === "auto" && {
          flex: "0 0 auto",
          width: "auto",
          maxWidth: "none",
        }),

        // For numeric values and responsive objects
        ...(size !== "grow" &&
          size !== "auto" && {
            "--Grid-size": size,
            flex: "0 1 calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
            width: "calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
            maxWidth: "calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
          }),
      }),

      // Offset styles
      ...(offset !== undefined && {
        "--Grid-offset": offset,
        marginLeft: "calc(var(--Grid-offset) / var(--Grid-columns) * 100%)",
      }),
    };

    // Merge base styles with user-provided sx
    const mergedSx = (theme: Theme) => ({
      ...baseSx,
      ...(typeof userSx === "function" ? userSx(theme) : userSx),
    });

    if (isServer()) {
      return (
        <Base {...other} sx={mergedSx(serverTheme())} ref={ref as never}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && isGridComponent(child)) {
              // Pass parent context to child Grid components
              return React.cloneElement(
                child as React.ReactElement<MuiGridProps & GridContextProps>,
                {
                  unstable_parent_columns: selfColumns,
                  unstable_parent_column_spacing: selfColumnSpacing,
                  unstable_parent_row_spacing: selfRowSpacing,
                },
              );
            }
            return child;
          })}
        </Base>
      );
    }

    // Client-side rendering uses MUI's Grid directly
    return <MuiGrid {...props} ref={ref as never} />;
  },
);

export default Grid;
