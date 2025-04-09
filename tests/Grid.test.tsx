import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid } from "../src/Grid";
import React from "react";
import { ThemeProvider, EMOTION_CACHE_KEY } from "../src";
import { createTheme } from "@mui/material/styles";
import { setClient, setServer } from "./test-utils";

describe("Grid", () => {
  test("server: renders a basic grid container with correct CSS variables", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Grid container spacing={2} data-testid="grid-container" />
      </ThemeProvider>,
    );

    const gridElement = screen.getByTestId("grid-container");

    // Check basic container props
    expect(gridElement).toBeInTheDocument();

    // Check CSS variables
    expect(gridElement).toHaveStyle({
      "--Grid-columns": "12",
      "--Grid-column-spacing": "2",
      "--Grid-row-spacing": "2",
      display: "flex",
      flexWrap: "wrap",
    });

    // Check the gap style with CSS variables
    const computedStyle = window.getComputedStyle(gridElement);
    expect(computedStyle.gap).toBe(
      "var(--Grid-row-spacing) var(--Grid-column-spacing)",
    );
  });

  test("server: Grid with size prop renders with correct flex and width styles", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Grid size={6} data-testid="grid-item" />
      </ThemeProvider>,
    );

    const gridItem = screen.getByTestId("grid-item");

    // Check CSS variables
    expect(gridItem).toHaveStyle({
      "--Grid-columns": "12",
      "--Grid-size": "6",
    });

    // Test for calculated width using CSS variables
    expect(gridItem).toHaveStyle({
      flex: "0 1 calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
      width: "calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
      maxWidth: "calc(var(--Grid-size) / var(--Grid-columns) * 100%)",
    });
  });

  test("server: Grid with 'auto' size renders correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Grid size="auto" data-testid="auto-grid" />
      </ThemeProvider>,
    );

    const autoGrid = screen.getByTestId("auto-grid");

    expect(autoGrid).toHaveStyle({
      flex: "0 0 auto",
      width: "auto",
      maxWidth: "none",
    });
  });

  test("server: Grid with 'grow' size renders correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Grid size="grow" data-testid="grow-grid" />
      </ThemeProvider>,
    );

    const growGrid = screen.getByTestId("grow-grid");

    expect(growGrid).toHaveStyle({
      flex: "1 1 0",
      width: "unset",
      maxWidth: "100%",
    });
  });

  test("server: Grid with offset renders marginLeft correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Grid offset={2} data-testid="offset-grid" />
      </ThemeProvider>,
    );

    const offsetGrid = screen.getByTestId("offset-grid");

    // Check offset CSS variable
    expect(offsetGrid).toHaveStyle({
      "--Grid-offset": "2",
      marginLeft: "calc(var(--Grid-offset) / var(--Grid-columns) * 100%)",
    });
  });

  test("server: Grid with responsive props generates appropriate style tags", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          direction={{ xs: "column", md: "row" }}
          data-testid="responsive-grid"
        >
          <Grid size={{ xs: 12, md: 6 }} data-testid="responsive-item" />
        </Grid>
      </ThemeProvider>,
    );

    const responsiveGrid = screen.getByTestId("responsive-grid");
    const responsiveItem = screen.getByTestId("responsive-item");

    // Check basic props
    expect(responsiveGrid).toHaveStyle({
      "--Grid-columns": "12",
      display: "flex",
      flexWrap: "wrap",
    });

    // Extract all style tags to check media queries
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent,
    );

    // EMOTION_CACHE_KEY prefix for CSS class names
    const cacheKey = "." + EMOTION_CACHE_KEY + "-";

    // Check for xs breakpoint styles
    const xsMediaQueryPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:0px)") &&
        style?.includes("--Grid-column-spacing:2") &&
        style?.includes("--Grid-row-spacing:2") &&
        style?.includes("flex-direction:column"),
    );
    expect(xsMediaQueryPresent).toBeTruthy();

    // Check for md breakpoint styles
    const mdMediaQueryPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:900px)") &&
        style?.includes("--Grid-column-spacing:4") &&
        style?.includes("--Grid-row-spacing:4") &&
        style?.includes("flex-direction:row"),
    );
    expect(mdMediaQueryPresent).toBeTruthy();

    // Check for responsive styles
    const xsItemStylePresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:0px)") &&
        style?.includes("--Grid-size:12"),
    );
    expect(xsItemStylePresent).toBeTruthy();

    const mdItemStylePresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:900px)") &&
        style?.includes("--Grid-size:6"),
    );
    expect(mdItemStylePresent).toBeTruthy();
  });

  test("server: Grid passes unstable_parent props to children", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Grid container columns={6} spacing={3} data-testid="parent-grid">
          <Grid data-testid="child-grid" />
        </Grid>
      </ThemeProvider>,
    );

    const parentGrid = screen.getByTestId("parent-grid");
    const childGrid = screen.getByTestId("child-grid");

    // Parent should have its own values
    expect(parentGrid).toHaveStyle({
      "--Grid-columns": "6",
      "--Grid-column-spacing": "3",
      "--Grid-row-spacing": "3",
    });

    // Child should inherit parent values
    expect(childGrid).toHaveStyle({
      "--Grid-columns": "6",
      "--Grid-column-spacing": "3",
      "--Grid-row-spacing": "3",
    });
  });

  test("client: uses MUI Grid when in client mode", () => {
    setClient();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Grid container data-testid="client-grid" />
      </ThemeProvider>,
    );

    // On the client side, MUI Grid should be used which applies MuiGrid-root class
    expect(screen.getByTestId("client-grid")).toHaveClass("MuiGrid-root");
    expect(screen.getByTestId("client-grid")).toHaveClass("MuiGrid-container");
  });
});
