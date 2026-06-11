"use client";

import React, { useState, useEffect } from 'react';
import { ReportChat } from '@/components/ReportChat';

// Mock data for the UI demonstration
const mockReportData = {
  raw_findings: {
    financial_analysis: {
      revenue_assumptions: ["$1M ARR by year end", "20% MoM growth", "$50/user/month"],
      cost_assumptions: ["Fixed marketing $20k/mo", "Variable engineering $60k/mo"],
      burn_rate: { amount: "$85k/mo", runway: "18 months", notes: "Solid runway for current stage." }
    },
    market_analysis: {
      demand: ["$15B market by 2028", "Demand for real-time tracking"],
      competition: ["LogisTech dominates enterprise", "FreightAI at $1,200/mo"],
      pricing: ["Base tier $500/month"]
    },
    execution_analysis: {
      hiring: ["Need 5 senior full-stack engineers by Q2", "Need VP of Sales"],
      scaling: ["Expanding to Europe requires AWS Frankfurt for GDPR"],
      dependencies: ["Stripe API for payments", "FDA approval for health module"]
    }
  },
  synthesis: {
    risk_score: 6,
    executive_summary: "The company operates in a rapidly growing $15B market with clear demand for real-time logistics tracking. While they have a strong pricing advantage over competitors and solid 18-month runway, execution risks remain high due to critical dependencies like FDA approval and aggressive hiring targets.",
    verdict: {
      decision: "Invest with Caution",
      justification: "Strong market mechanics and runway, but regulatory dependencies and hiring bottlenecks pose significant execution risks."
    },
    top_questions: [
      "What is the backup plan if FDA approval is delayed beyond Q3?",
      "How are you currently sourcing the 5 senior engineering roles in a competitive market?",
      "Why is marketing spend fixed at $20k/mo despite aggressive 20% MoM growth targets?"
    ]
  }
};

