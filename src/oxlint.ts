import type { OxlintConfig } from "oxlint";

import { baseIgnorePatterns } from "./common.ts";
import { isNonNullish } from "./utils.ts";

export const disabledRules: OxlintConfig["rules"] = {
	// We don't care that much
	"eslint/capitalized-comments": "off",
	// Typescript version is typescript/switch-exhaustiveness-check
	"eslint/default-case": "off",
	// It took more time to fight it than to turn it off
	"eslint/id-length": "off",
	// No need to control that
	"eslint/max-lines": "off",
	"eslint/max-lines-per-function": "off",
	"eslint/max-params": "off",
	"eslint/max-statements": "off",
	// I didn't find the case when it helped
	"eslint/no-await-in-loop": "off",
	// We see no evil in continue
	"eslint/no-continue": "off",
	// False positives for type imports
	"eslint/no-duplicate-imports": "off",
	// We definitely use inline comments
	"eslint/no-inline-comments": "off",
	// We see no evil in nested ternaries
	"eslint/no-nested-ternary": "off",
	// We love ternaries
	"eslint/no-ternary": "off",
	// We love undefineds
	"eslint/no-undefined": "off",
	// TODO: fix this one
	"eslint/no-warning-comments": "off",
	// This is extremly outdated
	"eslint/one-var": "off",
	// Controlled by `typescript/require-await`
	"eslint/require-await": "off",

	// We export inline
	"import/exports-last": "off",
	"import/group-exports": "off",
	// We'll care about that ourselves
	"import/max-dependencies": "off",
	// We prefer named exports
	"import/no-named-export": "off",
	// There are a lot of proper usecases of namespace imports
	"import/no-namespace": "off",
	// When we don't assign import module a variable, we mean that
	"import/no-unassigned-import": "off",
	// We prefer named exports
	"import/prefer-default-export": "off",
	// No idea why do we need that
	"import/unambiguous": "off",

	// This is not particulary good, but on out scale it doesn't matter
	"oxc/no-accumulating-spread": "off",
	// We definitely want to use these features
	"oxc/no-async-await": "off",
	// Nah, we're good
	"oxc/no-map-spread": "off",
	// We use a lot of optional chaining
	"oxc/no-optional-chaining": "off",
	// We use a lot of rest spreading
	"oxc/no-rest-spread-properties": "off",

	// We use new Promise when it's necessary
	"promise/avoid-new": "off",
	// There are no good usecases for that, all callbacks are valid
	"promise/prefer-await-to-callbacks": "off",
	// There are false positives on `z.foo().catch()`
	"promise/prefer-await-to-then": "off",

	// These all should be addressed by React Compiler
	"react-perf/jsx-no-jsx-as-prop": "off",
	"react-perf/jsx-no-new-array-as-prop": "off",
	"react-perf/jsx-no-new-function-as-prop": "off",
	"react-perf/jsx-no-new-object-as-prop": "off",

	// We don't really need display names for react components
	"react/display-name": "off",
	// There's a forbid syntax rule for that
	"react/forbid-component-props": "off",
	// No need for that
	"react/jsx-filename-extension": "off",
	// We'll manage these
	"react/jsx-handler-names": "off",
	// No problem with that
	"react/jsx-max-depth": "off",
	// We extensively spread props: `<Foo {...props} />`
	"react/jsx-props-no-spreading": "off",
	// I guess we're going to decide how many components file can hold
	"react/no-multi-comp": "off",
	// They say fast refresh won't work with these errors. Ok.
	"react/only-export-components": "off",
	// Compilers know how to manage this
	"react/react-in-jsx-scope": "off",
	// If we supress the rule - we know what we are doing
	"react/rule-suppression": "off",

	// This is heavily guarded by typescript itself
	"typescript/consistent-return": "off",
	// Typescript guards us good enough
	"typescript/explicit-function-return-type": "off",
	// We have typescript strict enough to have implicit boundary types
	"typescript/explicit-module-boundary-types": "off",
	// We enjoy confusing fellow developers with void expressions
	// Mainly used for:
	// - returning `void` from a function, assigning that to a value and validating value is undefined
	// - shorthanding functions returns that don't matter (because they're void)
	"typescript/no-confusing-void-expression": "off",
	// That's a weird thing to forbid
	"typescript/no-dynamic-delete": "off",
	// We use a few `void` types around
	"typescript/no-invalid-void-type": "off",
	// Rule emits false positives on `const fn = <T>(value: T) => {...}`
	// see https://github.com/typescript-eslint/typescript-eslint/issues/9667
	"typescript/no-unnecessary-type-parameters": "off",
	// We use type assertions heavily (but with caution)
	"typescript/no-unsafe-type-assertion": "off",
	// `(object | undefined) || number` is assumed incorrect by this rule
	// it should be `(object | undefined) ?? number`
	"typescript/prefer-nullish-coalescing": "off",
	// We don't need readonly parameter types
	"typescript/prefer-readonly-parameter-types": "off",
	// This is replaced by typescript/no-floating-promises
	"typescript/promise-function-async": "off",

	// We've got typescript for that
	"unicorn/no-array-callback-reference": "off",
	// No way we're not using reduce
	"unicorn/no-array-reduce": "off",
	// We see no evil in nested ternaries
	"unicorn/no-nested-ternary": "off",
	// We're going to be using null literals
	"unicorn/no-null": "off",
	// There are too many false positives
	"unicorn/no-useless-undefined": "off",
	// Oxfmt lowercases hex numbers
	"unicorn/number-literal-case": "off",
	// There's no particular reason not to use `window`
	"unicorn/prefer-global-this": "off",
	// This creates more problem that solves
	"unicorn/prefer-spread": "off",

	// We want to run as many expects as needed
	"vitest/max-expects": "off",
	// There are so many valid cases for conditionals in tests
	"vitest/no-conditional-in-test": "off",
	// We need before/after hooks
	"vitest/no-hooks": "off",
	// We import vitest globals
	"vitest/no-importing-vitest-globals": "off",
	// No idea why it triggers on every expect
	"vitest/no-standalone-expect": "off",
	// This conflict with vitest/prefer-called-times
	"vitest/prefer-called-once": "off",
	// We don't need to know amount of assertions in every test
	"vitest/prefer-expect-assertions": "off",
	// This one is not ready for fixtures
	"vitest/prefer-importing-vitest-globals": "off",
	// We'll do titles ourselves
	"vitest/prefer-lowercase-title": "off",
	// This one conflicts with other similar rules
	"vitest/prefer-to-be": "off",
	// These conflict with vitest/prefer-strict-boolean-matchers
	"vitest/prefer-to-be-falsy": "off",
	"vitest/prefer-to-be-truthy": "off",
	// This one does a bad job calculating what a hook is
	"vitest/require-hook": "off",
	// We don't need timeouts for every test
	"vitest/require-test-timeout": "off",
} as const;

