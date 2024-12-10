import { multArray, readInput, sumArray } from "../shared.js";

type Operator = "0" | "1";
type OperatorWConcat = "0" | "1" | "2";
interface Equation {
  target: number;
  params: number[];
}

export async function day7() {
  const equations = (await readInput("day7.txt")).map((l) => parseEquation(l));

  const possibleEquations: Equation[] = [];
  const solvedEquations: Equation[] = [];

  for (const eq of equations) {
    // Early escapes
    const summed = sumArray(eq.params);
    const multiplied = multArray(eq.params);
    if (summed === eq.target || multiplied === eq.target) {
      solvedEquations.push(eq);
      continue;
    }
    if (eq.params.join("") === eq.target.toString()) {
      solvedEquations.push(eq);
      continue;
    }
    possibleEquations.push(eq);
  }
  console.log(
    `Skipping ${solvedEquations.length} equations with easy solutions`
  );
  console.log(
    `Considering ${possibleEquations.length} more possible equations.`
  );

  for (const e of possibleEquations) {
    const computes = tryEquation(e);
    if (computes) {
      solvedEquations.push(e);
    }
  }
  process.stdout.write("\n");

  console.log(`Solved ${solvedEquations.length} equations`);
  console.log(`Total sum: ${sumArray(solvedEquations.map((e) => e.target))}`);
}

export function doOp(op: OperatorWConcat, a: number, b: number): number {
  if (op === "0") {
    return a + b;
  } else if (op === "1") {
    return a * b;
  } else if (op === "2") {
    return parseInt(`${a}${b}`);
  }
  throw new Error(`Unknown operator ${op}`);
}

export function doOps(values: number[], ops: string, target?: number) {
  if (ops.length !== values.length - 1) {
    throw new Error(
      `Bad number of operators, expected ${values.length - 1}, got ${
        ops.length
      }`
    );
  }
  let acc = values[0];
  for (let i = 1; i < values.length; i += 1) {
    acc = doOp(ops.charAt(i - 1) as OperatorWConcat, acc, values[i]);
    if (target !== undefined && acc > target) {
      break;
    }
  }
  return acc;
}

function tryEquation(eq: Equation) {
  process.stdout.write(".");
  let ops = "2".repeat(eq.params.length - 1);
  const opsLength = ops.length;
  let asNumber = parseInt(ops, 3);

  while (asNumber > 0) {
    const result = doOps(eq.params, ops, eq.target);
    if (result === eq.target) {
      return true;
    }
    asNumber -= 1;
    ops = asNumber.toString(3).padStart(opsLength, "0");
  }
  return false;
}

function parseEquation(eqString: string): Equation {
  const [target, paramSide] = eqString.split(": ");
  const params = paramSide.split(" ");
  return { target: parseInt(target), params: params.map((p) => parseInt(p)) };
}
