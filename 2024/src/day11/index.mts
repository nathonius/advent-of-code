import { readInput } from "../shared.js";

type StoneMap = Record<number, number>;
const blinks = 75;

export async function day11() {
  let stones: StoneMap = {};
  const input = (await readInput("day11.txt", " ")).map((v) => parseInt(v));
  addStones(stones, input, 1);

  for (let i = 0; i < blinks; i += 1) {
    const newStones: StoneMap = {};
    for (const [stone, count] of Object.entries(stones)) {
      const result = handleStone(parseInt(stone));
      addStones(newStones, result, count);
    }
    stones = newStones;
  }

  const finalStoneCount = Object.values(stones).reduce(
    (acc, cur) => acc + cur,
    0
  );
  console.log(`Total stones after ${blinks} blinks: ${finalStoneCount}`);
}

function addStones(
  stones: Record<number, number>,
  result: number[],
  count: number
): void {
  for (const s of result) {
    if (!stones[s]) {
      stones[s] = count;
    } else {
      stones[s] += count;
    }
  }
}

function handleStone(stone: number): number[] {
  if (stone === 0) {
    return [1];
  } else if (stone.toString().length % 2 === 0) {
    const asString = stone.toString();
    const left = parseInt(asString.slice(0, asString.length / 2));
    const right = parseInt(asString.slice(asString.length / 2));
    return [left, right];
  } else {
    return [stone * 2024];
  }
}
