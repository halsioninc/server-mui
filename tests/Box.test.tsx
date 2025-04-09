import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "../src/Box";
import React from "react";
import { EMOTION_CACHE_KEY, registerTheme, ThemeProvider } from "../src";
import { createTheme } from "@mui/material/styles";
import { setClient, setServer } from "./test-utils";

describe("Box", () => {
  test("server: renders native element with inline styles", () => {
    setServer();

    const { container } = render(
      <ThemeProvider theme={createTheme({})}>
        <Box component="section" sx={{ p: 2, color: "red" }} />
      </ThemeProvider>,
    );

    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({
      padding: "16px",
      color: "rgb(255, 0, 0)",
    });
  });

  test("server: renders theme vars styles", () => {
    setServer();

    registerTheme({
      theme: createTheme({
        cssVariables: true,
        spacing: 5,
        palette: { primary: { main: "#000" }, secondary: { main: "#fff" } },
      }),
    });
    const { container } = render(
      <Box
        component="section"
        sx={{
          p: (theme) => theme.spacing(2),
          color: (theme) => {
            return (theme as any).vars.palette.secondary.main;
          },
        }}
      />,
    );

    expect(container.querySelector("section")).toBeInTheDocument();

    expect(container.firstChild).toHaveStyle({
      color: "var(--mui-palette-secondary-main, #fff)",
      padding: "calc(2 * var(--mui-spacing, 5px))",
    });
  });

  test("server: renders breakpoints", async () => {
    setServer();

    render(
      <ThemeProvider theme={createTheme({})}>
        <Box component="section" sx={{ p: 1, m: { xs: 2, md: 3 } }}>
          Box Value
        </Box>
      </ThemeProvider>,
    );

    const value = screen.getByText("Box Value");
    expect(value).toHaveStyle({ padding: "8px" });

    const styles = [...document.querySelectorAll("style")].map(
      (v) => v.textContent,
    );
    const cacheKey = "." + EMOTION_CACHE_KEY + "-";
    expect(
      styles.some((v) => v?.includes(cacheKey) && v.includes("{padding:8px;}")),
    ).toBeTruthy();
    expect(
      styles.some(
        (v) =>
          v?.includes(cacheKey) &&
          v.includes("@media (min-width:0px){") &&
          v.includes("{margin:16px;}"),
      ),
    ).toBeTruthy();
    expect(
      styles.some(
        (v) =>
          v?.includes(cacheKey) &&
          v.includes("@media (min-width:900px){") &&
          v.includes("{margin:24px;}"),
      ),
    ).toBeTruthy();
  });

  test("client: uses MUI Box with className", () => {
    setClient();
    render(
      <ThemeProvider theme={createTheme({})}>
        <Box data-testid="client-box" sx={{ m: 1 }} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("client-box")).toHaveClass("MuiBox-root");
  });
});
