export {
	getConfig as getLintConfig,
	overridenRules,
	disabledRules,
} from "./oxlint.ts";
export { getConfig as getFormatConfig } from "./oxfmt.ts";
export { getConfig as getKnipConfig } from "./knip.ts";
export type { ConfigOutput, ConfigInput as Config } from "./config/schema.ts";
export { configSchema } from "./config/schema.ts";
