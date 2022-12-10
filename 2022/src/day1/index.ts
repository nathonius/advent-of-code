import { readFile } from "fs/promises";
import { Elf } from "./elf";

async function main() {
  // Parse input file
  const data = (await readFile("src/day1/data")).toString().split("\n");
  let currentElfFoods: number[] = [];

  const elves: Elf[] = [];

  data.forEach((l) => {
    if (!l.trim()) {
      const newElf = new Elf(currentElfFoods);
      elves.push(newElf);
      currentElfFoods = [];
    } else {
      currentElfFoods.push(parseInt(l.trim()));
    }
  });

  // Get total calories carried by elf with most calories
  elves.sort((a, b) => (a.totalCalories > b.totalCalories ? -1 : 1));

  console.log(`Max calories carried by one: ${elves[0].totalCalories}`);
  console.log(
    `Calories carried by top three: ${elves
      .slice(0, 3)
      .reduce((a, b) => a + b.totalCalories, 0)}`
  );
}

export default main;
