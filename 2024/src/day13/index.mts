import {
  Coord,
  coordDelta,
  getCoordsDelta,
  multiplyCoord,
  readInput,
} from "../shared.js";

interface ClawMachineGame {
  buttonA: Coord;
  buttonB: Coord;
  prize: Coord;
}

const maxButtonPress = 100;
const buttonACost = 3;
const buttonBCost = 1;
const buttonLinePattern = /Button [AB]: X\+(?<x>\d+), Y\+(?<y>\d+)/;
const prizeLinePattern = /Prize: X=(?<x>\d+), Y=(?<y>\d+)/;

function getCoordFromLine(line: string, pattern: RegExp): Coord {
  const match = pattern.exec(line);
  if (!match) {
    console.log(line);
    throw new Error("bad!");
  }
  return {
    x: parseInt(match.groups!.x),
    y: parseInt(match.groups!.y),
  };
}

export async function day13() {
  const lines = await readInput("day13.txt");
  let games: ClawMachineGame[] = [];
  for (let i = 0; i < lines.length; i += 4) {
    games.push({
      buttonA: getCoordFromLine(lines[i], buttonLinePattern),
      buttonB: getCoordFromLine(lines[i + 1], buttonLinePattern),
      prize: getCoordFromLine(lines[i + 2], prizeLinePattern),
    });
  }
  solveGame(games[0]);
}

function distance(a: Coord, b: Coord): number {
  const delta = getCoordsDelta(a, b);
  return Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
}

function solveGame(game: ClawMachineGame) {
  let aPresses = 0;
  let bPresses = 0;

  const realBDelta = multiplyCoord(game.buttonB, buttonACost / buttonBCost);

  const position: Coord = {
    x: 0,
    y: 0,
  };
  let distanceToTarget = 0;
  while (distanceToTarget > 0 && (aPresses <= 100 || bPresses <= 100)) {
    // Break out if we ever have a
    distanceToTarget = distance(position, game.prize);
    const ifA = coordDelta(position, game.buttonA);
    const ifB = coordDelta(position, realBDelta);
  }
}
