import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		level: "error",
		profile: "esm-only",
	},
	deps: {
		neverBundle: true,
	},
	entry: [
		"src/index.ts",
		"src/bin.ts",
		"src/workflows/index.ts",
		"src/hook/install.ts",
		"src/hook/pre-commit.ts",
	],
	publint: true,
});
