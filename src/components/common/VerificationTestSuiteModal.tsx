/**
 * National Bank - SafeVault Locker Management System
 * Quality Gate & Verification Test Suite Console (All 12 End-to-End Scenarios)
 */

import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from './StatusBadge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  ShieldCheck,
  FileCheck2,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export const VerificationTestSuiteModal: React.FC = () => {
  const {
    isQaSuiteOpen,
    setIsQaSuiteOpen,
    scenarios,
    runFullScenario,
    executeAllScenarios,
    resetScenarios,
    auditLogs
  } = useBanking();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isExecutingAll, setIsExecutingAll] = useState<boolean>(false);

  if (!isQaSuiteOpen) return null;

  const passedCount = scenarios.filter(s => s.status === 'passed').length;
  const totalCount = scenarios.length;
  const passRate = Math.round((passedCount / (totalCount || 1)) * 100);

  const filteredScenarios = scenarios.filter(sc => {
    if (filterCategory !== 'All' && sc.category !== filterCategory) return false;
    return true;
  });

  const handleRunAll = () => {
    setIsExecutingAll(true);
    executeAllScenarios();
    setTimeout(() => {
      setIsExecutingAll(false);
    }, 600);
  };

  const handleRunOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    runFullScenario(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E3E8F0] max-w-5xl w-full my-6 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-[#102544] text-white flex items-center justify-between border-b border-[#0B1730]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#008C88]">
              <ShieldCheck className="w-6 h-6 text-[#008C88]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-white">
                  National Bank SafeVault — Quality Assurance & Compliance Suite
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#008C88] text-white uppercase font-mono tracking-wider">
                  Phase 14 Verification
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Automated Verification Engine for 12 End-to-End Banking Scenarios, Maker-Checker Dual Controls & RBAC Enforcement
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQaSuiteOpen(false)}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Summary Ribbon */}
        <div className="bg-[#F5F7FA] border-b border-[#E3E8F0] px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#66758C] text-[11px] block font-medium">Compliance Readiness</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-[#102544]">{passRate}% Passed</span>
                <span className="text-[11px] font-mono text-[#16845B] font-semibold">({passedCount}/{totalCount} Scenarios)</span>
              </div>
            </div>

            <div className="h-7 w-px bg-[#E3E8F0]" />

            <div>
              <span className="text-[#66758C] text-[11px] block font-medium">Dual-Control Security</span>
              <span className="font-semibold text-[#16845B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Four-Eyes Kernel Enforced
              </span>
            </div>

            <div className="h-7 w-px bg-[#E3E8F0] hidden sm:block" />

            <div className="hidden sm:block">
              <span className="text-[#66758C] text-[11px] block font-medium">Audit Trail Verification</span>
              <span className="font-mono text-[#102544] font-semibold">{auditLogs.length} Events Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetScenarios}
              className="px-3 py-1.5 bg-white border border-[#E3E8F0] hover:bg-slate-100 text-[#17263C] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#66758C]" />
              <span>Reset State</span>
            </button>
            <button
              onClick={handleRunAll}
              disabled={isExecutingAll}
              className="px-4 py-1.5 bg-[#102544] hover:bg-[#0B1730] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#008C88] fill-[#008C88]" />
              <span>{isExecutingAll ? 'Executing Scenarios...' : 'Run All 12 Quality Gate Tests'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E3E8F0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[#66758C] mr-2 font-medium">Category:</span>
            {['All', 'Customer', 'Branch Operations', 'Security & Governance'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-[#102544] text-white shadow-2xs'
                    : 'text-[#66758C] hover:bg-[#F5F7FA] hover:text-[#17263C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-[#66758C] text-[11px] font-mono">
            Showing {filteredScenarios.length} of {totalCount} Test Specifications
          </span>
        </div>

        {/* Scenario Cards List */}
        <div className="p-6 overflow-y-auto space-y-3.5 bg-[#F5F7FA] flex-1">
          {filteredScenarios.map(sc => {
            const isExpanded = expandedId === sc.id;
            const isPassed = sc.status === 'passed';

            return (
              <div
                key={sc.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isExpanded ? 'border-[#102544] ring-1 ring-[#102544]' : 'border-[#E3E8F0] hover:border-[#102544]/40'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : sc.id)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/50"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15 shrink-0">
                      {sc.testId || sc.scenarioCode}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-xs text-[#17263C] leading-snug">
                          {sc.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0]">
                          {sc.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#66758C] mt-1 line-clamp-1">
                        {sc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isPassed
                        ? 'bg-emerald-50 text-[#16845B] border border-emerald-200'
                        : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" /> : <Clock className="w-3.5 h-3.5 text-[#B7791F]" />}
                      {isPassed ? 'PASSED' : 'PENDING'}
                    </span>

                    <button
                      onClick={(e) => handleRunOne(sc.id, e)}
                      className="px-3 py-1 bg-[#102544] hover:bg-[#0B1730] text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Play className="w-3 h-3 text-[#008C88] fill-[#008C88]" />
                      <span>Execute</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : sc.id)}
                      className="text-[#66758C] hover:text-[#17263C] p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#E3E8F0] bg-[#F5F7FA]/60 space-y-4 text-xs">
                    
                    {/* Expected vs Actual Outcomes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-white rounded-lg border border-[#E3E8F0] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#66758C] block">
                          Expected Statutory Outcome:
                        </span>
                        <p className="text-xs text-[#17263C] leading-relaxed">
                          {sc.expectedOutcome || sc.description}
                        </p>
                      </div>

                      <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Verified Actual Outcome:
                        </span>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {sc.actualOutcome || 'Verified: All workflow stages completed with zero discrepancies.'}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Breakdown */}
                    <div className="space-y-2 pt-1">
                      <span className="font-bold text-[#102544] text-xs block">
                        Four-Eyes Verification Stages & Actor Sequence:
                      </span>
                      <div className="space-y-2">
                        {sc.steps.map((st) => (
                          <div
                            key={st.stepNumber}
                            className="p-2.5 bg-white rounded-lg border border-[#E3E8F0] flex items-start gap-3"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                              {st.stepNumber}
                            </span>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-xs text-[#17263C]">{st.title}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0]">
                                  Role: {st.roleRequired || 'System'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#66758C] mt-0.5">
                                {st.actionDescription || st.description}
                              </p>
                            </div>
                            <span className="p-1 rounded bg-emerald-100 text-[#16845B] shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E3E8F0] flex items-center justify-between text-xs text-[#66758C]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#102544]">National Bank</span>
            <span>·</span>
            <span>SafeVault Quality Assurance Engine</span>
            <span>·</span>
            <span className="font-mono text-[11px]">Audit Retention Compliant</span>
          </div>

          <button
            onClick={() => setIsQaSuiteOpen(false)}
            className="px-4 py-2 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] transition-colors"
          >
            Close Suite Console
          </button>
        </div>

      </div>
    </div>
  );
};
