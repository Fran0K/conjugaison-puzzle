"""
JSON TO CSV CONVERTER (JSONB Version)

Exports only 2 CSV files now!
Converted from Node.js to Python
"""
import json
import os
import sys
import uuid

# Configuration
INPUT_FILE = 'data/verbs/naitre.json'
OUTPUT_VERBS = 'data/verbs/verbs_naitre.csv'
OUTPUT_PUZZLES = 'data/verbs/puzzles_naitre.csv'

def to_csv_cell(value):
    """
    Escape for CSV: Double quotes must be double-double quoted.
    Handles None as empty string.
    """
    if value is None:
        return ''
    
    val_str = str(value)
    
    # If the string contains commas, double quotes, or newlines, wrap it in quotes
    if ',' in val_str or '"' in val_str or '\n' in val_str:
        # Replace single " with "" and wrap the whole thing in "
        return f'"{val_str.replace("\"", "\"\"")}"'
    
    return val_str

def to_postgres_array_string(arr):
    """
    Format Python List to Postgres Array String format: {val1,val2}
    """
    if not isinstance(arr, list) or len(arr) == 0:
        return '{}'
    
    content = []
    for item in arr:
        # If item is not a string, convert to string without quotes (matches JS logic)
        if not isinstance(item, str):
            content.append(str(item))
        else:
            # Escape backslashes and double quotes
            escaped = item.replace('\\', '\\\\').replace('"', '\\"')
            content.append(f'"{escaped}"')
    
    return f"{{{','.join(content)}}}"

def main():
    # Check input file
    if not os.path.exists(INPUT_FILE):
        print(f"Error: File not found {INPUT_FILE}", file=sys.stderr)
        sys.exit(1)

    # Read and parse JSON
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            dataset = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # Normalization logic matching the JS version
    # If not array and has 'verb' key, use that
    if not isinstance(dataset, list) and isinstance(dataset, dict) and 'verb' in dataset:
        dataset = dataset['verb']
    
    # If still not array, wrap in list
    if not isinstance(dataset, list):
        dataset = [dataset]

    print(f"Processing {len(dataset)} verbs...")

    # --- HEADERS ---
    verbs_header = ['id', 'infinitive', 'translations']
    puzzles_header = [
        'id', 'verb_id', 'tense', 'person', 'pronoun', 'is_regular',
        'correct_stem', 'correct_ending', 'distractor_stems', 'distractor_endings',
        'aux_stem', 'aux_ending', 'distractor_aux_stems', 'distractor_aux_endings',
        'rule_summary', 'explanation_translations'
    ]

    verbs_rows = [",".join(verbs_header)]
    puzzles_rows = [",".join(puzzles_header)]

    for verb_data in dataset:
        verb_id = str(uuid.uuid4())

        # 1. VERBS
        # Dump translations to JSON string. 
        # separators=(',', ':') removes whitespace to match standard JS JSON.stringify behavior
        translations_json = json.dumps(
            verb_data.get('translations', {}), 
            separators=(',', ':'), 
            ensure_ascii=False)
        
        verbs_rows.append(",".join([
            to_csv_cell(verb_id),
            to_csv_cell(verb_data.get('infinitive')),
            to_csv_cell(translations_json)
        ]))

        # 2. PUZZLES
        puzzles = verb_data.get('puzzles')
        if puzzles and isinstance(puzzles, list):
            for puzzle in puzzles:
                puzzle_id = str(uuid.uuid4())

                # Handle Arrays and Nulls safely
                dist_stems = puzzle.get('distractorStems', [])
                if not isinstance(dist_stems, list): dist_stems = []

                dist_endings = puzzle.get('distractorEndings')
                aux_dist_stems = puzzle.get('distractorAuxStems')
                aux_dist_endings = puzzle.get('distractorAuxEndings')

                # Ensure strictly list or None for the logic below
                if not isinstance(dist_endings, list): dist_endings = None
                if not isinstance(aux_dist_stems, list): aux_dist_stems = None
                if not isinstance(aux_dist_endings, list): aux_dist_endings = None

                explanations_json = json.dumps(
                    puzzle.get('explanations', {}), 
                    separators=(',', ':'), 
                    ensure_ascii=False)

                # Logic for boolean and person/pronoun defaults
                is_regular_str = 'TRUE' if puzzle.get('is_regular') else 'FALSE'
                person = puzzle.get('person')
                pronoun = puzzle.get('pronoun') if puzzle.get('pronoun') else person

                # Construct Row
                row_items = [
                    to_csv_cell(puzzle_id),
                    to_csv_cell(verb_id),
                    to_csv_cell(puzzle.get('tense')),
                    to_csv_cell(person),
                    to_csv_cell(pronoun),
                    is_regular_str,
                    to_csv_cell(puzzle.get('correctStem')),
                    to_csv_cell(puzzle.get('correctEnding')),
                    to_csv_cell(to_postgres_array_string(dist_stems)),
                    to_csv_cell(to_postgres_array_string(dist_endings) if dist_endings is not None else None),
                    to_csv_cell(puzzle.get('auxStem')),
                    to_csv_cell(puzzle.get('auxEnding')),
                    to_csv_cell(to_postgres_array_string(aux_dist_stems) if aux_dist_stems is not None else None),
                    to_csv_cell(to_postgres_array_string(aux_dist_endings) if aux_dist_endings is not None else None),
                    to_csv_cell(puzzle.get('ruleSummary')),
                    to_csv_cell(explanations_json)
                ]
                
                puzzles_rows.append(",".join(row_items))

    # Write Files
    try:
        with open(OUTPUT_VERBS, 'w', encoding='utf-8', newline='') as f:
            f.write('\n'.join(verbs_rows))
        
        with open(OUTPUT_PUZZLES, 'w', encoding='utf-8', newline='') as f:
            f.write('\n'.join(puzzles_rows))
            
        print(f"✅ {OUTPUT_VERBS}")
        print(f"✅ {OUTPUT_PUZZLES}")
        
    except IOError as e:
        print(f"Error writing files: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()