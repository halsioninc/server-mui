import { SxProcessor } from "./process-sx";

export * from "./environment";
export * from "./options";

/**
 * Converts an sxProp into a style prop
 */
export const processSx = SxProcessor.get;

/**
 * Sets the theme used to process sxProps
 */
export const registerTheme = SxProcessor.setTheme;

/**
 * Retrieves the current theme
 */
export const useTheme = SxProcessor.getTheme;

/**
 * An additional theme getter, incase you prefer not to use
 * react hooks in Server Components
 */
export const serverTheme = useTheme;
