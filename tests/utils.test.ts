import { expect, test } from "bun:test";

import { sum, uniqueNonNullish } from "../packages/utils/src/index.ts";

// Test inputs and size comparisons are intentionally literal.
// oxlint-disable eslint/no-magic-numbers

test("sample utilities handle empty inputs and preserve falsy values", () => {
	expect(sum([])).toBe(0);
	expect(sum([1, -2, 3])).toBe(2);
	expect(uniqueNonNullish([])).toEqual([]);
	expect(uniqueNonNullish([0, null, 1, 0, undefined, 2])).toEqual([0, 1, 2]);
	expect(uniqueNonNullish([false, null, false, undefined, true])).toEqual([
		false,
		true,
	]);
});

const bundle = async (fixture: string): Promise<string> => {
	const result = await Bun.build({
		entrypoints: [new URL(`fixtures/${fixture}.js`, import.meta.url).pathname],
		format: "esm",
		target: "browser",
	});
	expect(result.success).toBe(true);
	expect(result.logs).toEqual([]);
	const [output] = result.outputs;
	if (!output) {
		throw new Error("Consumer build produced no output");
	}
	return output.text();
};

test("consumer builds tree-shake unused utilities and Remeda functions", async () => {
	const [sumBundle, uniqueBundle, remedaBundle] = await Promise.all([
		bundle("sum"),
		bundle("unique"),
		bundle("remeda"),
	]);
	expect(sumBundle).toContain("sum");
	expect(sumBundle).not.toContain("uniqueNonNullish");
	expect(sumBundle).not.toContain("remeda");
	expect(uniqueBundle).toContain("uniqueNonNullish");
	expect(uniqueBundle).not.toContain("values.reduce");
	expect(uniqueBundle).not.toContain("shuffle");
	expect(remedaBundle).toContain("shuffle");
	expect(uniqueBundle.length).toBeLessThan(remedaBundle.length / 10);
	const sumExports = (await import(
		`data:text/javascript;base64,${Buffer.from(sumBundle).toString("base64")}`
	)) as { sum: typeof sum };
	const uniqueExports = (await import(
		`data:text/javascript;base64,${Buffer.from(uniqueBundle).toString("base64")}`
	)) as { uniqueNonNullish: typeof uniqueNonNullish };
	expect(sumExports.sum([1, 2, 3])).toBe(6);
	expect(uniqueExports.uniqueNonNullish([0, null, 1, 0, undefined])).toEqual([
		0, 1,
	]);
});
