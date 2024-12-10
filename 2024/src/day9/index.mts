import { arraySwap, readInput } from "../shared.js";

type Empty = null;

interface FileBlock {
  id: number;
  sequence: number;
  length: number;
}

type FileMap = (FileBlock | Empty)[];

export async function day9() {
  const diskmap = Array.from((await readInput("day9.txt", null))[0]).map((d) =>
    parseInt(d)
  );
  const fileMap: FileMap = [];
  let fileId = 0;
  for (let i = 0; i < diskmap.length; i += 1) {
    const isFileDescriptor = i % 2 === 0;
    if (isFileDescriptor) {
      for (let j = 0; j < diskmap[i]; j += 1) {
        fileMap.push({ id: fileId, sequence: j, length: diskmap[i] });
      }
      fileId += 1;
    } else {
      const emptySpace: Empty[] = Array(diskmap[i]).fill(null);
      fileMap.push(...emptySpace);
    }
  }
  renderFilemap(fileMap);
  console.log("Compressing (simple)...");
  const compressed = [...fileMap];
  for (let i = fileMap.length - 1; i >= 0; i -= 1) {
    const firstEmpty = compressed.findIndex((b) => b === null);
    if (firstEmpty === -1) {
      throw new Error("Not enough disk space.");
    }
    if (firstEmpty < i) {
      arraySwap(compressed, i, firstEmpty);
    }
  }
  renderFilemap(compressed);
  console.log(`Compressed (simple) checksum: ${checksum(compressed)}`);

  // -- part 2
  const compressed2 = [...fileMap];
  for (let i = fileId - 1; i > 0; i -= 1) {
    const firstBlockIndex = compressed2.findIndex((b) => b?.id === i);
    const fileLength = compressed2[firstBlockIndex]!.length;
    const asString = compressed2.map((b) => (b === null ? "." : "f")).join("");
    const firstAvailableSpace = asString.indexOf(".".repeat(fileLength));
    if (firstAvailableSpace !== -1 && firstAvailableSpace < firstBlockIndex) {
      for (let j = 0; j < fileLength; j += 1) {
        arraySwap(compressed2, firstAvailableSpace + j, firstBlockIndex + j);
      }
    }
  }
  renderFilemap(compressed2);
  console.log(`Compressed checksum: ${checksum(compressed2)}`);
}

function checksum(map: FileMap): number {
  let sum = 0;
  for (let i = 0; i < map.length; i += 1) {
    const val = map[i];
    if (val !== null) {
      sum += i * val.id;
    }
  }
  return sum;
}

function renderFilemap(map: FileMap, truncate = 60) {
  console.log(
    map
      .slice(0, truncate)
      .map((b) => {
        if (b === null) {
          return ".";
        } else {
          return b.id;
        }
      })
      .join("") + ` and ${Math.max(0, map.length - truncate)} more`
  );
}
