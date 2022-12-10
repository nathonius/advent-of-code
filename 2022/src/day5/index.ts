import { readFile } from "fs/promises";

const moveRegex = /^move (?<toMove>\d+) from (?<source>\d+) to (?<target>\d+)$/;

interface Move {
  toMove: number;
  source: number;
  target: number;
}

async function main() {
  // Parse input file
  const data = (await readFile("src/day5/data")).toString().split("\n");

  // Read stacks
  let i = 0;

  const stacks: Array<string[]> = [];

  for (; data[i]; i++) {
    // Read this line
    const line = data[i];

    // Quit if this is the last line of the crates
    if (!isNaN(parseInt(line[1]))) {
      i += 2;
      break;
    }

    // Initialize stacks
    if (i === 0) {
      const totalStacks = (line.length + 1) / 4;
      console.log(`Total Stacks: ${totalStacks}`);
      for (let i = 0; i < totalStacks; i++) {
        stacks.push([]);
      }
    }

    // Push crates onto stack
    for (let j = 0, stack = 0; j < line.length; j += 4, stack++) {
      const content = line.slice(j, j + 3).trim();
      // push crate onto stack
      if (content.indexOf("[") !== -1) {
        stacks[stack].push(content[1]);
      }
    }
  }

  // Execute moves
  for (; i < data.length; i++) {
    const regexResult = moveRegex.exec(data[i]);
    if (!regexResult) {
      continue;
    }
    const result = regexResult?.groups as {
      toMove: string;
      source: string;
      target: string;
    };
    const move: Move = {
      toMove: parseInt(result.toMove),
      source: parseInt(result.source) - 1,
      target: parseInt(result.target) - 1,
    };

    // Problem 1
    // for (let step = 0; step < move.toMove; step++) {
    //   const crate = stacks[move.source].shift();
    //   if (crate) {
    //     stacks[move.target].unshift(crate);
    //   }
    // }

    // Problem 2
    const moveStack = stacks[move.source].splice(0, move.toMove);
    stacks[move.target].unshift(...moveStack);
  }

  // Get top of each stack
  let top = "";
  stacks.forEach((s) => {
    if (s.length > 0) {
      top += s[0];
    }
  });
  console.log(`Top of stacks: ${top}`);
}

export default main;
