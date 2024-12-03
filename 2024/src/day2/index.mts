import { readInput } from "../shared.js";

function reportIsSafe(report: number[], min = 1, max = 3): boolean {
  const deltas = report
    .map((v, i) => (i === 0 ? 0 : report[i - 1] - v))
    .slice(1);

  const sameDirection =
    deltas.every((d) => d > 0) || deltas.every((d) => d < 0);
  const withinRange = deltas.every(
    (d) => Math.abs(d) >= min && Math.abs(d) <= max
  );

  return sameDirection && withinRange;
}

export async function day2() {
  const lines = await readInput("day2.txt");
  const reports: number[][] = [];
  let safeReports = 0;
  let safeReportsWithDampener = 0;

  for (const line of lines) {
    const values = line.split(" ").map((c) => parseInt(c, 10));
    reports.push(values);
  }

  for (const report of reports) {
    const options = [report];
    for (let i = 0; i < report.length; i++) {
      const dampened = [...report];
      dampened.splice(i, 1);
      options.push(dampened);
    }
    const safe = options.some((r) => reportIsSafe(r));
    if (safe) {
      safeReportsWithDampener += 1;
    }
    if (reportIsSafe(report)) {
      safeReports += 1;
    }
  }

  console.log(`Safe reports: ${safeReports}`);
  console.log(`Safe reports (with dampener): ${safeReportsWithDampener}`);
}
