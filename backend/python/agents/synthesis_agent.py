import os
import json
from openai import OpenAI
from typing import Dict, Any

def synthesize_findings(aggregated_findings: Dict[str, Any]) -> Dict[str, Any]:
    """
    Acts as a Synthesis Agent to review financial, market, and execution findings
    and generate a final risk score, executive summary, verdict, and top questions.
    
    Args:
        aggregated_findings (Dict): The combined results from the Financial, Market, 
                                    and Execution agents.
                                       
    Returns:
        Dict: Structured JSON containing the final synthesis.
    """
    if not aggregated_findings:
        return {
            "risk_score": None,
            "executive_summary": "No data provided.",
            "verdict": {"decision": "Unknown", "justification": "No data provided."},
            "top_questions": []
        }
    
    # Load the prompt template
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(os.path.dirname(current_dir), 'prompts', 'synthesis_prompt.txt')
    
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            prompt_template = f.read()
    except FileNotFoundError:
        raise RuntimeError(f"Prompt file not found at {prompt_path}")

    # Inject the aggregated findings into the prompt as a formatted JSON string
    formatted_findings = json.dumps(aggregated_findings, indent=2)
    final_prompt = prompt_template.replace("{aggregated_findings}", formatted_findings)
    
    # Call OpenAI API
    client = OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4o",  # Using gpt-4o for complex reasoning and synthesis
        messages=[
            {"role": "system", "content": "You are a top-tier investment analyst AI designed to output structured JSON."},
            {"role": "user", "content": final_prompt}
        ],
        response_format={ "type": "json_object" },
        temperature=0.3 # Slightly higher temperature for synthesis/reasoning, but still focused
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
    
    mock_aggregated_findings = {
        "financial_analysis": {
            "revenue_assumptions": ["$1M ARR by year end", "20% MoM growth", "$50/user/month"],
            "cost_assumptions": ["Fixed marketing $20k/mo", "Variable engineering $60k/mo"],
            "burn_rate": {"amount": "$85k/mo", "runway": "18 months", "notes": "Solid runway for current stage."}
        },
        "market_analysis": {
            "demand": ["$15B market by 2028", "Demand for real-time tracking"],
            "competition": ["LogisTech dominates enterprise", "FreightAI at $1,200/mo"],
            "pricing": ["Base tier $500/month"]
        },
        "execution_analysis": {
            "hiring": ["Need 5 senior full-stack engineers by Q2", "Need VP of Sales"],
            "scaling": ["Expanding to Europe requires AWS Frankfurt for GDPR"],
            "dependencies": ["Stripe API for payments", "FDA approval for health module"]
        }
    }
    
    print("Running Synthesis Agent analysis...")
    try:
        result = synthesize_findings(mock_aggregated_findings)
        print("\n--- Output JSON ---")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
