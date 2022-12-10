import { readFile } from "fs/promises";

class CleaningRange {
  public low: number;
  public high: number;
  constructor(range: string) {
    [this.low, this.high] = range.split("-").map((c) => parseInt(c));
  }

  contains(other: CleaningRange): boolean {
    return this.low <= other.low && this.high >= other.high;
  }

  overlaps(other: CleaningRange): boolean {
    return this.high >= other.low && other.low >= this.low;
  }
}

async function main() {
  // Parse input file
  const data = (await readFile("src/day4/data")).toString().split("\n");
  const ranges: Array<CleaningRange[]> = [];
  data.forEach((l) => {
    if (l) {
      const [a, b] = l.split(",");
      ranges.push([new CleaningRange(a), new CleaningRange(b)]);
    }
  });

  // Find pairs that contain each other
  let redundantPairs = 0;
  ranges.forEach((r) => {
    if (r[0].contains(r[1]) || r[1].contains(r[0])) {
      redundantPairs += 1;
    }
  });

  console.log(`Redundant pairs: ${redundantPairs}`);

  // Problem 2
  let overlappingPairs = 0;
  ranges.forEach((r) => {
    if (r[0].overlaps(r[1]) || r[1].overlaps(r[0])) {
      overlappingPairs += 1;
    }
  });
  console.log(`Overlapping paris: ${overlappingPairs}`);
}

export default main;
