import { readFile } from "fs/promises";
import { Directory } from "./directory";
import { join as pathJoin } from "path";

// Constants
const totalSystemSize = 70000000;
const targetFreeSize = 30000000;

// Global State

// Current path is an array of path segments
// When empty, we are at the root /
let currentPath: string[] = [];

const root = new Directory("");
// All directories, as a dictionary keyed on their full paths
const directories: Record<string, Directory> = { "": root };

async function main() {
  // read data
  const data = (await readFile("out/day7/data")).toString().split("\n");

  // parse command input
  data.forEach((line) => {
    try {
      const currentFullPath = join(...currentPath);
      if (line.startsWith("$")) {
        handleCommand(line);
      } else if (line.startsWith("dir ")) {
        // this is a dir within an ls command output
        const target = line.slice(4);
        const targetFullPath = join(currentFullPath, target);
        if (!Object.keys(directories).includes(targetFullPath)) {
          const dir = new Directory(target);
          directories[targetFullPath] = dir;
          dir.parent = directories[currentFullPath];
          dir.parent.children[target] = dir;
        }
      } else {
        // this is a file with a size
        const [fileSize, fileName] = line.split(" ");
        directories[currentFullPath].children[fileName] = parseInt(fileSize);
      }
    } catch (err) {
      console.log("ERROR on line");
      console.log(line);
      console.log(directories);
      printTree();
      throw err;
    }
  });

  // Log tree
  printTree();

  // Find directories less than or equal to 100000 in size, add totals
  let totalSize = 0;
  Object.values(directories).forEach((d) => {
    const size = d.getSize();
    if (size <= 100000) {
      totalSize += size;
    }
  });

  console.log(`TOTAL SIZE: ${totalSize}`);

  // Find a directory to delete
  const currentSystemSize = directories[""].getSize();
  const unusedSpace = totalSystemSize - currentSystemSize;
  const delta = targetFreeSize - unusedSpace;

  // Find all directories of size >= the delta
  const largeEnoughDirs: Directory[] = [];
  Object.values(directories).forEach((d) => {
    const size = d.getSize();
    if (size >= delta) {
      largeEnoughDirs.push(d);
    }
  });

  largeEnoughDirs.sort((a, b) => (a.getSize() > b.getSize() ? 1 : -1));

  console.log(`DIRECTORY TO DELETE: ${largeEnoughDirs[0].fullPath}`);
  console.log(`DIR SIZE: ${largeEnoughDirs[0].getSize()}`);
}

function handleCommand(command: string): void {
  if (command.startsWith("$ cd ")) {
    const target = command.slice(5).trim();
    handleCd(target);
  }
  // Don't need to handle ls commands, just ignore.
}

function handleCd(target: string): void {
  console.log(`CD Target: ${target}`);
  const previousPath = join(...currentPath);
  if (target === "/") {
    currentPath = [];
    return;
  } else if (target === "..") {
    currentPath.pop();
    return;
  } else {
    currentPath.push(target);
    const fullPath = join(...currentPath);
    if (!Object.keys(directories).includes(fullPath)) {
      const dir = new Directory(target);
      directories[fullPath] = dir;
      dir.parent = directories[previousPath];
      dir.parent.children[target] = dir;
    }
    return;
  }
}

function printTree(start = root, level = 0): void {
  const indent = "\t".repeat(level);
  console.log(`${indent}${start.fullPath}`);
  // log files
  Object.keys(start.children)
    .filter((k) => typeof start.children[k] === "number")
    .forEach((k) => {
      console.log(`${indent}${k}: ${start.children[k]}`);
    });

  // log directories
  Object.values(start.children)
    .filter((c) => typeof c !== "number")
    .forEach((d) => {
      printTree(d as Directory, level + 1);
    });
}

function join(...pathSegments: string[]): string {
  if (pathSegments.length === 0) {
    return "";
  } else {
    return pathJoin(...pathSegments);
  }
}

export default main;
