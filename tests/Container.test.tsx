import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "../src/Container";
import React from "react";
import { ThemeProvider } from "../src";
import { createTheme } from "@mui/material/styles";
import { setClient, setServer } from "./test-utils";

describe("Container", () => {
  test("server: renders a basic container with correct styles", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Container data-testid="basic-container">Content</Container>
      </ThemeProvider>
    );

    const containerElement = screen.getByTestId("basic-container");

    // Check basic container props
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveTextContent("Content");

    // Check basic styles
    expect(containerElement).toHaveStyle({
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      boxSizing: "border-box"
    });
  });

  test("server: applies correct padding when not disableGutters", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container disableGutters={false} data-testid="with-gutters">Content</Container>
      </ThemeProvider>
    );

    // Extract all style tags to check for padding styles
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent
    );

    // Check for padding variables in the base styles
    const hasPaddingVars = styles.some(
      (style) =>
        style?.includes("padding-left:var(--Container-paddingX)") &&
        style?.includes("padding-right:var(--Container-paddingX)")
    );
    expect(hasPaddingVars).toBeTruthy();

    // Check for xs breakpoint padding styles
    const xsPaddingStylePresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:0px)") &&
        style?.includes("--Container-paddingX:16px")
    );
    expect(xsPaddingStylePresent).toBeTruthy();

    // Check for sm breakpoint padding styles
    const smPaddingStylePresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:600px)") &&
        style?.includes("--Container-paddingX:24px")
    );
    expect(smPaddingStylePresent).toBeTruthy();
  });

  test("server: respects disableGutters prop", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container disableGutters={true} data-testid="no-gutters">Content</Container>
      </ThemeProvider>
    );
    
    // Extract all style tags
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent
    );

    // Check for zero padding using CSS variables
    const zeroPaddingPresent = styles.some(
      (style) => style?.includes("--Container-paddingX:0")
    );
    expect(zeroPaddingPresent).toBeTruthy();
    
    // Make sure there are no non-zero padding values for this container
    const noNormalPaddingForThisContainer = !styles.some(
      (style) =>
        style?.includes("--Container-paddingX:16px") &&
        style?.includes(screen.getByTestId("no-gutters").className)
    );
    expect(noNormalPaddingForThisContainer).toBeTruthy();
  });

  test("server: applies fixed width styles correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container fixed data-testid="fixed-container">Content</Container>
      </ThemeProvider>
    );

    // Extract all style tags to check for fixed width styles
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent
    );

    // Check for sm breakpoint fixed width
    const smFixedWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:600px)") &&
        style?.includes("max-width:600px")
    );
    expect(smFixedWidthPresent).toBeTruthy();

    // Check for md breakpoint fixed width
    const mdFixedWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:900px)") &&
        style?.includes("max-width:900px")
    );
    expect(mdFixedWidthPresent).toBeTruthy();

    // Check for lg breakpoint fixed width
    const lgFixedWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:1200px)") &&
        style?.includes("max-width:1200px")
    );
    expect(lgFixedWidthPresent).toBeTruthy();

    // Check for xl breakpoint fixed width
    const xlFixedWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:1536px)") &&
        style?.includes("max-width:1536px")
    );
    expect(xlFixedWidthPresent).toBeTruthy();
  });

  test("server: respects maxWidth prop", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container maxWidth="md" data-testid="md-container">Content</Container>
      </ThemeProvider>
    );

    // Extract all style tags to check for maxWidth styles
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent
    );

    // Check for md breakpoint max-width
    const mdMaxWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:900px)") &&
        style?.includes("max-width:900px")
    );
    expect(mdMaxWidthPresent).toBeTruthy();
  });

  test("server: handles xs maxWidth correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container maxWidth="xs" data-testid="xs-container">Content</Container>
      </ThemeProvider>
    );

    // Extract all style tags to check for xs maxWidth styles
    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent
    );

    // Check for xs special handling (should be at least 444px)
    const xsMaxWidthPresent = styles.some(
      (style) =>
        style?.includes("@media (min-width:0px)") &&
        style?.includes("max-width:444px")
    );
    expect(xsMaxWidthPresent).toBeTruthy();
  });

  test("server: applies custom sx props correctly", () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container 
          sx={{ backgroundColor: "primary.main", mt: 2 }}
          data-testid="sx-container"
        >
          Content
        </Container>
      </ThemeProvider>
    );

    const containerElement = screen.getByTestId("sx-container");

    // Check for the sx props being applied
    expect(containerElement).toHaveStyle({
      backgroundColor: "rgb(25, 118, 210)", // primary.main in default theme
      marginTop: "16px",
    });
  });

  test("client: uses MUI Container when in client mode", () => {
    setClient();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Container data-testid="client-container">Content</Container>
      </ThemeProvider>
    );

    // On the client side, MUI Container should be used which applies MuiContainer-root class
    expect(screen.getByTestId("client-container")).toHaveClass("MuiContainer-root");
  });
});