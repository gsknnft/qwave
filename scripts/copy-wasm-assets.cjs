const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const copies = [
  {
    label: "wasm runtime",
    source: path.join(projectRoot, "src", "wasmlets", "src", "wasm"),
    dest: path.join(projectRoot, "dist", "wasmlets", "src", "wasm"),
  },
];

for (const { label, source, dest } of copies) {
  if (!fs.existsSync(source)) {
    console.warn(`[copy-wasm-assets] Skipping missing ${label} at ${source}`);
    continue;
  }

  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(source, dest, { recursive: true });
  console.log(`[copy-wasm-assets] Copied ${label} to ${dest}`);
}
