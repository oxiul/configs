// oxlint-disable no-console
import { spawn } from "node:child_process";

import { Listr } from "listr2";
import type { DefaultRenderer, ListrTaskWrapper, SimpleRenderer } from "listr2";

import { parse } from "../config/parse";

const failedOutputs = new Map<string, string>();

const run = (
	command: string,
	task: ListrTaskWrapper<
		unknown,
		typeof DefaultRenderer,
		typeof SimpleRenderer
	>,
) =>
	new Promise<void>((resolve, reject) => {
		const child = spawn(command, {
			// oxlint-disable-next-line node/no-process-env
			env: { ...process.env, FORCE_COLOR: "1" },
			shell: true,
			stdio: ["ignore", "pipe", "pipe"],
		});

		const window = task.stdout();
		let output = "";
		const onData = (chunk: Buffer) => {
			// oxlint-disable-next-line typescript/restrict-plus-operands
			output += chunk;
			window.write(chunk);
		};
		child.stdout.on("data", onData);
		child.stderr.on("data", onData);

		child.on("error", reject);
		child.on("close", (code, signal) => {
			if (code === 0) {
				return resolve();
			}
			failedOutputs.set(command, output);
			reject(
				new Error(signal ? `killed by ${signal}` : `exited with code ${code}`),
			);
		});
	});

try {
	const config = await parse();
	if (config.preCommitCommands && config.preCommitCommands.length !== 0) {
		const tasks = new Listr<
			unknown,
			typeof DefaultRenderer,
			typeof SimpleRenderer
		>(
			config.preCommitCommands.map((command) => ({
				rendererOptions: {
					outputBar: 5,
					persistentOutput: false,
				},
				task: (_ctx, task) => run(command, task),
				title: command,
			})),
			{
				concurrent: false, // set true to run in parallel
			},
		);
		await tasks.run();
	} else {
		console.log(`No commands in pre-commit list found`);
	}
} catch {
	for (const [command, output] of failedOutputs) {
		console.error(`\n✖ Output of "${command}"\n${output}`);
	}
	console.error(
		`${failedOutputs.size} tasks failed: ${[...failedOutputs.keys()].join(", ")}`,
	);
	// oxlint-disable-next-line unicorn/no-process-exit
	process.exit(1);
}
