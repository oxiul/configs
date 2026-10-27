import { getConfig } from "./packages/configs/src/knip.ts";

export default getConfig({
	ignoreDependencies: ["oxlint-plugin-eslint"],
	options: {
		// What?
		eslint: false,
		vitest: false,
		workspaces: true,
	},
	workspaces: {
		".": {
			entry: ["*.config.ts", "tests/**/*.test.ts", "tests/fixtures/*.js"],
		},
	},
});
