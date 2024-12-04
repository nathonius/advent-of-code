import { readInput } from "../shared.js";

export async function day3() {
  const mulPattern = /mul\((?<x>\d+),(?<y>\d+)\)|do\(\)|don't\(\)/g;
  const [input] = await readInput("day3.txt", null);
  let total = 0;
  let enabled = true;
  for (const matchArr of input.matchAll(mulPattern)) {
    const [_match, x, y] = matchArr;
    if (_match === "do()") {
      enabled = true;
    } else if (_match === "don't()") {
      enabled = false;
    } else if (enabled) {
      total += parseInt(x) * parseInt(y);
    }
  }
  console.log(`Multiplication total: ${total}`);
}
