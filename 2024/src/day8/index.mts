import {
  Coord,
  coordDelta,
  coordsMatch,
  getCoordsDelta,
  isValidCoordinate,
  negateDelta,
  readInput,
  toSpliced,
  valueAtCoordOrThrow,
} from "../shared.js";

const EMPTY_SPACE = ".";

export async function day8() {
  const map = (await readInput("day8.txt")).map((l) => Array.from(l));
  const antennaMap: Record<string, Coord[]> = {};
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      const val = valueAtCoordOrThrow(map, { x, y });
      if (val !== EMPTY_SPACE) {
        if (!antennaMap[val]) {
          antennaMap[val] = [];
        }
        antennaMap[val].push({ x, y });
      }
    }
  }

  const antinodes: Coord[] = [];
  for (const freq of Object.keys(antennaMap)) {
    const antennas = antennaMap[freq];
    if (antennas.length === 1) {
      continue;
    }
    for (let i = 0; i < antennas.length; i += 1) {
      const a = antennas[i];
      if (!antinodes.some((c) => coordsMatch(c, a))) {
        antinodes.push(a);
      }
      const otherAntennas = toSpliced(antennas, i, 1);
      for (const b of otherAntennas) {
        const d = getCoordsDelta(a, b);
        let positive = coordDelta(a, d);
        let negative = coordDelta(b, negateDelta(d));
        while (isValidCoordinate(map, positive)) {
          if (!antinodes.some((c) => coordsMatch(c, positive))) {
            antinodes.push(positive);
          }
          positive = coordDelta(positive, d);
        }
        while (isValidCoordinate(map, negative)) {
          if (!antinodes.some((c) => coordsMatch(c, negative))) {
            antinodes.push(negative);
          }
          negative = coordDelta(negative, negateDelta(d));
        }
      }
    }
  }

  console.log(`Found ${antinodes.length} antinodes`);
}
