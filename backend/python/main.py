import sys
import json
import asyncio
import os

from pdf_parser import parse_pdf
from chunker import chunk_text
from embeddings.embedder import generate_and_store_embeddings
from analyzer import run_all_agents

async def analyze_pdf(pdf_path: str):
    """
    Complete pipeline to analyze a PDF.
    """
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": f"File not found: {pdf_path}"}))
        sys.exit(1)
        
    try:
        # 1. Parse PDF
        pages = parse_pdf(pdf_path)
        
        # 2. Chunk text
        chunks = chunk_text(pages)
        
        # 3. Embed and store
        # We can dynamically name the embeddings file based on the PDF name to avoid collisions
        # Or just use a unique file in temp. We'll use the same directory as the PDF.
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        temp_dir = os.path.dirname(pdf_path)
        embeddings_path = os.path.join(temp_dir, f"{base_name}_embeddings.npy")
        
        saved_path = generate_and_store_embeddings(chunks, embeddings_path)
        
        # 4. Run Analyzer (retrieval happens inside)
        results = await run_all_agents(chunks, saved_path)
        
        # Output strictly JSON
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No PDF path provided."}))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    asyncio.run(analyze_pdf(pdf_path))
