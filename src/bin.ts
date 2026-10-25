#!/usr/bin/env bun
import { Crust } from "@crustjs/core";
import { help } from "@crustjs/extensions";

import { command as workflows } from "./workflows/bin";

const app = new Crust("oxiul", { description: "Oxiul runner" })
	.add(workflows)
	.extend(help());

await app.execute();
