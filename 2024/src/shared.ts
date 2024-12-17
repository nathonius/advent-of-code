import { dirname, join, resolve } from "node:path";

import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import readline from "node:readline";

export interface Coord {
  x: number;
  y: number;
}

export type SimpleDirection = "N" | "E" | "S" | "W";
export type Direction = SimpleDirection | "NE" | "NW" | "SE" | "SW";

export const DIR_TO_DELTA: Record<Direction, Coord> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
  NE: { x: 1, y: -1 },
  NW: { x: -1, y: -1 },
  SE: { x: 1, y: 1 },
  SW: { x: -1, y: 1 },
};

export const SIMPLE_DIR_TO_DELTA: Record<SimpleDirection, Coord> = {
  N: DIR_TO_DELTA["N"],
  E: DIR_TO_DELTA["E"],
  S: DIR_TO_DELTA["S"],
  W: DIR_TO_DELTA["W"],
};

export const DIR_PLUS_90: Record<SimpleDirection, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

export function replaceCharAt(val: string, replacement: string, index: number) {
  const asArray = Array.from(val);
  asArray[index] = replacement;
  return asArray.join("");
}

export function getCoordsDelta(a: Coord, b: Coord): Coord {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function negateDelta(delta: Coord): Coord {
  return { x: delta.x * -1, y: delta.y * -1 };
}

export function coordDelta(point: Coord, delta: Coord): Coord {
  return { x: point.x + delta.x, y: point.y + delta.y };
}

export function coordsMatch(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function multiplyCoord(a: Coord, b: number): Coord {
  return { x: a.x * b, y: a.y * b };
}

export function modCoord(a: Coord, b: number): Coord {
  return { x: a.x % b, y: a.y % b };
}

export type Mappish<T extends string | number> = T extends string
  ? string[] | string[][]
  : number[][];

export function getSurroundingCoordinates(
  map: Mappish<any>,
  coord: Coord,
  diagonals = false,
  includeInvalid = false
): Coord[] {
  const deltas = diagonals ? DIR_TO_DELTA : SIMPLE_DIR_TO_DELTA;
  const surrounding: Coord[] = [];
  for (const delta of Object.values(deltas)) {
    const val = coordDelta(coord, delta);
    if (includeInvalid || isValidCoordinate(map, val)) {
      surrounding.push(val);
    }
  }
  return surrounding;
}

export function isValidCoordinate<T extends string | number>(
  map: Mappish<T>,
  coord: Coord
): boolean {
  return (
    coord !== undefined &&
    coord.x >= 0 &&
    coord.y >= 0 &&
    coord.y < map.length &&
    coord.x < map[0].length
  );
}

export function uniqueCoords(coords: Coord[]): Coord[] {
  let unique: Coord[] = [];
  for (const c of coords) {
    if (!unique.some((u) => coordsMatch(u, c))) {
      unique.push(c);
    }
  }
  return unique;
}

export function valueAtCoord<T extends string | number>(
  map: Mappish<T>,
  coord: Coord
): T | null {
  if (!isValidCoordinate(map, coord)) {
    return null;
  }
  return map[coord.y][coord.x] as T;
}

export function valueAtCoordOrThrow<T extends string | number>(
  map: Mappish<T>,
  coord: Coord
): T {
  const value = valueAtCoord(map, coord);
  if (value === null || value === undefined) {
    throw new Error(`Invalid coordinate ${coord.x},${coord.y}`);
  }
  return value;
}

export function toSpliced<T>(
  arr: T[],
  startIndex: number,
  deleteCount: number
) {
  const newArr = [...arr];
  newArr.splice(startIndex, deleteCount);
  return newArr;
}

export function arraySwap<T>(source: T[], a: number, b: number): void {
  const temp = source[a];
  source[a] = source[b];
  source[b] = temp;
}

export function renderMap(map: string[] | string[][]): void {
  for (const line of map) {
    for (const pos of line) {
      process.stdout.write(pos);
    }
    process.stdout.write("\n");
  }
}

export function sumArray(values: number[]): number {
  return values.reduce((acc, cur) => acc + cur, 0);
}

export function multArray(values: number[]): number {
  return values.reduce((acc, cur) => acc * cur, 1);
}

export function getLargest(values: number[]): number {
  return values.toSorted()[values.length - 1];
}

export function getDirname() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..");
}

type MapOutputType<T extends "string" | "number"> = T extends "string"
  ? string
  : number;
export async function readMapInput<T extends "string" | "number">(
  path: string,
  outputType: T
): Promise<MapOutputType<T>[][]> {
  const lines = await readInput(path);
  const mappish = lines.map((l) => Array.from(l));
  if (outputType === "number") {
    return mappish.map((row) =>
      row.map((val) => parseInt(val))
    ) as MapOutputType<T>[][];
  }
  return mappish as MapOutputType<T>[][];
}

export async function readInput(
  path: string,
  split: string | null = "\n"
): Promise<string[]> {
  const inputPath = join(getDirname(), "input", path);
  const content = await readFile(inputPath, { encoding: "utf-8" });
  if (split) {
    return content.split(split);
  }
  return [content];
}

export function getQuestionInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function askQuestion(rl: readline.Interface, question = "") {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}
