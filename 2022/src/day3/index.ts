import { readFile } from "fs/promises";
import { Sack } from "./sack";

async function main() {
  let sacks: Sack[] = [];
  // Parse input file
  const data = (await readFile("src/day3/data")).toString().split("\n");
  data.forEach((l) => {
    if (l) {
      sacks.push(new Sack(l));
    }
  });

  let totalPriority = 0;
  // Find common item in each compartment, add priorities
  sacks.forEach((sack) => {
    const compartment1 = sack.compartment1;
    const compartment2 = sack.compartment2;
    for (let i = 0; i < compartment1.length; i++) {
      const searchChar = compartment1[i];
      if (compartment2.includes(searchChar)) {
        // console.log(
        //   `Common Item: ${searchChar} (${characterToPriority(searchChar)})`
        // );
        totalPriority += characterToPriority(searchChar);
        break;
      }
    }
  });

  console.log(`Total priority value of matched items: ${totalPriority}`);

  // Problem 2

  let badgePriority = 0;
  // Split into groups of three and find common item
  for (let i = 0; i < sacks.length; i += 3) {
    const group = [sacks[i], sacks[i + 1], sacks[i + 2]];
    for (let j = 0; j < group[0].contents.length; j++) {
      const searchChar = group[0].contents[j];
      if (
        group[1].contents.includes(searchChar) &&
        group[2].contents.includes(searchChar)
      ) {
        badgePriority += characterToPriority(searchChar);
        break;
      }
    }
  }

  console.log(`Total priority of group badges: ${badgePriority}`);
}

function characterToPriority(char: string): number {
  const charCode = char.charCodeAt(0);
  // Lowercase
  if (charCode >= 97) {
    return charCode - 96;
  } else {
    return charCode - 38;
  }
}

export default main;
