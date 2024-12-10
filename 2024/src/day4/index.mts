import { readInput } from "../shared.js";

let puzzleWidth = 0;
let puzzleLength = 0;

export async function day4() {
  const input = await readInput("day4.txt");
  const puzzle: Puzzle = input.map((line) => Array.from(line));
  // We assume all lines are the same length
  puzzleWidth = input[0].length;
  puzzleLength = input.length;
  console.log(`Reading puzzle of size ${puzzleWidth}x${puzzleLength}...`);
  let xmasMatches = 0;
  let xmasXMatches = 0;
  for (let y = 0; y < puzzleLength; y += 1) {
    for (let x = 0; x < puzzleWidth; x += 1) {
      xmasMatches += checkWordMatch(
        puzzle,
        { x, y },
        "XMAS",
        Object.values(DeltaMap)
      );
      xmasXMatches += checkXMatch(puzzle, { x, y });
    }
  }
  console.log(`Found ${xmasMatches} for 'XMAS'.`);
  console.log(`Found ${xmasXMatches} for 'X-MAS'.`);
}

type Puzzle = string[][];

interface Coord {
  x: number;
  y: number;
}

interface MatchDirection {
  xDelta: number;
  yDelta: number;
}

enum Direction {
  NW,
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
}

const DeltaMap: Record<Direction, MatchDirection> = {
  [Direction.NW]: { xDelta: -1, yDelta: -1 },
  [Direction.N]: { xDelta: 0, yDelta: -1 },
  [Direction.NE]: { xDelta: 1, yDelta: -1 },
  [Direction.E]: { xDelta: 1, yDelta: 0 },
  [Direction.SE]: { xDelta: 1, yDelta: 1 },
  [Direction.S]: { xDelta: 0, yDelta: 1 },
  [Direction.SW]: { xDelta: -1, yDelta: 1 },
  [Direction.W]: { xDelta: -1, yDelta: 0 },
};

function checkXMatch(puzzle: Puzzle, coord: Coord): number {
  if (puzzle[coord.y][coord.x] !== "A") {
    return 0;
  }
  let matchCount = 0;
  const startCoord1 = getNextCoord(coord, DeltaMap[Direction.NE]);
  const startCoord2 = getNextCoord(coord, DeltaMap[Direction.NW]);
  if (startCoord1 === null || startCoord2 === null) {
    return 0;
  }
  matchCount += checkWordMatch(puzzle, startCoord1, "MAS", [
    DeltaMap[Direction.SW],
  ]);
  matchCount += checkWordMatch(puzzle, startCoord1, "SAM", [
    DeltaMap[Direction.SW],
  ]);
  matchCount += checkWordMatch(puzzle, startCoord2, "MAS", [
    DeltaMap[Direction.SE],
  ]);
  matchCount += checkWordMatch(puzzle, startCoord2, "SAM", [
    DeltaMap[Direction.SE],
  ]);
  if (matchCount === 2) {
    return 1;
  }
  return 0;
}

function checkWordMatch(
  puzzle: Puzzle,
  coord: Coord,
  target: string,
  directions: MatchDirection[]
): number {
  let matchCount = 0;
  for (const direction of directions) {
    // for (const direction of [DeltaMap[Direction.E]]) {
    let match = puzzle[coord.y][coord.x];
    let currentCoord: Coord | null = coord;
    while (
      currentCoord !== null &&
      target.includes(match) &&
      target !== match
    ) {
      // console.log(
      //   `Match: ${match}\tCoord: ${currentCoord.x}, ${currentCoord.y}`
      // );
      const nextCoord = getNextCoord(currentCoord, direction);
      if (nextCoord !== null) {
        match += puzzle[nextCoord.y][nextCoord.x];
      }
      currentCoord = nextCoord;
    }
    if (match === target) {
      matchCount += 1;
    }
  }
  return matchCount;
}

function getNextCoord(coord: Coord, direction: MatchDirection): Coord | null {
  const nextX = coord.x + direction.xDelta;
  const nextY = coord.y + direction.yDelta;
  // console.log(`Next coord: ${nextX}, ${nextY}`);
  if (nextX < 0 || nextY < 0 || nextX >= puzzleWidth || nextY >= puzzleLength) {
    return null;
  }
  return {
    x: nextX,
    y: nextY,
  };
}
