import { readFile } from "node:fs/promises";
import { readInput } from "../shared.js";

async function readDay1Input(): Promise<{ left: number[]; right: number[] }> {
  const lines = await readInput("day1.txt");

  console.log(`Got input with ${lines.length} lines.`);

  let leftList: number[] = [];
  let rightList: number[] = [];

  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    const [left, right] = line.split("   ");
    leftList.push(parseInt(left, 10));
    rightList.push(parseInt(right, 10));
  }

  leftList = leftList.toSorted((a, b) => a - b);
  rightList = rightList.toSorted((a, b) => a - b);
  return { left: leftList, right: rightList };
}

export async function day1() {
  const { left, right } = await readDay1Input();
  let distance = 0;
  let similarity = 0;
  for (let i = 0; i < left.length; i++) {
    distance += Math.abs(left[i] - right[i]);
    similarity += left[i] * right.filter((r) => r === left[i]).length;
  }

  console.log(`Final distance: ${distance}`);
  console.log(`Final similarity: ${similarity}`);
}
