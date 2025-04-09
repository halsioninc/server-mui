import React from "react";

/**
 * Whether we are on the server.
 * Exported so it can be optionally dynamically set by users of this library
 */
export const CONFIGURABLE_IS_SERVER = {
  current: typeof window === "undefined",
};

export const EMOTION_CACHE_KEY = "sui";

export const isServer = () => CONFIGURABLE_IS_SERVER.current;

export const isClient = () => !isServer();

export const isTest = () =>
  typeof process !== "undefined" && process?.env?.NODE_ENV === "test";

export const supportsReactCache = () => isServer() && Boolean(React.cache);

export const supportsHeaderStyles = () =>
  (Number(React.version.split(".")[0]) || 19) >= 19;
