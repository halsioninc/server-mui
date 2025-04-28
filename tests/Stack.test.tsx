import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack } from "../src/Stack";
import React from "react";
import { ThemeProvider, EMOTION_CACHE_KEY } from "../src";
import { createTheme } from "@mui/material/styles";
import { setClient, setServer } from "./test-utils";

describe("Stack", () => {
  test("server: renders a basic stack with correct flex direction", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack direction="column" data-testid="stack-container" />
      </ThemeProvider>,
    );

    const stackElement = screen.getByTestId("stack-container");

    // Check basic container props
    expect(stackElement).toBeInTheDocument();

    // Check flex styles
    expect(stackElement).toHaveStyle({
      display: "flex",
      flexDirection: "column",
    });
  });

  test("server: Stack with spacing renders with correct gap style", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack spacing={2} data-testid="stack-with-spacing" />
      </ThemeProvider>,
    );

    const stackElement = screen.getByTestId("stack-with-spacing");

    // Check gap style
    expect(stackElement).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    });
  });

  test("server: Stack with row direction renders correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Stack direction="row" data-testid="row-stack" />
      </ThemeProvider>,
    );

    const rowStack = screen.getByTestId("row-stack");

    expect(rowStack).toHaveStyle({
      display: "flex",
      flexDirection: "row",
    });
  });

  test("server: Stack with divider renders children with dividers between them", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack
          divider={<div data-testid="divider" />}
          data-testid="stack-with-divider"
        >
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Stack>
      </ThemeProvider>,
    );

    // Check all children and dividers are present
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();

    // There should be 2 dividers (between 3 children)
    const dividers = screen.getAllByTestId("divider");
    expect(dividers).toHaveLength(2);
  });

  test("server: Stack with responsive props generates appropriate style tags", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Stack
          spacing={{ xs: 1, md: 2 }}
          direction={{ xs: "column", md: "row" }}
          data-testid="responsive-stack"
        >
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      </ThemeProvider>,
    );

    const responsiveStack = screen.getByTestId("responsive-stack");

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
        style?.includes("gap:8px") &&
        style?.includes("flex-direction:column"),
    );
    expect(xsMediaQueryPresent).toBeTruthy();

    // Check for md breakpoint styles
    const mdMediaQueryPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:900px)") &&
        style?.includes("gap:16px") &&
        style?.includes("flex-direction:row"),
    );
    expect(mdMediaQueryPresent).toBeTruthy();
  });

  test("server: Stack passes sx props correctly", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack
          sx={{ bgcolor: "primary.main", p: 2 }}
          data-testid="stack-with-sx"
        />
      </ThemeProvider>,
    );

    const stackElement = screen.getByTestId("stack-with-sx");

    // Check sx props applied correctly
    expect(stackElement).toHaveStyle({
      backgroundColor: "rgb(25, 118, 210)", // primary.main color
      padding: "16px", // p: 2 = 16px
    });
  });

  test("client: uses MUI Stack when in client mode", () => {
    setClient();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Stack data-testid="client-stack" />
      </ThemeProvider>,
    );

    // On the client side, MUI Stack should be used which applies MuiStack class
    expect(screen.getByTestId("client-stack")).toHaveClass("MuiStack-root");
  });

  test("server: Stack with empty divider renders children without dividers", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack data-testid="stack-no-divider">
          <div data-testid="item-1">Item 1</div>
          <div data-testid="item-2">Item 2</div>
        </Stack>
      </ThemeProvider>,
    );

    const items = screen.getAllByTestId(/item-/);
    expect(items).toHaveLength(2);

    // Stack should only contain the two items without any dividers
    const stack = screen.getByTestId("stack-no-divider");
    expect(stack.childNodes).toHaveLength(2);
  });

  test("server: Stack filters out falsy children", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Stack
          divider={<div data-testid="divider" />}
          data-testid="stack-with-falsy"
        >
          <div data-testid="item-1">Item 1</div>
          {null}
          {false}
          <div data-testid="item-2">Item 2</div>
          {undefined}
        </Stack>
      </ThemeProvider>,
    );

    // Only two real items should be rendered
    const items = screen.getAllByTestId(/item-/);
    expect(items).toHaveLength(2);

    // And only one divider (between the two items)
    const dividers = screen.getAllByTestId("divider");
    expect(dividers).toHaveLength(1);
  });
});
