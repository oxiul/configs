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

## Package.json verification

Run `oxiul verify` to require a pinned Bun version of at least 1.4.4,
a Node.js engine range starting at 26 or higher, and these exact scripts:

```json
{
	"lint": "oxlint",
	"lint:fix": "oxlint --fix",
	"format": "oxfmt --write",
	"format:verify": "oxfmt --check",
	"workflows": "oxiul workflows --verify",
	"workflows:generate": "oxiul workflows --generate",
	"typecheck": "bun check",
	"deps": "knip",
	"oxiul:verify": "oxiul verify"
}
```

Add requirements or override commands in `oxiul.config.ts`:

```ts
export default {
	verify: {
		scripts: {
			build: "bun build src/index.ts",
			test: "*", // Required script, any command.
			lint: "oxlint --deny-warnings",
		},
	},
} satisfies Config;
```

Other scripts are allowed and left unchecked. Verification reads `package.json`
from the current directory and never modifies it.

## Development

### Prerequisites

- Node.js (from `engines.node` field in `package.json`)
- Bun (from `packageManager` field in `package.json`)
