import { defineConfig } from "tsdown";

export default defineConfig({
	attw: { level: "error", profile: "esm-only" },
	deps: { neverBundle: true },
	entry: ["src/index.ts"],
	publint: true,
});
