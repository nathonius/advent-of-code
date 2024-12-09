import { readInput } from "../shared.js";

interface Rules {
  [x: number]: number[];
}

type Update = number[];

export async function day5() {
  const { rules, updates } = processInput(await readInput("day5.txt"));
  const validUpdates: Update[] = [];
  const invalidUpdates: Update[] = [];
  for (const update of updates) {
    const valid = checkUpdate(rules, update);
    if (valid) {
      validUpdates.push(update);
    } else {
      invalidUpdates.push(update);
    }
  }

  console.log(`Found ${updates.length} updates`);
  console.log(`Found ${validUpdates.length} valid updates.`);
  //   for (const update of validUpdates) {
  //     console.log(update);
  //   }
  const fixedUpdates = invalidUpdates.map((update) =>
    fixInvalidUpdate(rules, update)
  );
  console.log(`Fixed ${fixedUpdates.length} updates`);
  console.log(`Middle sum of valid updates: ${sumUpdates(validUpdates)}`);
  console.log(`Middle sum of fixed updates: ${sumUpdates(fixedUpdates)}`);
}

function sumUpdates(updates: Update[]): number {
  // Add middles of updates
  const sum: number = updates
    .flatMap((u) => getMiddleValue(u))
    .reduce((acc: number, cur: number | null) => {
      return (acc ?? 0) + (cur ?? 0);
    }, 0);
  return sum;
}

function getMiddleValue<T>(arr: T[]): T | null {
  if (arr.length % 2 !== 1) {
    return null;
  }
  const middleIndex = Math.floor(arr.length / 2);
  return arr[middleIndex];
}

function fixInvalidUpdate(rules: Rules, update: Update): Update {
  //   console.log(`Update: ${update.join(", ")}`);
  const fixedUpdate = [...update];
  let iterations = 0;
  for (let i = 0; i < update.length; i += 1) {
    if (iterations > 100) {
      throw new Error("More than 100 iterations, aborting.");
    }
    const validation = checkPage(rules, fixedUpdate, i);
    if (validation !== null) {
      // Remove bad value
      fixedUpdate.splice(validation.index, 1);
      // Insert before current value
      fixedUpdate.splice(i, 0, validation.value);
      //   console.log(`Moved ${validation.value} from ${validation.index} to ${i}`);
      i = -1;
      iterations += 1;
    }
  }
  return fixedUpdate;
}

/**
 * Returns number that must be moved or null if valid
 */
function checkPage(
  rules: Rules,
  update: Update,
  pageIndex: number
): { value: number; index: number } | null {
  const page = update[pageIndex];
  const rule = rules[page];
  // console.log(`Checking page ${page}`);
  if (!rule) {
    //   console.log(`No rules found for ${page}.`);
    return null;
  }
  const mustMatch = update.slice(0, pageIndex);
  for (const value of rule) {
    if (update.includes(value) && !mustMatch.includes(value)) {
      //   console.log(
      //     `Update includes ${value}, but does not appear before ${page}`
      //   );
      return { value, index: update.indexOf(value) };
    }
  }
  return null;
}

function checkUpdate(rules: Rules, update: Update) {
  let valid = true;
  //   console.log(`Checking update: ${update.join(", ")}`);
  for (let i = 0; i < update.length; i += 1) {
    if (checkPage(rules, update, i) !== null) {
      valid = false;
    }
  }
  return valid;
}

function processInput(input: string[]): { rules: Rules; updates: Update[] } {
  const rules: Rules = {};
  const updates: Update[] = [];

  for (const line of input) {
    if (line.includes("|")) {
      const [a, b] = line.split("|");
      const ruleTarget = parseInt(b);
      const ruleValue = parseInt(a);
      if (!rules[ruleTarget]) {
        rules[ruleTarget] = [];
      }
      if (!rules[ruleTarget].includes(ruleValue)) {
        rules[ruleTarget].push(ruleValue);
      }
    } else if (line.includes(",")) {
      const pages = line.split(",").map((p) => parseInt(p));
      updates.push(pages);
    }
  }

  return {
    rules,
    updates,
  };
}
