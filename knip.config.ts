import { getConfig } from "./src/knip.ts";

export default getConfig({
	options: {
		// What?
		eslint: false,
		vitest: false,
		workspaces: true,
	},
});
