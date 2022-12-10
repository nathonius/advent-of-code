import { readFile } from "fs/promises";
import { Choice, Outcome } from "./RPS";

async function main() {
  let score = 0;

  // Parse input file
  const data = (await readFile("src/day2/data")).toString().split("\n");
  data.forEach((l) => {
    if (l) {
      // Problem 1
      // const [enemyChoice, myChoice] = l.split(" ").map((c) => getChoice(c));

      // Problem 2
      const [enemyChoiceStr, desiredOutcomeStr] = l.split(" ");
      const enemyChoice = getChoice(enemyChoiceStr);
      const desiredOutcome = getDesiredOutcome(desiredOutcomeStr);
      const myChoice = getChoiceForOutcome(enemyChoice, desiredOutcome);

      // Get total
      score += getRoundResult(enemyChoice, myChoice);
    }
  });

  console.log(`My final score: ${score}`);
}

function getRoundResult(enemyChoice: Choice, myChoice: Choice): number {
  if (enemyChoice === myChoice) {
    return Outcome.Draw + myChoice;
  } else if (enemyChoice === Choice.Rock && myChoice === Choice.Paper) {
    return Outcome.Win + myChoice;
  } else if (enemyChoice === Choice.Paper && myChoice === Choice.Scissors) {
    return Outcome.Win + myChoice;
  } else if (enemyChoice === Choice.Scissors && myChoice === Choice.Rock) {
    return Outcome.Win + myChoice;
  } else {
    return Outcome.Loss + myChoice;
  }
}

function getDesiredOutcome(c: string): Outcome {
  switch (c) {
    case "X":
      return Outcome.Loss;
    case "Y":
      return Outcome.Draw;
    case "Z":
    default:
      return Outcome.Win;
  }
}

function getChoiceForOutcome(enemyChoice: Choice, outcome: Outcome): Choice {
  if (outcome === Outcome.Draw) {
    return enemyChoice;
  }
  switch (enemyChoice) {
    case Choice.Rock:
      return outcome === Outcome.Win ? Choice.Paper : Choice.Scissors;
    case Choice.Paper:
      return outcome === Outcome.Win ? Choice.Scissors : Choice.Rock;
    case Choice.Scissors:
      return outcome === Outcome.Win ? Choice.Rock : Choice.Paper;
  }
}

function getChoice(c: string): Choice {
  switch (c) {
    case "A":
    case "X":
      return Choice.Rock;
    case "B":
    case "Y":
      return Choice.Paper;
    case "C":
    case "Z":
    default:
      return Choice.Scissors;
  }
}

export default main;
