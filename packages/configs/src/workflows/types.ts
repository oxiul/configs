import type { GeneratedWorkflowTypes } from "@github-actions-workflow-ts/lib";

export type CompositeAction = {
	name: string;
	description: string;
	runs: { using: "composite"; steps: GeneratedWorkflowTypes.Step[] };
};

export type Workflow = GeneratedWorkflowTypes.Workflow;
