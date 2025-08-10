/// <reference types="node" />

import { defineConfig } from "tsup";
import * as fs from "fs";
import * as path from "path";

const SRC_CSS = path.resolve(__dirname, "src/theme/global.css");
const OUT_INJECT_TS = path.resolve(__dirname, "src/styles/injectTokens.ts");
const DIST_CSS = path.resolve(__dirname, "dist/index.css");

function minifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*;\s*/g, ";")
    .trim();
}
function ensureDir(p: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}
function generateInjectFromGlobalCss() {
  if (!fs.existsSync(SRC_CSS)) {
    console.error("[ld:tokens] Missing:", SRC_CSS);
    return;
  }
  const raw = fs.readFileSync(SRC_CSS, "utf8");
  const css = minifyCss(raw);

  const code = `// AUTO-GENERATED FROM global.css — DO NOT EDIT MANUALLY
(function injectLDTokens(){
  if (typeof document === "undefined") return; // SSR guard
  var DOC = document;
  var STYLE_ID = "ld-design-tokens";
  if (DOC.getElementById(STYLE_ID)) return;
  var el = DOC.createElement("style");
  el.id = STYLE_ID;
  el.textContent = ${JSON.stringify(css)};
  DOC.head.appendChild(el);
})();\n`;

  ensureDir(OUT_INJECT_TS);
  fs.writeFileSync(OUT_INJECT_TS, code, "utf8");
  console.log("[ld:tokens] Wrote injector:", path.relative(process.cwd(), OUT_INJECT_TS));
}
function copyGlobalCssToDist() {
  if (!fs.existsSync(SRC_CSS)) return;
  ensureDir(DIST_CSS);
  fs.copyFileSync(SRC_CSS, DIST_CSS);
  console.log("[ld:tokens] Copied CSS to:", path.relative(process.cwd(), DIST_CSS));
}

const tokensPlugin = {
  name: "ld-tokens-plugin",
  setup(build: any) {
    build.onStart(() => {
      generateInjectFromGlobalCss();
    });
    build.onEnd(() => {
      copyGlobalCssToDist(); // опционално
    });
  },
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [tokensPlugin],
});
