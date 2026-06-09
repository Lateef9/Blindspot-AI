import asyncio
import json
import sys
from typing import List, Dict, Union, Any

# Import the existing synchronous agent functions
from agents.financial_agent import get_financial_analysis
from agents.market_agent import get_market_analysis
from agents.execution_agent import get_execution_analysis
from agents.synthesis_agent import synthesize_findings
from embeddings.retriever import retrieve_top_k

def run_financial_with_retrieval(chunks, embeddings_path):
    query = "Revenue, cost assumptions, margin, burn rate, runway, cash on hand, financial projections"
    retrieved = retrieve_top_k(query, chunks, embeddings_path, k=10)
    return get_financial_analysis(retrieved)

def run_market_with_retrieval(chunks, embeddings_path):
    query = "Market size, target audience, competitors, market share, pricing strategy, demand, competitive advantage"
    retrieved = retrieve_top_k(query, chunks, embeddings_path, k=10)
    return get_market_analysis(retrieved)

def run_execution_with_retrieval(chunks, embeddings_path):
    query = "Hiring, key roles, headcount, infrastructure scaling, market expansion, dependencies, integrations, regulatory approvals"
    retrieved = retrieve_top_k(query, chunks, embeddings_path, k=10)
    return get_execution_analysis(retrieved)

async def run_all_agents(chunks: List[Dict[str, Union[str, int, float]]], embeddings_path: str) -> Dict[str, Any]:
    """
    Runs the Financial, Market, and Execution agents concurrently using asyncio.gather.
    Retrieves specific chunks for each agent, then aggregates their results.
    
    Args:
        chunks (List[Dict]): The document chunks to analyze.
        embeddings_path (str): Path to the generated embeddings.
        
    Returns:
        Dict: Combined findings from all agents and synthesis.
    """
    # print("Starting concurrent analysis...")
    
    financial_task = asyncio.to_thread(run_financial_with_retrieval, chunks, embeddings_path)
    market_task = asyncio.to_thread(run_market_with_retrieval, chunks, embeddings_path)
    execution_task = asyncio.to_thread(run_execution_with_retrieval, chunks, embeddings_path)
    
    # Run all tasks concurrently and wait for them to finish
    financial_res, market_res, execution_res = await asyncio.gather(
        financial_task, 
        market_task, 
        execution_task
    )
    
    # Aggregate findings
    aggregated_findings = {
        "financial_analysis": financial_res,
        "market_analysis": market_res,
        "execution_analysis": execution_res
    }
    
    # print("Running Synthesis Agent...")
    # Run the synthesis agent (this depends on the others, so it runs after)
    synthesis_res = await asyncio.to_thread(synthesize_findings, aggregated_findings)
    
    # Return the final comprehensive structure
    return {
        "raw_findings": aggregated_findings,
        "synthesis": synthesis_res
    }
