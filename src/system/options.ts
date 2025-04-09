import type { Emotion } from "@emotion/css/create-instance";
import type { Theme } from "@mui/material/styles";
import { supportsReactCache } from "./environment";
import React from "react";

export interface Options {
  /**
   * The Mui theme to use on the server
   */
  theme: Theme;

  /**
   * A cache key for Emotion styles
   */
  emotionKey?: string;

  /**
   * An emotion instance to use
   */
  emotionInstance?: Emotion;

  /**
   * A component to inject styles into the head
   */
  styleInjector?: ({
    headerStyles,
    uniqueClassName,
  }: {
    headerStyles: string;
    uniqueClassName: string;
  }) => React.ReactNode;
}

export const Options = { current: null as unknown as () => Required<Options> };

// Use the cache if the API is available https://react.dev/reference/react/cache
// The advantage is that it isolates each request's theme.
if (supportsReactCache()) {
  Options.current = React.cache(() => ({}) as Required<Options>);
} else {
  const staticOptions = {} as Required<Options>;
  Options.current = () => staticOptions;
}
