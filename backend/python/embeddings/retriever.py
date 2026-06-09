import numpy as np
from openai import OpenAI
from typing import List, Dict, Union

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """
    Computes cosine similarity between a vector and a matrix.
    
    Args:
        a (np.ndarray): 1D array representing the query embedding.
        b (np.ndarray): 2D array representing the document embeddings.
        
    Returns:
        np.ndarray: 1D array of cosine similarities.
    """
    # Dot product between a and every vector in b
    dot_product = np.dot(b, a)
    # Magnitudes
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b, axis=1)
    
    # Avoid division by zero
    if norm_a == 0:
        return np.zeros_like(dot_product)
        
    return dot_product / (norm_a * norm_b)

def retrieve_top_k(query: str, chunks: List[Dict[str, Union[str, int]]], embeddings_path: str, k: int = 5) -> List[Dict[str, Union[str, int, float]]]:
    """
    Locally retrieves the top k most relevant chunks for a given query using cosine similarity.
    
    Args:
        query (str): The search query.
        chunks (List[Dict]): The original list of chunks used to generate the embeddings.
        embeddings_path (str): The path to the stored .npy embeddings file.
        k (int): Number of top results to return.
        
    Returns:
        List[Dict]: The top k chunks, augmented with a 'score' field.
    """
    # Load stored embeddings
    try:
        document_embeddings = np.load(embeddings_path)
    except Exception as e:
        raise RuntimeError(f"Failed to load embeddings from {embeddings_path}: {e}")
        
    if len(chunks) != len(document_embeddings):
        raise ValueError(f"Mismatch between number of chunks ({len(chunks)}) and number of embeddings ({len(document_embeddings)})")
        
    # Generate embedding for the query
    client = OpenAI()
    response = client.embeddings.create(
        input=[query],
        model="text-embedding-3-small"
    )
    query_embedding = np.array(response.data[0].embedding)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(query_embedding, document_embeddings)
    
    # Get top k indices (argsort returns indices sorted in ascending order, so we take from the end and reverse)
    top_k_indices = np.argsort(similarities)[-k:][::-1]
    
    # Format results
    results = []
    for idx in top_k_indices:
        chunk_copy = chunks[idx].copy()
        chunk_copy['score'] = float(similarities[idx])
        results.append(chunk_copy)
        
    return results

if __name__ == "__main__":
    # Example usage for testing
    import sys
    import json
    import os
    import uuid
    
    # Mock data for testing if a query is passed
    if len(sys.argv) > 1:
        test_query = sys.argv[1]
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(os.path.dirname(current_dir))
        temp_dir = os.path.join(backend_dir, 'temp')
        test_embeddings_path = os.path.join(temp_dir, 'embeddings.npy')
        
        # In a real scenario, these chunks would be passed from memory or loaded from JSON
        mock_chunks = [
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
            top_results = retrieve_top_k(test_query, mock_chunks, test_embeddings_path, k=1)
            print(json.dumps(top_results, indent=2))
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
