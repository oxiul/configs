import { defineCommand } from "@crustjs/core";

import { parse } from "../config/parse";
import {
	getDefaultWorkflow,
	getDepsJob,
	getFormatVerifyJob,
	getLintJob,
	getPackageJsonVerifyJob,
	getSetupAction,
	getTypecheckJob,
	getWorkflowsVerifyJob,
} from "./default";
import { generateWorkflows } from "./generate";

export const command = defineCommand(
	"workflows",
	{ description: "Workflows" },
	(def) =>
		def
			.flags({ name: "verify", short: "r", type: "boolean" })
			.flags({ name: "generate", short: "g", type: "boolean" })
			.action(async ({ flags, stdout }) => {
				const config = await parse();
				const options: Parameters<typeof generateWorkflows>[0] = {
					actions: { "setup-env": getSetupAction() },
					workflows: [
						getDefaultWorkflow({
							jobs: {
								deps: getDepsJob(),
								format: getFormatVerifyJob(),
								lint: getLintJob(),
								typecheck: getTypecheckJob(),
								verify: getPackageJsonVerifyJob(),
								workflows: getWorkflowsVerifyJob(),
								...config.workflows?.jobs,
							},
							name: "CI",
						}),
						...(config.workflows?.workflows ?? []),
					],
				};
				if (flags.generate) {
					stdout(`Generating the workflows..`);
					await generateWorkflows({ ...options, check: false });
					stdout(`Workflows generated successfully!`);
				} else {
					stdout(`Verifying the workflows..`);
					await generateWorkflows({ ...options, check: true });
					stdout(`Workflows verified successfully!`);
				}
			}),
);
