import { glob } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const mergeConfigs = (...configs: MergableConfig[]): KnipConfig => {
	const { include: mergedInclude = {}, ...mergedConfig } =
		configs.reduce<MergableConfig>(
			(
				{
					include,
					ignore,
					ignoreDependencies,
					ignoreFiles,
					ignoreBinaries,
					ignoreMembers,
					ignoreUnresolved,
					ignoreWorkspaces,
					entry,
					ignoreIssues,
					workspaces = {},
					...rest
				},
				{
					include: configInclude,
					ignore: configIgnore,
					ignoreDependencies: configIgnoreDependencies,
					ignoreFiles: configIgnoreFiles,
					ignoreBinaries: configIgnoreBinaries,
					ignoreMembers: configIgnoreMembers,
					ignoreUnresolved: configIgnoreUnresolved,
					ignoreWorkspaces: configIgnoreWorkspaces,
					entry: configEntry,
					ignoreIssues: configIgnoreIssues,
					workspaces: configWorkspaces = {},
					...configRest
				},
			) => ({
				...(entry !== undefined || configEntry !== undefined
					? { entry: [...arraify(entry), ...arraify(configEntry)] }
					: {}),
				ignore: [...arraify(ignore), ...arraify(configIgnore)],
				ignoreBinaries: [
					...arraify(ignoreBinaries),
					...arraify(configIgnoreBinaries),
				],
				ignoreDependencies: [
					...arraify(ignoreDependencies),
					...arraify(configIgnoreDependencies),
				],
				ignoreFiles: [...arraify(ignoreFiles), ...arraify(configIgnoreFiles)],
				ignoreIssues: {
					...ignoreIssues,
					...mapValues(configIgnoreIssues ?? {}, (issues, pattern) => [
						...new Set([...(ignoreIssues?.[pattern] ?? []), ...issues]),
					]),
				},
				ignoreMembers: [
					...arraify(ignoreMembers),
					...arraify(configIgnoreMembers),
				],
				ignoreUnresolved: [
					...arraify(ignoreUnresolved),
					...arraify(configIgnoreUnresolved),
				],
				ignoreWorkspaces: [
					...arraify(ignoreWorkspaces),
					...arraify(configIgnoreWorkspaces),
				],
				include: { ...include, ...configInclude },
				workspaces: {
					...mapValues(workspaces, (workspace, key) => ({
						...workspace,
						...configWorkspaces[key],
						...(workspace.entry !== undefined ||
						configWorkspaces[key]?.entry !== undefined
							? {
									entry: [
										...arraify(workspace.entry),
										...arraify(configWorkspaces[key]?.entry),
									],
								}
							: {}),
						ignore: [
							...arraify(workspace.ignore),
							...arraify(configWorkspaces[key]?.ignore),
						],
						ignoreFiles: [
							...arraify(workspace.ignoreFiles),
							...arraify(configWorkspaces[key]?.ignoreFiles),
						],
					})),
					...omitBy(configWorkspaces, (_value, key) =>
						Boolean(workspaces[key]),
					),
				},
				...rest,
				...configRest,
			}),
			{},
		);
	return {
		...mergedConfig,
		include: Object.entries(mergedInclude)
			.filter(([, value]) => value)
			.map(([key]) => key as NonNullable<KnipConfig["include"]>[number]),
	};
};

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

const getIgnoredConfig = async (ignoreIfPresent: string[]) => {
	const optionalIgnores = await Promise.all(
		[".history/**", ...ignoreIfPresent].map(async (pattern) => {
			const matches = await Array.fromAsync(glob(pattern));
			return matches.length === 0 ? undefined : pattern;
		}),
	);
	return {
		ignore: optionalIgnores.filter(isNonNullish),
	} satisfies MergableConfig;
};

type ConfigOptions = {
	options?: BaseOptions;
	ignoreIfPresent?: string[];
	ignoreHints?: string[];
} & MergableConfig;
export const getConfig = async ({
	options,
	ignoreIfPresent = [],
	ignoreHints = [],
	preprocessor,
	preprocessorOptions,
	...overrides
}: ConfigOptions = {}): Promise<KnipConfig> => {
	const baseConfig = getBaseConfig(options);
	return mergeConfigs(
		baseConfig,
		await getIgnoredConfig(ignoreIfPresent),
		overrides,
		{
			preprocessor: [
				fileURLToPath(
					new URL(
						`knip-preprocessor${path.extname(import.meta.url)}`,
						import.meta.url,
					),
				),
				...arraify(preprocessor),
			],
			preprocessorOptions: { ...preprocessorOptions, ignoreHints },
		},
	);
};
