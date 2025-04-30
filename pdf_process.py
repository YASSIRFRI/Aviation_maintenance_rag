import re
import json
import argparse
from pathlib import Path
from PyPDF2 import PdfReader

def extract_acn_sections(input_pdf: Path):
    """
    Parses the PDF and returns a list of dicts like:
      { "acn": "<number>", "text": "<full section text>" }
    """
    reader = PdfReader(str(input_pdf))
    acn_pattern = re.compile(r"ACN:\s*(\d+)")
    
    sections = []
    current_acn = None
    current_text_lines = []
    
    for page in reader.pages:
        text = page.extract_text() or ""
        # Check if this page starts a new ACN section
        m = acn_pattern.search(text)
        if m:
            # If we're already gathering one, push it
            if current_acn is not None:
                sections.append({
                    "acn": current_acn,
                    "text": "\n".join(current_text_lines).strip()
                })
            # Start a new one
            current_acn = m.group(1)
            current_text_lines = []
        
        # If we're inside an ACN, collect this page's text
        if current_acn is not None:
            current_text_lines.append(text)
    
    # After looping, don't forget the last one
    if current_acn is not None:
        sections.append({
            "acn": current_acn,
            "text": "\n".join(current_text_lines).strip()
        })
    
    return sections

def main():
    parser = argparse.ArgumentParser(
        description="Extract ACN sections from a PDF and output JSON."
    )
    parser.add_argument(
        "input_pdf",
        type=Path,
        help="Path to the input PDF (e.g. mechanic.pdf)"
    )
    parser.add_argument(
        "output_json",
        type=Path,
        help="Path where the JSON array will be written"
    )
    args = parser.parse_args()
    
    sections = extract_acn_sections(args.input_pdf)
    
    # Write out as a JSON array
    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(sections, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(sections)} ACN sections to {args.output_json}")

if __name__ == "__main__":
    main()
