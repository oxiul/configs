# Configs and utilities

This repository uses Bun workspaces:

- [`packages/configs`](packages/configs): `@oxiul/configs`, the shared configs and CLI.
- [`packages/utils`](packages/utils): `@oxiul/utils`, standalone ESM utilities.

Each package has its own dependencies, exports, build, and Changesets release.
Shared development tools and the lockfile live at the repository root.

Use the Node.js and Bun versions declared in the root `package.json`.
Run `bun install`, then `bun run build` to build both packages, or
`bun run --filter @oxiul/utils build` to build just utils.

`bun run test` builds both packages and verifies utility behavior and consumer
tree-shaking: importing `sum` removes the other utility and all Remeda code;
importing `uniqueNonNullish` keeps only the Remeda helpers it uses.

Remeda stays external in the published library build. Consumers' ESM bundlers
perform tree-shaking; Node.js imports alone do not remove unused code.
