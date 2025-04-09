import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-preserve-directives";
import { glob } from "glob";

export default {
  input: glob.sync("src/**/index.ts"),
  output: [
    {
      dir: "lib/cjs",
      format: "cjs",
      preserveModules: true,
      exports:"named",
      entryFileNames: "[name].cjs",
    },
    {
      dir: "lib",
      format: "esm",
      preserveModules: true,
      exports:"named",
      entryFileNames: "[name].mjs",
    },
  ],
  plugins: [typescript(), preserveDirectives()],
};
