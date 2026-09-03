import { defineConfig } from "vite";
import path from "path";

/**
 * ESM-only library build.
 *
 * Previously this emitted es + cjs + umd + iife, and a SEPARATE rollup pass
 * (`build:umd`) re-bundled `dist/lib/wt.js` into UMD/es5. Nothing consumed any
 * of it: @gsknnft/qwave imports this package from SOURCE
 * (`./discrete-wavelets/src/wt`), and no other package references the built
 * artifacts at all. The rollup pass existed only to break deploys — it needed
 * `dist/lib/*.js` from a full `tsc` emit, which silently produced nothing
 * whenever `composite: true` found a stale tsbuildinfo.
 *
 * This file also used to `import ts from "./tsconfig.json"` to derive path
 * aliases. tsconfig.json has no `paths`, so it computed an empty array — while
 * making the build depend on that file being parseable as STRICT JSON by
 * rolldown. A `//` comment in tsconfig.json (legal for tsc) was therefore a
 * hard build failure here. The coupling is gone.
 */
const externalDeps = [
  "fs", "path", "os", "http", "https", "stream", "zlib",
  "events", "buffer", "util", "crypto", "child_process", "readline",
];

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    outDir: "dist",
    rollupOptions: {
      external: externalDeps,
    },
  },
});
