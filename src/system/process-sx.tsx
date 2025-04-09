import * as React from "react";
import { unstable_styleFunctionSx as styleFunctionSx } from "@mui/system";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { EMOTION_CACHE_KEY, isServer } from "./environment";
import createInstance from "@emotion/css/create-instance";
import createCache from "@emotion/cache";
import { Options } from "./options";
import { DefaultStyleInjector } from "./style-injector";

/**
 * A processoor to convert sx props into css
 */
export const SxProcessor = {
  setTheme: (optionsInput: Options) => {
    const optionsContext = Options.current();

    optionsContext.theme = optionsInput.theme;
    optionsContext.styleInjector =
      optionsInput.styleInjector ?? DefaultStyleInjector;

    // The emotion instance should only be created once, to prevent class
    // hash clashes
    optionsContext.emotionKey ??= optionsInput.emotionKey || EMOTION_CACHE_KEY;
    optionsContext.emotionInstance ??=
      optionsInput.emotionInstance ??
      createInstance(createCache({ key: optionsContext.emotionKey }));
  },

  getTheme: () => Options.current().theme,

  /**
   * Creates a unique emotion className for a given style
   */
  createClassName: (styleObject: Record<string, unknown>) => {
    const { emotionInstance } = Options.current();

    let cssClassName = undefined,
      cssString = undefined;

    if (Object.keys(styleObject).length) {
      cssClassName = emotionInstance.css(styleObject as never);

      cssString =
        emotionInstance.cache.inserted[
          cssClassName.substring(Options.current().emotionKey.length + 1)
        ];
    }

    return { cssClassName, cssString };
  },

  get: (sx: unknown) => {
    const theme = isServer() ? Options.current().theme : useMuiTheme();

    const styleObject = styleFunctionSx({ sx, theme }) ?? {};

    return {
      styleObject,
      ...SxProcessor.createClassName(styleObject),
    };
  },
};
