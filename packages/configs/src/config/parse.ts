import { cosmiconfig } from "cosmiconfig";
import { z } from "zod";

import { moduleName } from "../common";
import { configSchema } from "../config/schema";

const explorer = cosmiconfig(moduleName);
export const parse = async () => {
	const rawConfig = await explorer.search();
	const parsedConfig = z.safeParse(configSchema, rawConfig?.config ?? {});
	if (!parsedConfig.success) {
		throw new Error(`Validation error: ${parsedConfig.error.message}`);
	}
	return parsedConfig.data;
};
