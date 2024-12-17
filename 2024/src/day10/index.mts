import {
  Coord,
  getSurroundingCoordinates,
  Mappish,
  readMapInput,
  uniqueCoords,
  valueAtCoord,
  valueAtCoordOrThrow,
} from "../shared.js";

export async function day10() {
  const map: Mappish<number> = await readMapInput("day10.txt", "number");
  const trailheads: Coord[] = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (valueAtCoord(map, { x, y }) === 0) {
        trailheads.push({ x, y });
      }
    }
  }
  console.log(`Total trailheads ${trailheads.length}`);
  const uniqueTrailEnds: Coord[] = [];
  let uniqueTrails: number = 0;
  for (const h of trailheads) {
    followTrail(map, h, true).forEach((e) => uniqueTrailEnds.push(e));
    uniqueTrails += followTrail(map, h, false).length;
  }
  console.log(`Total unqiue trail ends ${uniqueTrailEnds.length}`);
  console.log(`Total unique trails ${uniqueTrails}`);
}

function followTrail(
  map: Mappish<number>,
  start: Coord,
  filterUnique: boolean
): Coord[] {
  const currentVal = valueAtCoordOrThrow<number>(map, start);
  if (currentVal === 9) {
    return [start];
  }
  const surrounding = getSurroundingCoordinates(map, start).filter(
    (c) => valueAtCoordOrThrow(map, c) === currentVal + 1
  );

  if (surrounding.length === 0) {
    return [];
  }
  const reachable = [
    ...surrounding.flatMap((c) => followTrail(map, c, filterUnique)),
  ];
  if (filterUnique) {
    return uniqueCoords(reachable);
  }
  return reachable;
}
