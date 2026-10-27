import { valid } from "semver";
import { z } from "zod";

import type { GeneratedWorkflowTypes } from "../workflows";

const MIN_NODE_VERSION = "26.0.0";
const MIN_BUN_VERSION = "1.4.4";

export const configSchema = z.object({
	preCommitCommands: z.string().array().optional(),
	verify: z
		.object({
			minBunVersion: z
				.string()
				.refine((version) => valid(version))
				.default(() => MIN_BUN_VERSION),
			minNodeVersion: z
				.string()
				.refine((version) => valid(version))
				.default(() => MIN_NODE_VERSION),
			scripts: z.record(z.string(), z.string()).optional(),
		})
		.default(() => ({
			minBunVersion: MIN_BUN_VERSION,
			minNodeVersion: MIN_NODE_VERSION,
		})),
	workflows: z
		.object({
			branch: z.string().optional(),
			jobs: z
				.record(z.string(), z.custom<GeneratedWorkflowTypes.NormalJob>())
				.optional(),
			workflows: z
				.custom<
					Omit<GeneratedWorkflowTypes.Workflow, "name"> & { name: string }
				>()
				.array()
				.optional(),
		})
		.optional(),
});
export type ConfigInput = z.input<typeof configSchema>;
export type ConfigOutput = z.output<typeof configSchema>;