const disabledTailwindRules: OxlintConfig["rules"] = {
	// Maintained by formatter
	"better-tailwindcss/enforce-consistent-class-order": "off",
	// This doesn't work out good with formatter
	"better-tailwindcss/enforce-consistent-line-wrapping": "off",
} as const;

export const overridenRules: OxlintConfig["rules"] = {
	// We use a lot of sensible magic numbers
	"eslint/no-magic-numbers": ["error", { ignore: [0, 1, -1] }],
	// `void foo` is a mark of deliberately floating promise
	"eslint/no-void": ["error", { allowAsStatement: true }],
	// We enjoy sorting imports
	"eslint/sort-imports": ["error", { ignoreDeclarationSort: true }],

	// We use arrow functions as much as possible
	"react/function-component-definition": [
		"error",
		{
			namedComponents: "arrow-function",
			unnamedComponents: "arrow-function",
		},
	],
	// Allow expressions for stuff like `<>{children}</>`
	"react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],

	// Default option is `interface`
	"typescript/consistent-type-definitions": ["error", "type"],
	// We want to pass `() => Promise<void>` to a prop / arg expecting `() => void`
	"typescript/no-misused-promises": [
		"error",
		{
			checksVoidReturn: {
				arguments: false,
				attributes: false,
			},
		},
	],
	// Allowing `while(true)`
	"typescript/no-unnecessary-condition": [
		"error",
		{ allowConstantLoopConditions: true },
	],
	// We want to allow `Amount ${amount}` to be used
	"typescript/restrict-template-expressions": ["error", { allowNumber: true }],
	// We want to be strict, but not too much
	"typescript/strict-boolean-expressions": [
		"error",
		{
			allowNullableBoolean: true,
			allowNullableNumber: true,
			allowNullableString: true,
			allowNumber: true,
			allowString: true,
		},
	],
	// We want to exhause types like `'a' | 'b' | 'c'`
	"typescript/switch-exhaustiveness-check": [
		"error",
		{ considerDefaultExhaustiveForUnions: true },
	],

	// We want to check `foo.length !== 0`, not `foo.length > 0`
	"unicorn/explicit-length-check": ["error", { "non-zero": "not-equal" }],
	// Default 3 is too little
	"unicorn/max-nested-calls": ["error", { max: 5 }],
	// We prefer NO braces in switch cases unless we really need them
	"unicorn/switch-case-braces": ["error", "avoid"],

	// Vitest test are run with `test`, not `it`
	"vitest/consistent-test-it": ["error", { fn: "test" }],
} as const;

