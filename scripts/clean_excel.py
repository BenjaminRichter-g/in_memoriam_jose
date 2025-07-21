import pandas as pd
import re
import sys
from pathlib import Path

def extract_image_links(images_field):
    if pd.isna(images_field):
        return []
    # Accept both comma and comma+space separated links
    links = re.findall(r'https://drive\.google\.com/(?:open\?id=|file/d/)[a-zA-Z0-9_-]+', str(images_field))
    if links:
        return links
    return [link.strip() for link in str(images_field).split(',') if link.strip()]

def clean_excel(input_file, output_file):
    print(f"🧹 Cleaning Excel: {input_file}")
    df = pd.read_excel(input_file)
    print(f"📊 Found {len(df)} original rows")
    cleaned_rows = []
    for _, row in df.iterrows():
        # Check website permission
        website_permission = row.get("Lastly, we plan to create an in memoriam website for José which will be shared with his friends and family. Would you like your pictures and/or personal note to be published on the website as well?", "")
        if isinstance(website_permission, str) and "No" in website_permission:
            continue
        name = str(row.get("What's your name? (as you would like it to appear in the album)", "")).strip()
        text = str(row.get("Do you have a personal note you would like to leave for José? This is also optional, and what you write is entirely up to you.", "")).strip()
        images = row.get("Please upload 1-10 of your favourite pictures with José (optional)", "")
        if not name and not text and (pd.isna(images) or not images):
            continue
        image_links = extract_image_links(images)
        if image_links:
            for i, image_link in enumerate(image_links):
                cleaned_row = {
                    'name': name,
                    'image': image_link,
                    'text': text if i == 0 else '',
                    'type': 'memory' if text and i == 0 else 'image'
                }
                cleaned_rows.append(cleaned_row)
    cleaned_df = pd.DataFrame(cleaned_rows)
    cleaned_df.to_csv(output_file, index=False)
    print(f"🎉 Successfully cleaned Excel! Output: {output_file}")
    print(f"📊 Total entries: {len(cleaned_rows)}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python clean_excel.py <input_xlsx> <output_csv>")
        sys.exit(1)
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    if not Path(input_file).exists():
        print(f"❌ Error: Input file '{input_file}' not found!")
        sys.exit(1)
    clean_excel(input_file, output_file)

if __name__ == "__main__":
    main() 