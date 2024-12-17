import {
  Coord,
  coordDelta,
  coordsMatch,
  DIR_TO_DELTA,
  Direction,
  getSurroundingCoordinates,
  isValidCoordinate,
  Mappish,
  readMapInput,
  SIMPLE_DIR_TO_DELTA,
  sumArray,
  uniqueCoords,
  valueAtCoord,
  valueAtCoordOrThrow,
} from "../shared.js";

export async function day12() {
  const input = await readMapInput("day12-test.txt", "string");
  let unvisitedCoords: Coord[] = [];
  console.log(`Got map input.`);
  for (let y = 0; y < input.length; y += 1) {
    for (let x = 0; x < input[y].length; x += 1) {
      unvisitedCoords.push({ x, y });
    }
  }

  // Find all regions
  const regions: Coord[][] = [];
  while (unvisitedCoords.length > 0) {
    const start = unvisitedCoords.shift()!;
    const region = walkRegion(input, start, [...unvisitedCoords]);
    if (region.length > 0) {
      regions.push(region);
      unvisitedCoords = unvisitedCoords.filter(
        (c) => !region.some((r) => coordsMatch(r, c))
      );
    }
  }

  console.log(`Finished walking regions.`);

  // Calculate region costs
  const totalCost = sumArray(regions.map((r) => regionCost(input, r)));
  const totalDiscountedCost = sumArray(
    regions.map((r) => discountedRegionCost(input, r))
  );

  console.log(`Total cost for ${regions.length} regions: ${totalCost}`);
  console.log(
    `Total discounted cost ${regions.length} regions: ${totalDiscountedCost}`
  );
  for (const r of regions) {
    const regionValue = valueAtCoordOrThrow<string>(input, r[0]);
    const sides = getRegionSides(input, r);
    const area = r.length;
    console.log(
      `A region of ${regionValue} plants with price ${area} * ${sides} = ${
        area * sides
      }`
    );
  }
}

function discountedRegionCost(map: Mappish<string>, region: Coord[]): number {
  const sides = getRegionSides(map, region);
  console.log(
    `Total sides for region ${valueAtCoordOrThrow<string>(
      map,
      region[0]
    )}: ${sides}`
  );
  return sides * region.length;
}

function getRegionSides(map: Mappish<string>, region: Coord[]): number {
  if (region.length === 1) {
    return 4;
  }
  let sides = 0;
  for (const c of region) {
    if (coordHasThreeSides(map, c)) {
      sides += 2;
    } else if (coordIsOutsideCorner(map, c)) {
      sides += 1;
    }
    if (coordIsInsideCorner(map, c)) {
      sides += 1;
    }
  }
  return sides;
}

function coordHasThreeSides(map: Mappish<string>, coord: Coord): boolean {
  const regionValue = valueAtCoordOrThrow<string>(map, coord);
  const { N, E, S, W } = getCardinalValues(map, coord);
  if ([N, E, S, W].filter((v) => v !== regionValue).length === 3) {
    return true;
  }
  return false;
}

/**
 * Returns true if this coord is a top left or bottom right corner
 */
function coordIsOutsideCorner(map: Mappish<string>, coord: Coord): boolean {
  const regionValue = valueAtCoordOrThrow<string>(map, coord);
  const { N, E, S, W } = getCardinalValues(map, coord);
  if (
    N !== regionValue &&
    W !== regionValue &&
    S === regionValue &&
    E === regionValue
  ) {
    return true;
  }
  if (
    N === regionValue &&
    W === regionValue &&
    S !== regionValue &&
    E !== regionValue
  ) {
    return true;
  }
  if (
    N === regionValue &&
    W !== regionValue &&
    S !== regionValue &&
    E === regionValue
  ) {
    return true;
  }
  if (
    N !== regionValue &&
    W === regionValue &&
    S === regionValue &&
    E !== regionValue
  ) {
    return true;
  }
  return false;
}

function coordIsInsideCorner(map: Mappish<string>, coord: Coord): boolean {
  const regionValue = valueAtCoordOrThrow<string>(map, coord);
  const { N, NE, NW, S, SE, SW, W, E } = getCardinalValues(map, coord);
  if (
    NE !== null &&
    NE !== regionValue &&
    N === regionValue &&
    E === regionValue
  ) {
    return true;
  }
  if (
    NW !== null &&
    NW !== regionValue &&
    N === regionValue &&
    W === regionValue
  ) {
    return true;
  }
  if (
    SE !== null &&
    SE !== regionValue &&
    S === regionValue &&
    E === regionValue
  ) {
    return true;
  }
  if (
    SW !== null &&
    SW !== regionValue &&
    S === regionValue &&
    W === regionValue
  ) {
    return true;
  }
  return false;
}

function getCardinalValues(
  map: Mappish<string>,
  coord: Coord
): Record<Direction, string | null> {
  const N = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["N"]));
  const W = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["W"]));
  const S = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["S"]));
  const E = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["E"]));
  const NE = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["NE"]));
  const NW = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["NW"]));
  const SE = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["SE"]));
  const SW = valueAtCoord<string>(map, coordDelta(coord, DIR_TO_DELTA["SW"]));
  return {
    N,
    E,
    S,
    W,
    NE,
    NW,
    SE,
    SW,
  };
}

// function getSide(
//   map: Mappish<string>,
//   region: Coord[],
//   start: Coord,
//   direction: Coord
// ): { start: Coord; end: Coord } {}

function regionCost(map: Mappish<string>, region: Coord[]): number {
  const regionValue = valueAtCoordOrThrow<string>(map, region[0]);
  const area = region.length;
  let perimeter = 0;
  for (const c of region) {
    const surrounding = getSurroundingCoordinates(map, c, false, true);
    surrounding.forEach((s) => {
      if (
        !isValidCoordinate(map, s) ||
        valueAtCoordOrThrow<string>(map, s) !== regionValue
      ) {
        perimeter += 1;
      }
    });
  }
  return area * perimeter;
}

function walkRegion(
  map: Mappish<string>,
  start: Coord,
  possiblePositions: Coord[]
): Coord[] {
  const currentVal = valueAtCoordOrThrow<string>(map, start);
  const surrounding = getSurroundingCoordinates(map, start).filter(
    (p) => valueAtCoordOrThrow(map, p) === currentVal
  );

  // Ensure this is an unvisited coordinate
  for (let i = 0; i < surrounding.length; i += 1) {
    const matchingIndex = possiblePositions.findIndex((p) =>
      coordsMatch(p, surrounding[i])
    );
    if (matchingIndex !== -1) {
      possiblePositions.splice(matchingIndex, 1);
    } else {
      surrounding.splice(i, 1);
      i -= 1;
    }
  }

  if (surrounding.some((c) => c === undefined)) {
    console.warn("Some surrounding coordinate is undefined!");
  } else {
    // console.log(`No undefined coords found.`);
  }

  if (surrounding.length === 0) {
    return [start];
  }
  const reachable = [
    start,
    ...surrounding,
    ...surrounding.flatMap((c) => walkRegion(map, c, possiblePositions)),
  ];
  return uniqueCoords(reachable);
}
