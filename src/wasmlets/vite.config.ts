import { defineConfig } from "vite";
import path from "path";
import ts from "./tsconfig.json";

const externalDeps = [
  "fs", "path", "os", "http", "https", "stream", "zlib",
  "events", "buffer", "util", "crypto", "child_process", "readline",
  // keep only runtime externals here
];

const tsPaths =
  ts.compilerOptions && "paths" in ts.compilerOptions && ts.compilerOptions.paths
    ? Object.keys(ts.compilerOptions.paths).map(key => key.replace("/*", ""))
    : [];

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "wasmlets",
      formats: ["es", "cjs", "umd", "iife", "system"],
      fileName: (format) => {
        if (format === "es") return "index.js";
        if (format === "cjs") return "index.cjs";
        if (format === "umd") return "index.umd.js";
        if (format === "iife") return "index.iife.js";
        if (format === "system") return "index.system.js";
        return `index.${format}.js`;
      }
    },
    rollupOptions: {
      external: [...externalDeps, ...tsPaths],
    },
  },
});