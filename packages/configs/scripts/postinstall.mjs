import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

if (process.env.CI) {
	process.exit(0);
}

let gitRoot = "";
try {
	gitRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "ignore"],
	}).trim();
} catch {
	process.exit(0);
}

const isSelf =
	import.meta.filename ===
	path.join(gitRoot, "packages/configs/scripts/postinstall.mjs");
const [cmd, ...args] = isSelf
	? ["bun", path.join(gitRoot, "packages/configs/src/hook/install.ts")]
	: ["node", "dist/hook/install.mjs"];

const result = spawnSync(cmd, args, { stdio: "inherit" });
process.exit(result.status ?? 1);
