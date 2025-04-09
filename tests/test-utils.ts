import "@testing-library/jest-dom/vitest";
import { CONFIGURABLE_IS_SERVER } from "../src";

export const setServer = () => (CONFIGURABLE_IS_SERVER.current = true);

export const setClient = () => (CONFIGURABLE_IS_SERVER.current = false);
