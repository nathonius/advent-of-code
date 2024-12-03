import { readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function getDirname() {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..");
}

export function readInput(path: string): Promise<string[]> {
  const inputPath = join(getDirname(), "input", path);
  return readFile(inputPath, { encoding: "utf-8" }).then((content) =>
    content.split("\n")
  );
}
