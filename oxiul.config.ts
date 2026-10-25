import type { Config } from "./src/config/schema";
import { getCheckJob } from "./src/workflows";

const config: Config = {
	preCommitCommands: [
		"bun install --frozen-lockfile",
		"bun typecheck",
		"bun lint",
		"bun format:verify",
	],
	workflows: {
		workflows: [
			{
				concurrency: {
					group: `\${{ github.workflow }}-\${{ github.ref }}`,
				},
				jobs: {
					pack: getCheckJob({
						if: `needs.select-mode.outputs.mode == 'publish'`,
						name: "Pack",
						needs: "select-mode",
						outputs: {
							"pack-dir-artifact-id": `\${{ steps.pack.outputs.pack-dir-artifact-id }}`,
						},
						permissions: {
							contents: "read",
						},
						steps: [
							{
								run: "bun run build",
							},
							{
								id: "pack",
								uses: "changesets/action/pack@v2",
								with: {
									"publish-plan-artifact-id": `\${{ needs.select-mode.outputs.publish-plan-artifact-id }}`,
								},
							},
						],
					}),
					publish: getCheckJob({
						name: "Publish",
						needs: "pack",
						outputs: {
							"pack-dir-artifact-id": `\${{ steps.pack.outputs.pack-dir-artifact-id }}`,
						},
						permissions: {
							contents: "write",
							"id-token": "write",
						},
						steps: [
							{
								uses: "changesets/action/publish@v2",
								with: {
									"pack-dir-artifact-id": `\${{ needs.pack.outputs.pack-dir-artifact-id }}`,
								},
							},
						],
					}),
					"select-mode": getCheckJob({
						name: "Select mode",
						outputs: {
							mode: `\${{ steps.select-mode.outputs.mode }}`,
							"publish-plan-artifact-id": `\${{ steps.select-mode.outputs.publish-plan-artifact-id }}`,
						},
						permissions: {
							contents: "read",
						},
						steps: [
							{
								id: "select-mode",
								uses: "changesets/action/select-mode@v2",
							},
						],
					}),
					version: getCheckJob({
						if: `needs.select-mode.outputs.mode == 'version'`,
						name: "Version",
						needs: "select-mode",
						permissions: {
							contents: "write",
							"pull-requests": "write",
						},
						steps: [{ uses: "changesets/action/version@v2" }],
					}),
				},
				name: "Publish",
				on: {
					push: {
						branches: ["main"],
					},
				},
				permissions: {},
			},
		],
	},
};

export default config;
