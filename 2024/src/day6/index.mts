import {
  askQuestion,
  coordsMatch,
  getQuestionInterface,
  isValidCoordinate,
  readInput,
  renderMap,
  replaceCharAt,
} from "../shared.js";

const EMPTY_SPACE = ".";
const OBSTRUCTION = "#";
const GUARD_N = "^";
const GUARD_S = "v";
const GUARD_E = ">";
const GUARD_W = "<";
type Guard = typeof GUARD_N | typeof GUARD_E | typeof GUARD_S | typeof GUARD_W;
type MapItem = typeof EMPTY_SPACE | typeof OBSTRUCTION | Guard;
type Direction = "N" | "E" | "S" | "W";
interface Coord {
  x: number;
  y: number;
}
const GUARD_TO_DIR: Record<string, Direction> = {
  [GUARD_N]: "N",
  [GUARD_E]: "E",
  [GUARD_S]: "S",
  [GUARD_W]: "W",
};
const DIR_TO_GUARD: Record<Direction, Guard> = {
  N: GUARD_N,
  E: GUARD_E,
  S: GUARD_S,
  W: GUARD_W,
};
const DIR_TO_DELTA: Record<Direction, Coord> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};
const DIR_PLUS_90: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};
type MapSource = string[][];
interface GuardStatus {
  coord: Coord;
  direction: Direction;
}

class Map {
  public guardCoord: Coord = { x: 0, y: 0 };
  public guardDir: Direction = "N";
  public source: MapSource;
  public offMap = false;

  constructor(public readonly lines: string[]) {
    this.source = lines.map((line) => Array.from(line));
    this.initGuard();
  }

  get guard(): GuardStatus {
    return { coord: this.guardCoord, direction: this.guardDir };
  }

  render() {
    renderMap(this.source);
  }

  initGuard() {
    const source = this.source;
    // find the guard first
    const guards = [GUARD_N, GUARD_E, GUARD_S, GUARD_W];
    for (let y = 0; y < source.length; y += 1) {
      for (let x = 0; x < source[y].length; x += 1) {
        if (guards.includes(source[y][x])) {
          this.guardCoord = { x, y };
          this.guardDir = GUARD_TO_DIR[source[y][x]];
          return;
        }
      }
    }
    throw new Error("Could not find guard on map.");
  }

  itemAtCoord(coord: Coord): MapItem | null {
    if (this.invalidCoordinate(coord)) {
      return null;
    }
    return this.source[coord.y][coord.x] as MapItem;
  }

  nextGuardPos(): GuardStatus {
    const delta = DIR_TO_DELTA[this.guardDir];
    const nextCoord: Coord = {
      x: this.guardCoord.x + delta.x,
      y: this.guardCoord.y + delta.y,
    };
    const itemAtNextCoord = this.itemAtCoord(nextCoord);
    if (itemAtNextCoord === OBSTRUCTION) {
      //   console.log(
      //     `Guard rotating from ${this.guardDir} to ${DIR_PLUS_90[this.guardDir]}`
      //   );
      this.guardDir = DIR_PLUS_90[this.guardDir];
      this.updateSource(this.guardCoord, DIR_TO_GUARD[this.guardDir]);
    } else if (itemAtNextCoord === EMPTY_SPACE) {
      //   console.log(
      //     `Guard moving ${this.guardDir} from ${this.guardCoord.x},${this.guardCoord.y} to ${nextCoord.x},${nextCoord.y}`
      //   );
      const oldGuard = this.updateSource(this.guardCoord, EMPTY_SPACE);
      this.updateSource(nextCoord, oldGuard);
      this.guardCoord = nextCoord;
    } else if (itemAtNextCoord === null) {
      //   console.log(`Guard has left map.`);
      this.offMap = true;
    }
    return this.guard;
  }

  /**
   * Returns what used to be at that position
   */
  updateSource(coord: Coord, newValue: MapItem): MapItem {
    if (this.invalidCoordinate(coord)) {
      return OBSTRUCTION;
    }
    const oldValue = this.source[coord.y][coord.x];
    this.source[coord.y][coord.x] = newValue;
    return oldValue as MapItem;
  }

  invalidCoordinate(coord: Coord): boolean {
    return !isValidCoordinate(this.source, coord);
  }
}

export async function day6() {
  const rl = getQuestionInterface();
  const input = await readInput("day6.txt");
  const map = new Map(input);
  const guardPositions: GuardStatus[] = [];
  // map.render();
  // await askQuestion(rl);
  while (!map.offMap) {
    guardPositions.push(map.guard);
    map.nextGuardPos();
    // map.render();
    // await askQuestion(rl);
  }

  console.log(`Guard moved/rotated ${guardPositions.length} times`);

  const uniqueCoords: Coord[] = [];
  for (const position of guardPositions) {
    if (!uniqueCoords.some((c) => coordsMatch(c, position.coord))) {
      uniqueCoords.push(position.coord);
    }
  }

  console.log(`Guard was at ${uniqueCoords.length} unique positions.`);

  console.log("PART 2");
  const loopCoords: Coord[] = [];
  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      if (
        input[y][x] !== EMPTY_SPACE ||
        !uniqueCoords.some((c) => coordsMatch(c, { x, y }))
      ) {
        continue;
      }
      process.stdout.write(".");
      const newInput = [...input];
      const oldLine = newInput[y];
      const newLine = replaceCharAt(oldLine, OBSTRUCTION, x);
      newInput[y] = newLine;
      const testMap = new Map(newInput);

      const guardPositions: GuardStatus[] = [];
      while (!testMap.offMap && !isLoop(guardPositions)) {
        // testMap.render();
        guardPositions.push(testMap.guard);
        testMap.nextGuardPos();
        // await askQuestion(rl);
      }
      if (isLoop(guardPositions)) {
        loopCoords.push({ x, y });
      }
    }
  }
  console.log(
    `\nFound ${loopCoords.length} possible placements for obstructions`
  );
  rl.close();
}

function isLoop(positions: GuardStatus[]): boolean {
  if (
    positions.length > 1 &&
    positions
      .slice(0, positions.length - 1)
      .some((p) => guardsMatch(p, positions[positions.length - 1]))
  ) {
    return true;
  }
  return false;
}

function guardsMatch(a: GuardStatus, b: GuardStatus): boolean {
  return coordsMatch(a.coord, b.coord) && a.direction === b.direction;
}
