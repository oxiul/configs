// oxlint-disable-next-line typescript/ban-types
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type MappedValues<T extends object, Value> = Simplify<{
	-readonly [P in keyof T as P extends number | string ? P : never]: Value;
}>;
