import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, Box } from "../../src";
import React from "react";
import { createTheme } from "@mui/material";
import { setClient, setServer } from "../test-utils";

describe("ServerThemeProvider", () => {
  test("server: injects theme variables", () => {
    setServer();

    render(
      <ThemeProvider
        theme={createTheme({
          palette: { primary: { main: "rgb(255, 255, 255)" } },
        })}
      >
        <Box data-testid="test-box" sx={{ color: "primary.main" }} />
      </ThemeProvider>,
      { container: document.documentElement },
    );

    const html = document.documentElement.innerHTML;
    expect(html).toContain("rgb(255, 255, 255)");
    expect(html).not.toContain("MuiBox");
  });

  test("client: provides theme context", () => {
    setClient();

    render(
      <ThemeProvider theme={createTheme()}>
        <Box data-testid="client-box" sx={{ p: 2 }} />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("client-box")).toHaveStyle("padding: 16px");
    const html = document.documentElement.innerHTML;
    expect(html).toContain("MuiBox");
  });
});