type MergableConfig = Omit<OxlintConfig, "plugins"> & {
	plugins?: Partial<
		Record<NonNullable<OxlintConfig["plugins"]>[number], boolean>
	>;
};
const mergeConfigs = (...configs: MergableConfig[]) =>
	configs.reduce<MergableConfig>(
		(
			{
				categories,
				env,
				globals,
				ignorePatterns,
				jsPlugins,
				options,
				overrides,
				plugins,
				rules,
				settings,
				...rest
			},
			{
				categories: configCategories,
				env: configEnv,
				globals: configGlobals,
				ignorePatterns: configIgnorePatterns,
				jsPlugins: configJsPlugins,
				options: configOptions,
				overrides: configOverrides,
				plugins: configPlugins,
				rules: configRules,
				settings: configSettings,
				...configRest
			},
		) => ({
			categories: { ...categories, ...configCategories },
			env: { ...env, ...configEnv },
			globals: { ...globals, ...configGlobals },
			ignorePatterns: [
				...(ignorePatterns ?? []),
				...(configIgnorePatterns ?? []),
			],
			jsPlugins: [...(jsPlugins ?? []), ...(configJsPlugins ?? [])],
			options: { ...options, ...configOptions },
			overrides: [...(overrides ?? []), ...(configOverrides ?? [])],
			plugins: { ...plugins, ...configPlugins },
			rules: { ...rules, ...configRules },
			settings: { ...settings, ...configSettings },
			...rest,
			...configRest,
		}),
		{},
	);

type TailwindConfig = { entryPoint: string };
const getTailwindConfig = async (
	config?: TailwindConfig,
): Promise<MergableConfig> => {
	if (!config) {
		return {};
	}
	const tailwindPlugin = await import("eslint-plugin-better-tailwindcss");
	return {
		jsPlugins: [
			{
				name: "better-tailwindcss",
				specifier: "eslint-plugin-better-tailwindcss",
			},
		],
		rules: {
			...Object.fromEntries(
				Object.keys(tailwindPlugin.default.rules).map((key) => [
					`better-tailwindcss/${key}`,
					"error",
				]),
			),
			...disabledTailwindRules,
		},
		settings: {
			"better-tailwindcss": {
				entryPoint: config.entryPoint,
			},
		},
	};
};

type VitestConfig = { files?: string[] };
const getVitestConfig = (config?: VitestConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		overrides: config.files
			? [
					{
						files: config.files,
						rules: {
							// We use `use` function in Vitest tests which clashes with this rule
							"react/rules-of-hooks": "off",
						},
					},
				]
			: [],
		plugins: {
			vitest: true,
		},
	};
};

