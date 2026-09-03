import { defineConfig } from "vite";
import path from "path";
import ts from "./tsconfig.json";

const externalDeps = [
  "fs", "path", "os", "http", "https", "stream", "zlib",
  "events", "buffer", "util", "crypto", "child_process", "readline",
  "wasmlets", "discrete-wavelets", "@gsknnft/fft-ts" // Include wasmlets and its bridge as externals
  // keep only runtime externals here
];

const tsPaths =
  ts.compilerOptions && "paths" in ts.compilerOptions && ts.compilerOptions.paths
    ? Object.keys(ts.compilerOptions.paths).map(key => key.replace("/*", ""))
    : [];

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "Qwave",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => {
        if (format === "es") return "index.js";
        if (format === "cjs") return "index.cjs";
        if (format === "umd") return "index.umd.js";
        if (format === "iife") return "index.iife.js";
        return `index.${format}.js`;
      }
    },
    outDir: "dist",
    rollupOptions: {
      external: [...externalDeps, ...tsPaths ],

    },
  },
});
