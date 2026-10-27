# @oxiul/utils

Sample tree-shakeable ESM utilities:

```ts
import { sum, uniqueNonNullish } from "@oxiul/utils";

sum([1, 2, 3]); // 6
uniqueNonNullish([1, null, 1, undefined, 2]); // [1, 2]
```

`uniqueNonNullish` uses Remeda. Importing only `sum` in an ESM consumer bundle
removes the unused utility and all Remeda code.
