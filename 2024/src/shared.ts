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

type Mappish = string[] | string[][];

export function isValidCoordinate(map: Mappish, coord: Coord): boolean {
  return (
    coord.x >= 0 &&
    coord.y >= 0 &&
    coord.y < map.length &&
    coord.x < map[0].length
  );
}

export function valueAtCoord(map: Mappish, coord: Coord): string | null {
  if (!isValidCoordinate(map, coord)) {
    return null;
  }
  return map[coord.y][coord.x];
}

export function valueAtCoordOrThrow(map: Mappish, coord: Coord): string {
  const value = valueAtCoord(map, coord);
  if (value === null) {
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
