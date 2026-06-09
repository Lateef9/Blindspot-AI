import os
import numpy as np
from openai import OpenAI
from typing import List, Dict, Union

def generate_and_store_embeddings(chunks: List[Dict[str, Union[str, int]]], output_file: str = None) -> str:
    """
    Generates embeddings for a list of text chunks using OpenAI and stores them in a .npy file.
    
    Args:
        chunks (List[Dict]): List of dictionaries containing 'chunk_id', 'page', and 'content'.
        output_file (str): Path to save the .npy file. Defaults to backend/temp/embeddings.npy.
        
    Returns:
        str: The path where the embeddings were saved.
    """
    if not output_file:
        # Default to backend/temp/embeddings.npy
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # current_dir is backend/python/embeddings
        backend_dir = os.path.dirname(os.path.dirname(current_dir))
        temp_dir = os.path.join(backend_dir, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        output_file = os.path.join(temp_dir, 'embeddings.npy')
    
    # Initialize OpenAI client
    # This automatically uses the OPENAI_API_KEY environment variable.
    client = OpenAI()
    
    texts = [chunk['content'] for chunk in chunks]
    
    if not texts:
        print("No chunks provided to generate embeddings.")
        # Save an empty array just to fulfill the contract
        np.save(output_file, np.array([]))
        return output_file
        
    # OpenAI allows batching; we'll process in batches of 100 to avoid limits
    batch_size = 100
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        # We use the recommended 'text-embedding-3-small' model
        response = client.embeddings.create(
            input=batch_texts,
            model="text-embedding-3-small"
        )
        batch_embeddings = [data.embedding for data in response.data]
        all_embeddings.extend(batch_embeddings)
        
    # Convert list of lists to a 2D numpy array
    embeddings_array = np.array(all_embeddings)
    
    # Save the numpy array to the specified file
    np.save(output_file, embeddings_array)
    
    return output_file

if __name__ == "__main__":
    # Example usage for testing
    import uuid
    
    sample_chunks = [
        {
            "chunk_id": str(uuid.uuid4()),
            "page": 1,
            "content": "This is a sample chunk of text about financial markets."
        },
        {
            "chunk_id": str(uuid.uuid4()),
            "page": 1,
            "content": "Another chunk explaining the execution strategy."
        }
    ]
    
    try:
        saved_path = generate_and_store_embeddings(sample_chunks)
        print(f"Embeddings successfully saved to: {saved_path}")
    except Exception as e:
        print(f"Failed to generate embeddings. Did you set OPENAI_API_KEY? Error: {e}")