export default function ReportPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('blindspotReportData');
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (err) {
        console.error("Failed to parse report data", err);
        setError("Invalid report data found.");
      }
    } else {
      // Fallback to mock data if nothing is uploaded yet for demonstration
      setData(mockReportData);
    }
  }, []);

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-10 text-gray-500">Loading report...</div>;
  }

  const { synthesis, raw_findings } = data;

  // Helper to determine Risk Score color
  const getRiskColor = (score: number) => {
    if (score <= 3) return "text-emerald-700 dark:text-emerald-400 border-emerald-700 dark:border-emerald-400";
    if (score <= 6) return "text-amber-700 dark:text-amber-400 border-amber-700 dark:border-amber-400";
    return "text-rose-700 dark:text-rose-400 border-rose-700 dark:border-rose-400";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="pb-8 border-b-2 border-slate-900 dark:border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Investment Analysis</h1>
            <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 mt-3 uppercase tracking-wide">Automated Document Evaluation</p>
          </div>
          
          <div className={`flex items-center gap-4 px-8 py-5 border-4 ${getRiskColor(synthesis.risk_score)}`}>
            <div>
              <p className={`text-xs font-mono font-black uppercase tracking-widest mb-2 ${getRiskColor(synthesis.risk_score).split(' ')[0]} ${getRiskColor(synthesis.risk_score).split(' ')[1]}`}>Risk Score</p>
              <p className="text-5xl font-black font-mono leading-none">{synthesis.risk_score} <span className="text-xl font-bold opacity-80">/ 10</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-10">
            
            {/* Executive Summary */}
            <section className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-100 p-8">
              <h2 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6 border-b-2 border-slate-900 dark:border-slate-100 pb-2 inline-block">
                Executive Summary
              </h2>
              <p className="text-lg text-slate-900 dark:text-slate-100 leading-relaxed font-bold">
                {synthesis.executive_summary}
              </p>
            </section>

            {/* Detailed Findings */}
            <section className="space-y-10">
              
              {/* Financial Findings */}
              <div className="border-2 border-slate-900 dark:border-slate-100">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b-2 border-slate-900 dark:border-slate-100">
                  <h3 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                    Financial Analysis
                  </h3>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Revenue Assumptions</h4>
                    {raw_findings.financial_analysis.revenue_assumptions.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.financial_analysis.revenue_assumptions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Cost Assumptions</h4>
                    {raw_findings.financial_analysis.cost_assumptions.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.financial_analysis.cost_assumptions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                </div>
                <div className="p-8 pt-0 border-t-2 border-slate-900 dark:border-slate-100 mt-4">
                  <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest mt-8">Burn Rate</h4>
                  <div className="flex flex-wrap gap-6 text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                    <div className="border-2 border-slate-900 dark:border-slate-100 px-6 py-4 bg-slate-50 dark:bg-slate-900">
                      <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 uppercase block mb-2">Amount</span>
                      <span className="font-mono text-xl">{raw_findings.financial_analysis.burn_rate?.amount || "N/A"}</span>
                    </div>
                    <div className="border-2 border-slate-900 dark:border-slate-100 px-6 py-4 bg-slate-50 dark:bg-slate-900">
                      <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 uppercase block mb-2">Runway</span>
                      <span className="font-mono text-xl">{raw_findings.financial_analysis.burn_rate?.runway || "N/A"}</span>
                    </div>
                  </div>
                  {raw_findings.financial_analysis.burn_rate?.notes && (
                    <p className="text-base font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 p-5 border-l-4 border-slate-900 dark:border-slate-100">{raw_findings.financial_analysis.burn_rate.notes}</p>
                  )}
                </div>
              </div>

              {/* Market Findings */}
              <div className="border-2 border-slate-900 dark:border-slate-100">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b-2 border-slate-900 dark:border-slate-100">
                  <h3 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                    Market Analysis
                  </h3>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Demand</h4>
                    {raw_findings.market_analysis.demand.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.market_analysis.demand.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Competition</h4>
                    {raw_findings.market_analysis.competition.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.market_analysis.competition.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                  <div className="md:col-span-2 pt-6 border-t-2 border-slate-900 dark:border-slate-100">
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Pricing</h4>
                    {raw_findings.market_analysis.pricing.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.market_analysis.pricing.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Execution Findings */}
              <div className="border-2 border-slate-900 dark:border-slate-100">
                <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b-2 border-slate-900 dark:border-slate-100">
                  <h3 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                    Execution Analysis
                  </h3>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Hiring</h4>
                    {raw_findings.execution_analysis.hiring.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.execution_analysis.hiring.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Scaling</h4>
                    {raw_findings.execution_analysis.scaling.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.execution_analysis.scaling.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                  <div className="md:col-span-2 pt-6 border-t-2 border-slate-900 dark:border-slate-100">
                    <h4 className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest border-b border-slate-300 dark:border-slate-700 pb-2">Dependencies</h4>
                    {raw_findings.execution_analysis.dependencies.length > 0 ? (
                      <ul className="list-square list-inside space-y-3 text-base font-medium text-slate-900 dark:text-slate-100">
                        {raw_findings.execution_analysis.dependencies.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm font-mono font-bold text-slate-500 italic">No data extracted</p>
                    )}
                  </div>
                </div>
              </div>

            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            
            {/* Verdict */}
            <section className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-slate-100 p-8">
              <h2 className="text-sm font-mono font-black uppercase tracking-widest mb-8 border-b-2 border-slate-700 dark:border-slate-300 pb-2 inline-block">
                Final Verdict
              </h2>
              <div className="space-y-6">
                <h3 className="text-4xl font-black uppercase tracking-wide">
                  {synthesis.verdict.decision}
                </h3>
                <p className="text-lg font-bold leading-relaxed">
                  {synthesis.verdict.justification}
                </p>
              </div>
            </section>

            {/* Top Questions */}
            <section className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-950 p-8">
              <h2 className="text-sm font-mono font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-8 border-b-2 border-slate-900 dark:border-slate-100 pb-2 inline-block">
                Critical Inquiries
              </h2>
              <div className="space-y-8">
                {synthesis.top_questions.map((question: string, index: number) => (
                  <div key={index} className="flex gap-5">
                    <div className="text-base font-mono font-black text-slate-900 dark:text-slate-100 pt-1">
                      {String(index + 1).padStart(2, '0')}.
                    </div>
                    <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed font-bold">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Chat with Report */}
            <ReportChat reportData={data} />

          </div>
        </div>
      </div>
    </div>
  );
}
