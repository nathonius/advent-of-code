import { readFile } from "fs/promises";

const packetMarkerSize = 4;
const messageMarkerSize = 14;

async function main() {
  // Parse input file
  const data = (await readFile("src/day6/data")).toString().trim();
  const packetMarker = findMarker(data, packetMarkerSize);

  console.log(`Packet begins at ${packetMarker + packetMarkerSize}`);

  const messageMarker = findMarker(data, messageMarkerSize);
  console.log(`Message begins at ${messageMarker + messageMarkerSize}`);
}

function findMarker(test: string, size: number, start = 0): number {
  let i = start;
  for (; i < test.length; i++) {
    const window = test.slice(i, i + size);
    if (isMarker(window)) {
      break;
    }
  }
  return i;
}

function isMarker(test: string): boolean {
  for (let i = 0; i < test.length; i++) {
    if (test.lastIndexOf(test[i]) !== i) {
      return false;
    }
  }
  return true;
}

export default main;
