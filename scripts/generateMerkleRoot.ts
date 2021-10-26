import { program } from "commander";
import { readFileSync } from "fs";
import { parseBalanceMap } from "./parseBalanceMap";

program
  .version("0.0.0")
  .requiredOption(
    "-i, --input <path>",
    "input JSON file location containing a map of account addresses to string balances"
  );

program.parse();
const options = program.opts();

const json = JSON.parse(readFileSync(options.input, { encoding: "utf8" }));

if (typeof json !== "object") throw new Error("Invalid JSON");

console.log(JSON.stringify(parseBalanceMap(json)));
