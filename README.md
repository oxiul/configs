# Configs

## Lint config

A shared config for oxlint

## Format config

A shared config for oxfmt

## GitHub Actions

Configure generation in `oxiul.config.ts`:

```ts
import type { Config } from "@oxiul/configs";

export default {
	workflows: {
		workflows: [], // Optional { name, workflow } objects for project workflows.
		jobs: {}, // Optional { jobName: <job> } object with CI jobs descriptions.
	},
} satisfies Config;
```

## Development

### Prerequisites

- Node.js (from `engines.node` field in `package.json`)
- Bun (from `packageManager` field in `package.json`)
