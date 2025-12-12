
/**
 * JSON TO CSV CONVERTER (JSONB Version)
 * 
 * Exports only 2 CSV files now!
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');
const crypto = require('crypto');

const INPUT_FILE = 'verbs_data_jsonb.json';
const OUTPUT_VERBS = 'verbs.csv';
const OUTPUT_PUZZLES = 'puzzles.csv';

// Escape for CSV: Double quotes must be double-double quoted
function toCSVCell(value) {
  if (value === null || value === undefined) return ''; 
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Format Postgres Array
function toPostgresArrayString(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '{}';
  const content = arr.map(item => {
    if (typeof item !== 'string') return String(item);
    const escaped = item.replace(/\\/g, '\\\\').replace(/"/g, '\\"');  
    return `"${escaped}"`;
  }).join(',');
  return `{${content}}`;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Error: File not found ${INPUT_FILE}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  let dataset = JSON.parse(rawData);

  // Normalization
  if (!Array.isArray(dataset) && dataset.verb) dataset = dataset.verb;
  if (!Array.isArray(dataset)) dataset = [dataset];

  console.log(`Processing ${dataset.length} verbs...`);

  // --- HEADERS ---
  const verbsHeader = ['id', 'infinitive', 'translations'].join(',');
  const puzzlesHeader = [
    'id', 'verb_id', 'tense', 'person', 'pronoun', 'is_regular',
    'correct_stem', 'correct_ending', 'distractor_stems', 'distractor_endings',
    'aux_stem', 'aux_ending', 'distractor_aux_stems', 'distractor_aux_endings',
    'rule_summary', 'explanation_translations'
  ].join(',');

  const verbsRows = [verbsHeader];
  const puzzlesRows = [puzzlesHeader];

  dataset.forEach(verbData => {
    const verbId = crypto.randomUUID();

    // 1. VERBS
    // Important: JSON.stringify the translations object
    const translationsJson = JSON.stringify(verbData.translations || {});
    
    verbsRows.push([
      toCSVCell(verbId),
      toCSVCell(verbData.infinitive),
      toCSVCell(translationsJson) // Insert as JSON string
    ].join(','));

    // 2. PUZZLES
    if (verbData.puzzles && Array.isArray(verbData.puzzles)) {
      verbData.puzzles.forEach(puzzle => {
        const puzzleId = crypto.randomUUID();
        
        const distStems = Array.isArray(puzzle.distractorStems) ? puzzle.distractorStems : [];
        const distEndings = Array.isArray(puzzle.distractorEndings) ? puzzle.distractorEndings : null;
        const auxDistStems = Array.isArray(puzzle.distractorAuxStems) ? puzzle.distractorAuxStems : null;
        const auxDistEndings = Array.isArray(puzzle.distractorAuxEndings) ? puzzle.distractorAuxEndings : null;

        const explanationsJson = JSON.stringify(puzzle.explanations || {});

        puzzlesRows.push([
          toCSVCell(puzzleId),
          toCSVCell(verbId), 
          toCSVCell(puzzle.tense),
          toCSVCell(puzzle.person),
          toCSVCell(puzzle.pronoun || puzzle.person), // Default to person if missing, but should be generated
          puzzle.is_regular ? 'TRUE' : 'FALSE',
          toCSVCell(puzzle.correctStem),
          toCSVCell(puzzle.correctEnding), 
          toCSVCell(toPostgresArrayString(distStems)), 
          toCSVCell(distEndings ? toPostgresArrayString(distEndings) : null),
          toCSVCell(puzzle.auxStem),
          toCSVCell(puzzle.auxEnding),
          toCSVCell(auxDistStems ? toPostgresArrayString(auxDistStems) : null),
          toCSVCell(auxDistEndings ? toPostgresArrayString(auxDistEndings) : null),
          toCSVCell(puzzle.ruleSummary),
          toCSVCell(explanationsJson) // Insert as JSON string
        ].join(','));
      });
    }
  });

  fs.writeFileSync(OUTPUT_VERBS, verbsRows.join('\n'));
  fs.writeFileSync(OUTPUT_PUZZLES, puzzlesRows.join('\n'));

  console.log(`✅ ${OUTPUT_VERBS}`);
  console.log(`✅ ${OUTPUT_PUZZLES}`);
}

main();
