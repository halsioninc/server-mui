import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { registerTheme, styled } from "../../src";
import React from "react";
import { createTheme } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import { setClient, setServer } from "../test-utils";

describe("styled", () => {
  test("server: renders with inline styles", () => {
    setServer();

    registerTheme({ theme: createTheme({ shape: { borderRadius: 5 } }) });
    const TestButton = styled(MuiButton)(({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
    }));

    render(<TestButton data-testid="server-btn">Test</TestButton>);

    expect(screen.getByTestId("server-btn")).toHaveStyle("border-radius: 5px");
  });

  test("client: uses Emotion classes", () => {
    setClient();

    const TestButton = styled(MuiButton)(({ theme }) => ({
      borderRadius: theme.shape.borderRadius || "8px",
    }));
    render(<TestButton data-testid="client-btn">Test</TestButton>);

    expect(screen.getByTestId("client-btn")).toHaveClass("MuiButton-root");
  });
});
