import path from "node:path";

import type { Preprocessor } from "knip";
import { z } from "zod";

const optionsSchema = z.object({
	ignoreHints: z.array(z.string()).default([]),
});

const preprocess: Preprocessor = (options) => {
	const { ignoreHints } = optionsSchema.parse(
		JSON.parse(options.preprocessorOptions || "{}"),
	);
	return {
		...options,
		configurationHints: options.configurationHints.filter((hint) => {
			if (typeof hint.identifier !== "string") {
				return true;
			}
			// Knip wraps a sole unmatched entry/project pattern in brackets.
			const identifier = /^(?:entry|project)-empty$/u.test(hint.type)
				? hint.identifier.replace(/^\[(?<pattern>[^,\]]+)\]$/u, "$<pattern>")
				: hint.identifier;
			const hintPath = path.relative(
				options.cwd,
				path.resolve(options.cwd, hint.workspaceName ?? ".", identifier),
			);
			return !ignoreHints.some((pattern) =>
				path.matchesGlob(hintPath, pattern),
			);
		}),
	};
};

// Knip loads preprocessors through their default export.
// oxlint-disable-next-line import/no-default-export
export default preprocess;