type TanstackRouterConfig = {
	routes: string[];
};
const getTanstackRouterConfig = async (
	config?: TanstackRouterConfig,
): Promise<MergableConfig> => {
	if (!config) {
		return {};
	}
	const plugin = await import("@tanstack/eslint-plugin-router");
	return {
		jsPlugins: [
			{
				name: "@tanstack/router",
				specifier: "@tanstack/eslint-plugin-router",
			},
		],
		overrides: [
			{
				files: config.routes,
				rules: {
					// We use routes in function components that are defined before the component
					"no-use-before-define": "off",
				},
			},
		],
		// oxlint-disable-next-line typescript/no-non-null-assertion
		rules: plugin.default.configs["flat/recommended"][0]!.rules,
	};
};

type PackageJsonConfig = boolean;
const getPackageJsonConfig = async (
	config?: PackageJsonConfig,
): Promise<MergableConfig> => {
	if (!config) {
		return {};
	}
	const plugin = await import("eslint-plugin-package-json");
	return {
		jsPlugins: [
			{ name: "package-json", specifier: "eslint-plugin-package-json" },
		],
		rules: plugin.configs.recommended.rules,
	};
};

type PlaywrightConfig = {
	files: string[];
	assertFunctionNames?: string[];
};
const getPlaywrightConfig = async (
	config?: PlaywrightConfig,
): Promise<MergableConfig> => {
	if (!config) {
		return {};
	}
	const plugin = await import("eslint-plugin-playwright");
	return {
		jsPlugins: [{ name: "playwright", specifier: "eslint-plugin-playwright" }],
		overrides: [
			{
				files: config.files,
				rules: {
					...plugin.default.configs["flat/recommended"].rules,
					...(config.assertFunctionNames
						? {
								"playwright/expect-expect": [
									"error",
									{
										assertFunctionNames: config.assertFunctionNames,
									},
								] as const,
							}
						: {}),
					// We use `use` function in Playwright tests which clashes with this rule
					"react/rules-of-hooks": "off",
					// Playwright tests don't need vitest rules
					"vitest/consistent-test-filename": "off",
					"vitest/prefer-each": "off",
					"vitest/valid-expect": "off",
				},
			} satisfies NonNullable<OxlintConfig["overrides"]>[number],
		],
	};
};

type ServerSideConfig = {
	files: string[];
	allowConsole?: string[];
	allowProcess?: string[];
};
const getServerSideConfig = (config?: ServerSideConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		overrides: (
			[
				{
					// These are packages that allow server-side code
					files: config.files,
					rules: {
						"import/no-nodejs-modules": "off",
					},
				},
				config.allowConsole
					? ({
							files: config.allowConsole,
							rules: {
								"no-console": "off",
							},
						} as const)
					: null,
				config.allowProcess
					? ({
							files: config.allowProcess,
							rules: {
								"node/no-process-env": "off",
							},
						} as const)
					: null,
			] as const
		).filter(isNonNullish),
	};
};

type RestrictedSyntaxRule = {
	selector: string;
	message: string;
};
type RestrictedSyntaxOverride = {
	files: string[];
	rules: RestrictedSyntaxRule[];
};
type RestrictedSyntaxConfig = {
	banBarrelImport?: boolean;
	banReactMemo?: boolean;
	overrides?: RestrictedSyntaxOverride[];
	rulesOverrides?: RestrictedSyntaxRule[];
	previousRules?: RestrictedSyntaxRule[];
	previousOverrides?: RestrictedSyntaxOverride[];
};
const getRestrictedSyntaxConfig = (
	config?: RestrictedSyntaxConfig,
): MergableConfig => {
	if (!config) {
		return {};
	}
	const overrides = config.overrides ?? [];
	const rawRules = [
		config.banBarrelImport
			? {
					message: "Do not use barrel export, prefer named export",
					selector: "ExportAllDeclaration",
				}
			: null,
		config.banReactMemo
			? {
					message:
						"No need to use `React.memo`, we have a react compiler turned on",
					selector:
						"MemberExpression[object.name='React'][property.name='memo']",
				}
			: null,
	].filter(isNonNullish);
	return {
		overrides: overrides.map(({ files, rules }) => ({
			files,
			rules: {
				"eslint-js/no-restricted-syntax": [
					"error",
					[...rawRules, ...rules, ...(config.rulesOverrides ?? [])],
				],
			},
		})),
		rules: {
			"eslint-js/no-restricted-syntax": [
				"error",
				...rawRules,
				...(config.rulesOverrides ?? []),
			],
		},
	};
};

