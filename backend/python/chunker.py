import uuid
from typing import List, Dict, Union

def chunk_text(pages: List[Dict[str, Union[int, str]]], min_chars: int = 1000, max_chars: int = 1500) -> List[Dict[str, Union[str, int]]]:
    """
    Chunks extracted PDF text into pieces of roughly 1000-1500 characters.
    It attempts to break at sentence boundaries if the chunk is larger than min_chars,
    and forces a break before exceeding max_chars.
    
    Args:
        pages (List[Dict]): Parsed PDF data, e.g., [{"page": 1, "text": "..."}]
        min_chars (int): Minimum character threshold to start looking for a sentence break.
        max_chars (int): Maximum character limit per chunk.
        
    Returns:
        List[Dict]: A list of chunks where each dictionary contains:
            - 'chunk_id': Unique UUID for the chunk
            - 'page': The original page number
            - 'content': The text content of the chunk
    """
    chunks = []
    
    for page_data in pages:
        page_num = page_data["page"]
        text = page_data["text"]
        
        # Split text into words to avoid cutting words in half
        words = text.split()
        current_chunk = []
        current_length = 0
        
        for word in words:
            # +1 for the space (if not the first word)
            word_len = len(word) + (1 if current_length > 0 else 0)
            
            # If adding this word exceeds our absolute maximum
            if current_length + word_len > max_chars:
                # Flush the current chunk
                if current_length > 0:
                    chunks.append({
                        "chunk_id": str(uuid.uuid4()),
                        "page": page_num,
                        "content": " ".join(current_chunk)
                    })
                # Start new chunk with the current word
                current_chunk = [word]
                current_length = len(word)
            else:
                current_chunk.append(word)
                current_length += word_len
                
            # If we've reached the minimum size, look for a good breaking point (e.g. end of sentence)
            if current_length >= min_chars and word.endswith(('.', '!', '?')):
                chunks.append({
                    "chunk_id": str(uuid.uuid4()),
                    "page": page_num,
                    "content": " ".join(current_chunk)
                })
                current_chunk = []
                current_length = 0
                
        # Flush any remaining words in the page
        if current_chunk:
            chunks.append({
                "chunk_id": str(uuid.uuid4()),
                "page": page_num,
                "content": " ".join(current_chunk)
            })
            
    return chunks

if __name__ == "__main__":
    # Example usage for testing
    import json
    
    sample_pages = [
        {
            "page": 1,
            "text": "This is a test. " * 150  # Roughly 2400 characters
        }
    ]
    
    result = chunk_text(sample_pages)
    print(json.dumps(result, indent=2))
