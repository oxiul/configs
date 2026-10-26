import { z } from "zod";

export const packageJsonSchema = z
	.object({
		engines: z.object({ node: z.string() }),
		packageManager: z.string(),
		scripts: z.record(z.string(), z.string()),
	})
	.partial();
