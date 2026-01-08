import fs from "fs";
import path from "path";
import { validateBatch } from "./validator.js";

type Root = { verb: any[] };

export function validateFile(
  inputPath: string,
  outputPath?: string
) {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const data: Root = JSON.parse(raw);

  const report = {
    meta: {
      generatedAt: new Date().toISOString(),
      sourceFile: path.basename(inputPath),
      totalVerbs: data.verb.length,
      totalPuzzles: 0,
    },
    summary: {
      totalErrors: 0,
      fatal: 0,
      strong: 0,
      warning: 0,
      validVerbs: 0,
      invalidVerbs: 0,
    },
    verbs: [] as any[],
  };

  data.verb.forEach((batch, index) => {
    const errors = validateBatch(batch);

    report.meta.totalPuzzles += batch.puzzles?.length ?? 0;

    errors.forEach((e) => {
      report.summary.totalErrors++;
      report.summary[e.level.toLowerCase()]++;
    });

    if (errors.length === 0) {
      report.summary.validVerbs++;
    } else {
      report.summary.invalidVerbs++;
    }

    report.verbs.push({
      infinitive: batch.infinitive,
      index,
      puzzleCount: batch.puzzles?.length ?? 0,
      errors,
    });
  });

  const json = JSON.stringify(report, null, 2);

  if (outputPath) {
    fs.writeFileSync(outputPath, json, "utf-8");
  }

  return report;
}

/* CLI */
const input = process.argv[2];
const output = process.argv[3];

/*
Usage:
Usage: npm install -D ts-node typescript @types/node
Usage: node--loader ts-node/esm validate-and-report <input.json> [report.json]

*/

if (!input) {
  console.error("Usage: --loader ts-node/esm validate-and-report <input.json> [report.json]");
  process.exit(1);
}

validateFile(
  path.resolve(input),
  output ? path.resolve(output) : undefined
);
