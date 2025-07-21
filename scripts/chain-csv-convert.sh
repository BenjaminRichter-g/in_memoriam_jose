#!/bin/bash
set -e

INPUT_CSV="public/Jose's Album (Responses) - Form responses 1.csv"
CLEANED_CSV="cleaned-memories-no-date-cleaned.csv"

# 1. Clean the CSV
printf "\n🧹 Cleaning CSV...\n"
python3 scripts/clean_csv.py "$INPUT_CSV" "$CLEANED_CSV"

# 2. Convert to TypeScript data for the website (frontend)
printf "\n🔄 Converting cleaned CSV to TypeScript data for frontend...\n"
node scripts/final-converter.js "$CLEANED_CSV"

# 3. Generate extra JSON and TS files for content completeness
printf "\n📦 Generating JSON and extra TS files for content...\n"
node scripts/convert-csv.js "$CLEANED_CSV"

printf "\n✅ All done! Data is ready for the frontend and content files are updated.\n" 