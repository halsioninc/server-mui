import * as React from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { Options, isServer, registerTheme } from "../system";
import { ThemeProviderProps } from "@mui/system";

export const ThemeProvider = <Theme,>({
  options,
  ...muiProps
}: { options?: Omit<Options, "theme"> } & ThemeProviderProps<Theme>) => {
  if (isServer()) {
    // Initialize theme cache
    registerTheme({ ...options, theme: muiProps.theme as never });

    return <>{muiProps.children}</>;
  }

  // Call the default mui ThemeProvider with all arguments
  return <MuiThemeProvider {...muiProps} />;
};

export default ThemeProvider;
