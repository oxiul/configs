import { gte, subset, valid, validRange } from "semver";
import type { z } from "zod";

import type { configSchema } from "../config/schema";
import type { packageJsonSchema } from "../schemas";

const defaultScripts = {
	deps: "knip",
	format: "oxfmt --write",
	"format:verify": "oxfmt --check",
	lint: "oxlint",
	"lint:fix": "oxlint --fix",
	"oxiul:verify": "oxiul verify",
	typecheck: "bun check",
	workflows: "oxiul workflows --verify",
	"workflows:generate": "oxiul workflows --generate",
};

export const verifyPackageJson = (
	packageJson: z.infer<typeof packageJsonSchema>,
	{
		scripts: extraScripts,
		minBunVersion,
		minNodeVersion,
	}: z.infer<typeof configSchema>["verify"],
): void => {
	const {
		scripts = {},
		packageManager = "",
		engines: { node: nodeVersionRaw = "" } = { node: "" },
	} = packageJson;
	const errors: string[] = [];
	const bunVersion = /^bun@(?<version>[^+]+)(?:\+sha\d+\.[a-f\d]+)?$/u.exec(
		packageManager,
	)?.groups?.version;
	if (!bunVersion || !valid(bunVersion) || !gte(bunVersion, minBunVersion)) {
		errors.push(`packageManager must pin bun@${minBunVersion} or higher`);
	}
	const nodeRange = validRange(nodeVersionRaw);
	if (!nodeRange || !subset(nodeRange, `>=${minNodeVersion}`)) {
		errors.push(
			`engines.node must require Node.js ${minNodeVersion} or higher`,
		);
	}
	for (const [name, command] of Object.entries({
		...defaultScripts,
		...extraScripts,
	})) {
		if (!scripts[name]) {
			errors.push(`Missing script: ${name}`);
		} else if (command !== "*" && scripts[name] !== command) {
			errors.push(`scripts[${name}] must be ${JSON.stringify(command)}`);
		}
	}
	if (errors.length !== 0) {
		throw new Error(`Package.json verification failed:\n${errors.join("\n")}`);
	}
};
