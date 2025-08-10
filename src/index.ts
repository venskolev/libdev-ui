// side-effect import: tokens CSS се зарежда автоматично при import на пакета
import "./styles/injectTokens"; // ensures --ld-* exist at runtime

// src/index.ts
export * from "./components";