type RestrictedConfig = {
	globals?: {
		name: string;
		message: string;
	}[];
	properties?: {
		object: string;
		property: string;
		message: string;
	}[];
	syntaxOverrides?: RestrictedSyntaxConfig["overrides"];
	syntaxRulesOverrides?: RestrictedSyntaxConfig["rulesOverrides"];
};
const getRestrictedConfig = (config?: RestrictedConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		rules: {
			// Custom restricted globals like `window` or `document`
			"eslint/no-restricted-globals": config.globals
				? ["error", ...config.globals]
				: "error",
			// Custom restricted properties like `Object.keys` or `Object.entries`
			"eslint/no-restricted-properties": config.properties
				? ["error", ...config.properties]
				: "error",
		},
	};
};

type ReactConfig = {
	allowedStrings?: string[];
	additionalHooks?: string[];
	banMemo?: boolean;
};
const getReactConfig = (config?: ReactConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		rules: {
			"react/exhaustive-deps": config.additionalHooks
				? [
						"error",
						// Custom hooks
						{ additionalHooks: `(${config.additionalHooks.join(",")})` },
					]
				: "error",
			"react/jsx-no-literals": [
				"error",
				{
					// Custom allowed string can be added
					allowedStrings: config.allowedStrings,
					ignoreProps: true,
					noAttributeStrings: true,
					noStrings: true,
				},
			],
		},
	};
};

type I18nConfig = {
	ignore?: string[] | true;
};
const getI18nConfig = (config?: I18nConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		overrides: Array.isArray(config.ignore)
			? [
					{
						files: config.ignore,
						rules: {
							"react/jsx-no-literals": "off",
						},
					},
				]
			: [],
		rules:
			config.ignore === true
				? {
						"react/jsx-no-literals": "off",
					}
				: {},
	};
};

type ImportConfig = {
	allowDefault?: string[];
	banBarrel?: boolean;
};
const getImportConfig = (config?: ImportConfig): MergableConfig => {
	if (!config) {
		return {};
	}
	return {
		overrides: [
			config.allowDefault
				? ({
						files: config.allowDefault,
						rules: {
							"import/no-default-export": "off",
						},
					} as const)
				: null,
		].filter(isNonNullish),
	};
};

const getBaseConfig = (): MergableConfig => ({
	categories: {
		correctness: "error",
		nursery: "error",
		pedantic: "error",
		perf: "error",
		restriction: "error",
		style: "error",
		suspicious: "error",
	},
	env: {
		browser: true,
		es2026: true,
	},
	ignorePatterns: baseIgnorePatterns,
	jsPlugins: [{ name: "eslint-js", specifier: "oxlint-plugin-eslint" }],
	options: {
		denyWarnings: true,
		reportUnusedDisableDirectives: "error",
		typeAware: true,
	},
	overrides: [
		{
			files: ["**/*.config.{j,t}s"],
			rules: {
				// Config files tend to export default
				"import/no-default-export": "off",
				"import/no-nodejs-modules": "off",
				"node/no-top-level-await": "off",
			},
		} satisfies NonNullable<OxlintConfig["overrides"]>[number],
		{
			files: ["**/*.d.ts"],
			rules: {
				// Decalaration files are exactly where triple slash references are used
				"typescript/triple-slash-reference": "off",
			},
		} satisfies NonNullable<OxlintConfig["overrides"]>[number],
		{
			files: ["workflows.config.ts"],
			rules: {
				// There are custom interpolations inside github workflows
				"eslint/no-template-curly-in-string": "off",
			},
		},
	],
	plugins: {
		eslint: true,
		import: true,
		"jsx-a11y": true,
		node: true,
		oxc: true,
		promise: true,
		react: true,
		"react-perf": true,
		typescript: true,
		unicorn: true,
	},
	rules: {
		...disabledRules,
		...overridenRules,
	},
});

