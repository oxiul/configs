export {
	DEFAULT_MACHINE,
	getDefaultWorkflow,
	getCheckJob,
	getFormatVerifyJob,
	getLintJob,
	getDepsJob,
	getSetupAction,
	getTypecheckJob,
	getWorkflowsVerifyJob,
} from "./default";
export type { CompositeAction, Workflow } from "./types";
export type { GeneratedWorkflowTypes } from "./generate";
export { generateWorkflows } from "./generate";
