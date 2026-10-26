import type { GeneratedWorkflowTypes } from "@github-actions-workflow-ts/lib";

import type { CompositeAction } from "./types";

export const DEFAULT_MACHINE = "ubuntu-26.04";

export const getSetupAction = (): CompositeAction => ({
	description: "Setup runtime",
	name: "Runtime setup",
	runs: {
		steps: [
			{
				name: "Setup Node.js",
				uses: "actions/setup-node@v7",
				with: { "node-version-file": "package.json" },
			},
			{
				name: "Setup Bun",
				uses: "oven-sh/setup-bun@v2",
				with: { "bun-version-file": "package.json" },
			},
			{
				name: "Install dependencies",
				run: "bun install --frozen-lockfile",
				shell: "bash",
			},
		],
		using: "composite",
	},
});

export const getDefaultWorkflow = ({
	concurrency,
	on,
	name = "Default workflow",
	...rest
}: Omit<GeneratedWorkflowTypes.Workflow, "on" | "concurrency"> & {
	on?: Exclude<
		GeneratedWorkflowTypes.Workflow["on"],
		GeneratedWorkflowTypes.Event | GeneratedWorkflowTypes.Event[]
	>;
	concurrency?: Exclude<GeneratedWorkflowTypes.Workflow["concurrency"], string>;
}): Omit<GeneratedWorkflowTypes.Workflow, "name"> & { name: string } => ({
	concurrency: {
		"cancel-in-progress": true,
		group: "${{ github.workflow }}-${{ github.ref }}",
		...concurrency,
	},
	name,
	on: {
		pull_request: {},
		push: { branches: ["main"] },
		workflow_dispatch: {},
		...on,
	},
	...rest,
});

export const getCheckJob = ({
	"runs-on": runsOn = DEFAULT_MACHINE,
	steps,
	overrideSteps = false,
	...rest
}: Omit<GeneratedWorkflowTypes.NormalJob, "runs-on"> & {
	overrideSteps?: boolean;
	"runs-on"?: GeneratedWorkflowTypes.NormalJob["runs-on"];
	steps: Exclude<GeneratedWorkflowTypes.NormalJob["steps"], undefined>;
}): GeneratedWorkflowTypes.NormalJob => ({
	"runs-on": runsOn,
	steps: overrideSteps
		? steps
		: [
				{ uses: "actions/checkout@v7" },
				{ uses: "./.github/actions/setup-env" },
				...steps,
			],
	...rest,
});

export const getFormatVerifyJob = () =>
	getCheckJob({
		name: "Format verification",
		steps: [{ run: "bun run format:verify" }],
	});

export const getDepsJob = () =>
	getCheckJob({
		name: "Dependencies check",
		steps: [{ run: "bun run deps" }],
	});

export const getTypecheckJob = () =>
	getCheckJob({ name: "Typecheck", steps: [{ run: "bun run typecheck" }] });

export const getLintJob = () =>
	getCheckJob({ name: "Lint", steps: [{ run: "bun run lint" }] });

export const getWorkflowsVerifyJob = () =>
	getCheckJob({
		name: "Workflows verification",
		steps: [{ run: "bun run workflows" }],
	});
export const getPackageJsonVerifyJob = () =>
	getCheckJob({
		name: "Package.json verification",
		steps: [{ run: "bun run oxiul:verify" }],
	});
