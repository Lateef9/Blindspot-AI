import pypdf
from typing import List, Dict, Union

def parse_pdf(file_path: str) -> List[Dict[str, Union[int, str]]]:
    """
    Parses a PDF file and extracts text page by page.
    
    Args:
        file_path (str): Path to the PDF file.
        
    Returns:
        List[Dict]: A list where each dictionary contains:
            - 'page': The page number (1-indexed)
            - 'text': The extracted text content of that page
    """
    extracted_data = []
    
    # Open the PDF document
    with open(file_path, "rb") as f:
        reader = pypdf.PdfReader(f)
        # Iterate through each page
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text = page.extract_text()
            
            extracted_data.append({
                "page": page_num + 1,  # 1-indexed page number
                "text": text or ""
            })
            
    return extracted_data

if __name__ == "__main__":
    # Example usage
    import sys
    import json
    
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        try:
            result = parse_pdf(pdf_path)
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"Error parsing PDF: {e}", file=sys.stderr)
