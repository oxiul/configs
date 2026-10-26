import type { KnipConfig as MaybeFunctionKnipConfig } from "knip";

import { arraify, isNonNullish, mapValues, omitBy } from "./utils.ts";

// We need to use Function here for Exclude
// oxlint-disable-next-line typescript/ban-types typescript/no-unsafe-function-type
type KnipConfig = Exclude<MaybeFunctionKnipConfig, Function>;
type MergableConfig = Omit<KnipConfig, "include"> & {
	include?: Partial<
		Record<NonNullable<KnipConfig["include"]>[number], boolean>
	>;
};
const mergeConfigs = (...configs: MergableConfig[]) =>
	configs.reduce<MergableConfig>(
		(
			{
				include,
				ignore,
				ignoreDependencies,
				entry,
				ignoreIssues,
				workspaces = {},
				...rest
			},
			{
				include: configInclude,
				ignore: configIgnore,
				ignoreDependencies: configIgnoreDependencies,
				entry: configEntry,
				ignoreIssues: configIgnoreIssues,
				workspaces: configWorkspaces = {},
				...configRest
			},
		) => ({
			entry: [...arraify(entry), ...arraify(configEntry)],
			ignore: [...arraify(ignore), ...arraify(configIgnore)],
			ignoreDependencies: [
				...arraify(ignoreDependencies),
				...arraify(configIgnoreDependencies),
			],
			ignoreIssues: {
				...ignoreIssues,
				...configIgnoreIssues,
			},
			include: { ...include, ...configInclude },
			workspaces: {
				...mapValues(workspaces, (workspace, key) => ({
					...workspace,
					...configWorkspaces[key],
				})),
				...omitBy(configWorkspaces, (_value, key) => Boolean(workspaces[key])),
			},
			...rest,
			...configRest,
		}),
		{},
	);

type BaseOptions = {
	vitest?: boolean;
	reactNative?: boolean;
	opencode?: boolean;
	eslint?: boolean;
	workspaces?: boolean;
};
const getBaseConfig = ({
	opencode = false,
	reactNative = false,
	eslint = true,
	vitest = true,
	workspaces = false,
}: BaseOptions = {}): MergableConfig =>
	({
		entry: workspaces ? [] : ["**/*.config.ts"],
		ignore: [
			// .history for local development
			// oxlint-disable-next-line node/no-process-env
			process.env.CI ? undefined : ".history/**",
			// Opencode is always ignored
			opencode ? ".opencode/**" : undefined,
		].filter(isNonNullish),
		ignoreDependencies: [
			// Expo doctor is used in Expo projects
			reactNative ? "expo-doctor" : undefined,
			// Never imported directly
			vitest ? "@vitest/coverage-v8" : undefined,
			// Never imported directly
			eslint ? "oxlint-plugin-eslint" : undefined,
		].filter(isNonNullish),
		// Some generated types may not be used, that's ok
		ignoreIssues: { "**/*.gen.ts": ["types"] },
		include: {
			catalog: true,
			catalogReferences: true,
			cycles: true,
			dependencies: true,
			duplicates: true,
			enumMembers: true,
			exports: true,
			files: true,
			namespaceMembers: true,
			nsExports: true,
			nsTypes: true,
			types: true,
			unlisted: true,
			unresolved: true,
		},
		treatConfigHintsAsErrors: true,
		treatTagHintsAsErrors: true,
		workspaces: workspaces
			? {
					".": {
						entry: ["**/*.config.ts"],
					},
				}
			: {},
	}) satisfies MergableConfig;

type ConfigOptions = {
	options?: BaseOptions;
} & MergableConfig;
export const getConfig = async (
	{ options, ...overrides }: ConfigOptions = {},
	// We may want to make config async later
	// oxlint-disable-next-line typescript/require-await
): Promise<KnipConfig> => {
	const baseConfig = getBaseConfig(options);
	const { include: includeRecord = {}, ...mergedConfig } = mergeConfigs(
		baseConfig,
		overrides,
	);

	return {
		...mergedConfig,
		include: Object.entries(includeRecord)
			.filter(([, value]) => value)
			.map(([key]) => key as NonNullable<KnipConfig["include"]>[number]),
	};
};
