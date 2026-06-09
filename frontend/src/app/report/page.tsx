"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Target, 
  Activity,
  HelpCircle,
  Briefcase,
  DollarSign
} from 'lucide-react';
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
    if (score <= 3) return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50";
    if (score <= 6) return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50";
    return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50";
  };

  // Helper to determine Verdict icon
  const getVerdictIcon = (decision: string) => {
    const d = decision.toLowerCase();
    if (d.includes("strong") || d.includes("yes")) return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (d.includes("caution") || d.includes("more data")) return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    return <XCircle className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Investment Analysis Report</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">AI-generated synthesis from uploaded documents</p>
          </div>
          
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${getRiskColor(synthesis.risk_score)}`}>
            <ShieldAlert className="w-6 h-6" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Risk Score</p>
              <p className="text-2xl font-bold">{synthesis.risk_score} <span className="text-sm font-normal opacity-70">/ 10</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Executive Summary */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                Executive Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {synthesis.executive_summary}
              </p>
            </section>

            {/* Detailed Findings */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Detailed Findings</h2>
              
              {/* Financial Findings */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Financial Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Revenue Assumptions</h4>
                    {raw_findings.financial_analysis.revenue_assumptions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.financial_analysis.revenue_assumptions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Cost Assumptions</h4>
                    {raw_findings.financial_analysis.cost_assumptions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.financial_analysis.cost_assumptions.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Burn Rate</h4>
                  <div className="flex gap-4 text-gray-700 dark:text-gray-300">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md"><strong>Amount:</strong> {raw_findings.financial_analysis.burn_rate?.amount || "N/A"}</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md"><strong>Runway:</strong> {raw_findings.financial_analysis.burn_rate?.runway || "N/A"}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{raw_findings.financial_analysis.burn_rate?.notes}</p>
                </div>
              </div>

              {/* Market Findings */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Market Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Demand</h4>
                    {raw_findings.market_analysis.demand.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.market_analysis.demand.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Competition</h4>
                    {raw_findings.market_analysis.competition.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.market_analysis.competition.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Pricing</h4>
                    {raw_findings.market_analysis.pricing.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.market_analysis.pricing.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Execution Findings */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Execution Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Hiring</h4>
                    {raw_findings.execution_analysis.hiring.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.execution_analysis.hiring.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Scaling</h4>
                    {raw_findings.execution_analysis.scaling.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.execution_analysis.scaling.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Dependencies</h4>
                    {raw_findings.execution_analysis.dependencies.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {raw_findings.execution_analysis.dependencies.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Not specified in document</p>
                    )}
                  </div>
                </div>
              </div>

            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Verdict */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-purple-500" />
                Final Verdict
              </h2>
              <div className="flex flex-col items-center text-center space-y-4">
                {getVerdictIcon(synthesis.verdict.decision)}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {synthesis.verdict.decision}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {synthesis.verdict.justification}
                  </p>
                </div>
              </div>
            </section>

            {/* Top Questions */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                Top Questions
              </h2>
              <div className="space-y-4">
                {synthesis.top_questions.map((question: string, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
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
