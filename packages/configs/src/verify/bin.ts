import { readFile } from "node:fs/promises";

import { defineCommand } from "@crustjs/core";

import { parse as parseConfig } from "../config/parse";
import { packageJsonSchema } from "../schemas";
import { verifyPackageJson } from "./package-json";

export const command = defineCommand(
	"verify",
	{ description: "Verify package.json" },
	(def) =>
		def.action(async ({ stdout }) => {
			stdout("Verifying package.json...");
			const config = await parseConfig();
			const parseResult = packageJsonSchema.safeParse(
				JSON.parse(await readFile("package.json", "utf8")),
			);
			if (!parseResult.success) {
				throw new Error(`Invalid package.json: ${parseResult.error.message}`);
			}
			verifyPackageJson(parseResult.data, config.verify);
			stdout("package.json verified successfully!");
		}),
);
