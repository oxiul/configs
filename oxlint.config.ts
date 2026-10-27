import { getConfig } from "./packages/configs/src/oxlint.ts";

export default getConfig({
	env: {
		bun: true,
		node: true,
	},
	overrides: [
		{
			files: ["packages/configs/src/hook/**", "packages/configs/src/bin.ts"],
			rules: {
				"node/no-top-level-await": "off",
			},
		},
		{
			files: ["packages/configs/scripts/postinstall.mjs"],
			rules: {
				"node/no-process-env": "off",
				"node/no-sync": "off",
				"node/no-top-level-await": "off",
				"unicorn/no-process-exit": "off",
			},
		},
		{
			files: ["packages/configs/src/workflows/**"],
			rules: {
				"no-template-curly-in-string": "off",
			},
		},
	],
	rules: {
		// We'll migrate to a namespace later
		"import/no-relative-parent-imports": "off",
	},
	serverSide: {
		files: ["packages/**", "scripts/**", "*.config.ts"],
	},
});
