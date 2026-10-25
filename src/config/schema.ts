import { z } from "zod";

import type { GeneratedWorkflowTypes } from "../workflows";

export const configSchema = z
	.object({
		preCommitCommands: z.string().array(),
		workflows: z.object({
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
		}),
	})
	.partial();
export type Config = z.infer<typeof configSchema>;
