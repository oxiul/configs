// oxlint-disable no-console
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { packageName } from "../common";

// oxlint-disable-next-line typescript/strict-void-return
const promisifiedExec = promisify(exec);

const { stdout: rawGitRepositoryRoot } = await promisifiedExec(
	"git rev-parse --show-toplevel",
);
const gitRepositoryRoot = rawGitRepositoryRoot.trim();
const { stdout: rawHooksDirectory } = await promisifiedExec(
	"git rev-parse --path-format=absolute --git-path hooks",
);
const hooksDirectory = rawHooksDirectory.trim();
const isSelf =
	path.resolve(fileURLToPath(new URL("../..", import.meta.url))) ===
	path.join(gitRepositoryRoot, "packages/configs");

const HOOK_CONTENT = [
	"#!/bin/bash",
	`node ${isSelf ? "./packages/configs" : `./node_modules/${packageName}`}/dist/hook/pre-commit.mjs`,
].join("\n");

await fs.mkdir(hooksDirectory, { recursive: true });
const preCommitPath = path.join(hooksDirectory, "pre-commit");

let oldHook = "";
const preCommitExists = await fs
	.stat(preCommitPath)
	.then(() => true)
	.catch(() => false);
if (preCommitExists) {
	const preCommitStats = await fs.lstat(preCommitPath);
	if (preCommitStats.isSymbolicLink()) {
		console.log("Detected an existing git pre-commit hook");
		await fs.unlink(preCommitPath);
	} else {
		oldHook = await fs.readFile(preCommitPath, "utf8");
		if (oldHook !== HOOK_CONTENT) {
			console.log(`Found hooks path: "${hooksDirectory}"`);
			console.log("Detected an existing git pre-commit hook");
			await fs.writeFile(`${preCommitPath}.old`, oldHook);
		}
	}
}

if (oldHook !== HOOK_CONTENT) {
	console.log(`Found hooks path: "${hooksDirectory}"`);
	await fs.writeFile(preCommitPath, HOOK_CONTENT, { mode: 0o755 });
	console.log("Hook saved");
}