type ConfigOptions = {
	jsPlugins?: Exclude<OxlintConfig["jsPlugins"], null>;
	plugins?: MergableConfig["plugins"];
	tailwind?: TailwindConfig;
	vitest?: VitestConfig;
	tanstackRouter?: TanstackRouterConfig;
	packageJson?: PackageJsonConfig;
	playwright?: PlaywrightConfig;
	serverSide?: ServerSideConfig;
	restricted?: RestrictedConfig;
	react?: ReactConfig;
	i18n?: I18nConfig;
	import?: ImportConfig;
} & Pick<
	OxlintConfig,
	| "env"
	| "rules"
	| "options"
	| "ignorePatterns"
	| "categories"
	| "settings"
	| "overrides"
	| "globals"
> &
	ReactConfig;

export const getConfig = async ({
	tailwind,
	tanstackRouter,
	vitest,
	packageJson = true,
	playwright,
	serverSide,
	restricted,
	react,
	i18n,
	import: importOptions,
	...config
}: ConfigOptions = {}): Promise<OxlintConfig> => {
	const baseConfig = getBaseConfig();
	const tailwindConfig = await getTailwindConfig(tailwind);
	const tanstackRouterConfig = await getTanstackRouterConfig(tanstackRouter);
	const vitestConfig = getVitestConfig(vitest);
	const packageJsonConfig = await getPackageJsonConfig(packageJson);
	const playwrightConfig = await getPlaywrightConfig(playwright);
	const serverSideConfig = getServerSideConfig(serverSide);
	const reactConfig = getReactConfig(react);
	const i18nConfig = getI18nConfig(i18n);
	const importConfig = getImportConfig(importOptions);
	const restrictedConfig = getRestrictedConfig(restricted);
	const overrideConfig = config satisfies MergableConfig;
	const rawMergedConfig = mergeConfigs(
		baseConfig,
		vitestConfig,
		tanstackRouterConfig,
		packageJsonConfig,
		playwrightConfig,
		tailwindConfig,
		serverSideConfig,
		restrictedConfig,
		reactConfig,
		i18nConfig,
		importConfig,
		// Warning! This should be the last one!
		overrideConfig,
	);
	const restrictedSyntaxConfig = getRestrictedSyntaxConfig({
		banBarrelImport: importOptions?.banBarrel,
		banReactMemo: react?.banMemo,
		overrides: restricted?.syntaxOverrides,
		previousOverrides: rawMergedConfig.overrides
			?.map((override) =>
				override.rules?.["eslint-js/no-restricted-syntax"] === undefined
					? undefined
					: {
							files: override.files,
							rules: (
								override.rules["eslint-js/no-restricted-syntax"] as [
									string,
									...RestrictedSyntaxRule[],
								]
							).slice(1) as RestrictedSyntaxRule[],
						},
			)
			.filter(isNonNullish),
		previousRules: (
			rawMergedConfig.rules?.["eslint-js/no-restricted-syntax"] as
				| [string, ...RestrictedSyntaxRule[]]
				| undefined
		)?.slice(1) as RestrictedSyntaxRule[] | undefined,
		rulesOverrides: restricted?.syntaxRulesOverrides,
	});
	const { plugins: pluginsRecord = {}, ...mergedConfig } = mergeConfigs(
		rawMergedConfig,
		restrictedSyntaxConfig,
	);
	return {
		...mergedConfig,
		plugins: Object.entries(pluginsRecord)
			.filter(([, value]) => value)
			.map(([key]) => key as keyof OxlintConfig["plugins"]),
	};
};
