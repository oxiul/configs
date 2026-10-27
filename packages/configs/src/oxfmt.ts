import type { OxfmtConfig } from "oxfmt";

import { baseIgnorePatterns } from "./common.ts";

type ConfigOptions = OxfmtConfig & {
	tailwind?: {
		stylesheet: string;
		functions?: string[];
	};
	imports?: Exclude<OxfmtConfig["sortImports"], boolean>;
};

export const getConfig = async ({
	ignorePatterns = [],
	tailwind,
	imports,
	sortImports,
	...rest
	// We might introduce something async later
	// oxlint-disable-next-line typescript/require-await
}: ConfigOptions = {}) =>
	({
		astro: true,
		ignorePatterns: [...baseIgnorePatterns, ...ignorePatterns],
		printWidth: 80,
		sortImports:
			sortImports ??
			(imports
				? {
						newlinesBetween: false,
						order: "asc",
						...imports,
					}
				: true),
		sortPackageJson: {
			sortScripts: true,
		},
		sortTailwindcss: tailwind
			? {
					functions: tailwind.functions,
					stylesheet: tailwind.stylesheet,
				}
			: undefined,
		useTabs: true,
		...rest,
	}) as const satisfies OxfmtConfig;
