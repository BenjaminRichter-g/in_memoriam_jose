#!/usr/bin/env python3
"""
Clean and transform Jose's Album CSV data for the memorial website.

This script:
1. Removes timestamp and email columns
2. Renames "What's your name?" to "name"
3. Renames "Do you have a personal note..." to "text"
4. Splits multiple image links into separate rows (text only on first row)
5. Removes rows where website permission is "No"
6. Outputs clean CSV for the memorial website converter
"""

import csv
import re
import sys
from pathlib import Path

def clean_csv(input_file, output_file):
    """
    Clean the CSV file according to the specified requirements.
    """
    print(f"🧹 Cleaning CSV: {input_file}")
    
    # Read the input CSV
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    print(f"📊 Found {len(rows)} original rows")
    
    cleaned_rows = []
    
    for row in rows:
        # Check if user wants their content on the website
        website_permission = row.get("Lastly, we plan to create an in memoriam website for José which will be shared with his friends and family. Would you like your pictures and/or personal note to be published on the website as well?", "")
        
        if "No" in website_permission:
            print(f"❌ Skipping row for {row.get('What\'s your name? (as you would like it to appear in the album)', 'Unknown')} - website permission denied")
            continue
        
        # Extract basic info
        name = row.get("What's your name? (as you would like it to appear in the album)", "").strip()
        text = row.get("Do you have a personal note you would like to leave for José? This is also optional, and what you write is entirely up to you.", "").strip()
        images = row.get("Please upload 1-10 of your favourite pictures with José (optional)", "").strip()
        
        # Skip empty rows
        if not name and not text and not images:
            continue
        
        # Split multiple image links
        if images:
            # Extract individual Google Drive links
            image_links = re.findall(r'https://drive\.google\.com/open\?id=[a-zA-Z0-9_-]+', images)
            
            if image_links:
                # Create a row for each image
                for i, image_link in enumerate(image_links):
                    cleaned_row = {
                        'name': name,
                        'image': image_link,
                        'text': text if i == 0 else '',  # Only first image gets the text
                        'type': 'memory' if text else 'image'
                    }
                    cleaned_rows.append(cleaned_row)
                    print(f"✅ Added image {i+1}/{len(image_links)} for {name}")
            else:
                # No valid image links found
                if text:
                    cleaned_row = {
                        'name': name,
                        'image': '',
                        'text': text,
                        'type': 'message'
                    }
                    cleaned_rows.append(cleaned_row)
                    print(f"✅ Added text-only entry for {name}")
        else:
            # Text-only entry
            if text:
                cleaned_row = {
                    'name': name,
                    'image': '',
                    'text': text,
                    'type': 'message'
                }
                cleaned_rows.append(cleaned_row)
                print(f"✅ Added text-only entry for {name}")
    
    # Write the cleaned CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['name', 'image', 'text', 'type']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned_rows)
    
    print(f"🎉 Successfully cleaned CSV!")
    print(f"📝 Output: {output_file}")
    print(f"📊 Total entries: {len(cleaned_rows)}")
    
    # Count by type
    image_entries = sum(1 for row in cleaned_rows if row['image'])
    text_entries = sum(1 for row in cleaned_rows if row['text'] and not row['image'])
    complete_entries = sum(1 for row in cleaned_rows if row['image'] and row['text'])
    
    print(f"🖼️  Image entries: {image_entries}")
    print(f"📝 Text-only entries: {text_entries}")
    print(f"✅ Complete entries (image + text): {complete_entries}")

def main():
    """Main function to run the CSV cleaning process."""
    if len(sys.argv) != 3:
        print("Usage: python clean_csv.py <input_csv> <output_csv>")
        print("Example: python clean_csv.py 'Jose Album.csv' 'cleaned-memories.csv'")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not Path(input_file).exists():
        print(f"❌ Error: Input file '{input_file}' not found!")
        sys.exit(1)
    
    try:
        clean_csv(input_file, output_file)
        print("\n🚀 Next steps:")
        print("1. Review the cleaned CSV file")
        print("2. Run: node scripts/convert-csv.js cleaned-memories.csv")
        print("3. Copy the generated data to app/page.tsx")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 