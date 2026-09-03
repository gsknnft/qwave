import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/entropy/index.ts"),
      name: "QwaveEntropy",
      formats: ["es", "cjs"],
      fileName: (format) => format === "es" ? "index.mjs" : "index.cjs",
    },
    outDir: "dist/entropy",
    emptyOutDir: true,
    rollupOptions: {
      external: ["@gsknnft/fft-ts"],
    },
  },
});
