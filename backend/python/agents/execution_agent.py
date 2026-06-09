import os
import json
from openai import OpenAI
from typing import List, Dict, Union, Any

def get_execution_analysis(retrieved_chunks: List[Dict[str, Union[str, int, float]]]) -> Dict[str, Any]:
    """
    Acts as an Execution Agent to extract hiring, scaling, and dependencies information 
    from the provided document chunks.
    
    Args:
        retrieved_chunks (List[Dict]): Chunks retrieved by the retriever, 
                                       containing 'page', 'content', and optionally 'score'.
                                       
    Returns:
        Dict: Structured JSON containing execution analysis.
    """
    if not retrieved_chunks:
        return {
            "hiring": [],
            "scaling": [],
            "dependencies": []
        }
    
    # Load the prompt template
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(os.path.dirname(current_dir), 'prompts', 'execution_prompt.txt')
    
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            prompt_template = f.read()
    except FileNotFoundError:
        raise RuntimeError(f"Prompt file not found at {prompt_path}")

    # Format the chunks into a readable string for the LLM
    formatted_chunks = ""
    for idx, chunk in enumerate(retrieved_chunks):
        page = chunk.get('page', 'Unknown')
        content = chunk.get('content', '')
        formatted_chunks += f"--- Chunk {idx + 1} (Page {page}) ---\n{content}\n\n"

    # Inject the chunks into the prompt
    final_prompt = prompt_template.replace("{chunks}", formatted_chunks)
    
    # Call OpenAI API
    client = OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4o",  # Using gpt-4o for complex extraction
        messages=[
            {"role": "system", "content": "You are a helpful execution analysis AI assistant designed to output structured JSON."},
            {"role": "user", "content": final_prompt}
        ],
        response_format={ "type": "json_object" },
        temperature=0.1 # Low temperature for factual extraction
    )
    
    # Parse the returned JSON
    raw_response = response.choices[0].message.content
    try:
        parsed_json = json.loads(raw_response)
        return parsed_json
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse LLM response as JSON. Response was: {raw_response}. Error: {e}")

if __name__ == "__main__":
    # Example usage for testing
    import sys
    
    mock_chunks = [
        {
            "page": 8,
            "content": "To hit our Q4 targets, we need to hire 5 senior full-stack engineers and a VP of Sales by the end of Q2."
        },
        {
            "page": 9,
            "content": "Scaling to the European market requires localization of our app and setting up AWS data centers in Frankfurt to comply with GDPR."
        },
        {
            "page": 10,
            "content": "Our entire payment flow depends on the Stripe API. Additionally, we are waiting for FDA approval before we can launch the health module."
        }
    ]
    
    print("Running Execution Agent analysis...")
    try:
        result = get_execution_analysis(mock_chunks)
        print("\n--- Output JSON ---")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
