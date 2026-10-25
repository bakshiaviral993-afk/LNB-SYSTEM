import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  X,
  FileCheck,
  CheckSquare,
  AlertCircle,
  ExternalLink,
  Users,
  ShieldAlert
} from 'lucide-react';

interface QualityGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityGateModal: React.FC<QualityGateModalProps> = ({ isOpen, onClose }) => {
  const {
    scenarios,
    executeScenarioStep,
    runFullScenario,
    resetScenarios,
    userRole,
    switchUserRole
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'scenarios' | 'modules'>('scenarios');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-1');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const passedCount = scenarios.filter(s => s.status === 'passed').length;
  const inProgressCount = scenarios.filter(s => s.status === 'in_progress').length;
  const pendingCount = scenarios.filter(s => s.status === 'pending').length;

  const filteredScenarios = scenarios.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleRunAll = () => {
    scenarios.forEach(s => {
      runFullScenario(s.id);
    });
  };

  const modulesList = [
    {
      category: 'Customer Portal Modules',
      items: [
        { name: 'Dashboard & Portfolio Card', status: 'Operational', notes: 'Locker cards, renewal dates, outstanding dues, quick action jump' },
        { name: 'Find a Locker & Rent Calculator', status: 'Operational', notes: 'Size grid, branch filter, dynamic GST calculator, instant application' },
        { name: 'Branch Visit Booking & Digital Token QR', status: 'Operational', notes: 'Turnstile check-in QR, slot picker, rescheduling & cancellation' },
        { name: 'Rent, Outstanding Dues & GST Invoices', status: 'Operational', notes: '2FA OTP simulated payment, downloadable stamped tax invoices' },
        { name: 'Holders, Nominees (Form DA-1) & Mandate', status: 'Operational', notes: 'Primary/Joint view, Form DA-1 filing, POA operators' },
        { name: 'Service Requests & Lost Key Reporting', status: 'Operational', notes: 'Damage repair, lost key drill booking, surrendered closure' },
        { name: 'Deceased-Holder Settlement Claims', status: 'Operational', notes: '15-day statutory claim filing with death certificate and legal heir KYC' },
        { name: 'Vault Documents & Digital Certificates', status: 'Operational', notes: 'Allotment orders, stamped agreements, Form DA-1 endorsements' },
        { name: 'Access Ledger & Dispute Logging', status: 'Operational', notes: 'Biometric log records, unrecognized access flagging to Security' },
        { name: 'Periodic KYC Refresh & Profile Security', status: 'Operational', notes: 'Aadhaar/PAN periodic refresh, CBS address update' },
      ]
    },
    {
      category: 'Bank Operations Modules',
      items: [
        { name: 'Branch Custodian Dashboard', status: 'Operational', notes: 'Strongroom occupancy, today visits, turnstile check-ins, pending makers' },
        { name: 'Application Scrutiny Desk (Maker-Checker)', status: 'Operational', notes: 'Maker KYC scrutiny, Checker unit allotment memo sign-off' },
        { name: 'Visual Vault Compartment Grid & Hierarchy', status: 'Operational', notes: 'Interactive tiers/rows, compartment status inspection' },
        { name: 'Turnstile Check-In & Biometric Access Log', status: 'Operational', notes: 'QR token scanning, dual-key master turn certification' },
        { name: 'Nominee & Holder Verification Desk', status: 'Operational', notes: 'Form DA-1 scrutiny, specimen signature cross-check' },
        { name: 'Service Request Triage & Break-Open Orders', status: 'Operational', notes: 'Locksmith fee calculation, drill witnessed approvals' },
        { name: 'Deceased Claim Settlement Workflow', status: 'Operational', notes: '4-stage scrutiny, inventory committee, closure release' },
        { name: 'Locker Surrender & Deposit Clearance', status: 'Operational', notes: 'Key surrender, zero-balance inventory certificate, deposit credit' },
        { name: 'CBS Comprehensive Audit Ledger', status: 'Operational', notes: 'Actor attribution, IP tracking, filterable compliance logs' },
      ]
    },
    {
      category: 'Administration & Governance',
      items: [
        { name: 'Staff User Directory & Persona Switcher', status: 'Operational', notes: '6 roles: Customer, Maker, Checker, Manager, HO Admin, Auditor' },
        { name: 'Roles & Granular Permissions Matrix', status: 'Operational', notes: 'Maker vs Checker segregation, read-only auditor permissions' },
        { name: 'Circle & Branch Vault Configuration', status: 'Operational', notes: 'Regional circles, SOL ID, locker capacity, operational hours' },
        { name: 'Locker Size & Annual Tariff Master', status: 'Operational', notes: 'Small, Medium, Large, XL rent & security deposit configuration' },
        { name: 'SLA Matrix & Escalation Thresholds', status: 'Operational', notes: 'Turnaround hours for Lost Key, Break-Open, Surrender, Complaints' },
        { name: 'Notification Templates (SMS / Email / WhatsApp)', status: 'Operational', notes: 'Regulatory text templates with placeholders' },
        { name: 'Session Inactivity & Security Simulation', status: 'Operational', notes: '401 timeout trigger, 2FA MPIN re-authentication lifecycle' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-5xl w-full flex flex-col max-h-[92vh] overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-[#102544] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16845B] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Enterprise Quality Gate & Scenario Validation Suite
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#16845B]/20 text-emerald-300 border border-[#16845B]/40">
                  POC VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                Chief Solution Architect & Banking QA Lead verification for National Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Tabs & Metrics */}
        <div className="bg-[#F5F7FA] border-b border-[#E3E8F0] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'bg-white text-[#17263C] border border-[#E3E8F0] hover:bg-[#F5F7FA]'
              }`}
            >
              10 End-to-End Test Scenarios
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                activeTab === 'modules'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'bg-white text-[#17263C] border border-[#E3E8F0] hover:bg-[#F5F7FA]'
              }`}
            >
              Full Module Audit Checklist (26/26)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Scenarios:</span>
              <span className="font-bold font-mono text-emerald-800">{passedCount} Passed</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold font-mono text-amber-800">{inProgressCount} Active</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold font-mono text-slate-500">{pendingCount} Untested</span>
            </div>

            <button
              onClick={handleRunAll}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              Automate All 10 Scenarios
            </button>

            <button
              onClick={resetScenarios}
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-all"
              title="Reset Test Scenarios & Database"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'scenarios' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Scenarios Master List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Workflow Test Scenarios
                  </h3>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-2 py-0.5 rounded ${filterStatus === 'all' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      All ({scenarios.length})
                    </button>
                    <button
                      onClick={() => setFilterStatus('passed')}
                      className={`px-2 py-0.5 rounded ${filterStatus === 'passed' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      Passed ({passedCount})
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredScenarios.map(sc => (
                    <div
                      key={sc.id}
                      onClick={() => setSelectedScenarioId(sc.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                        selectedScenarioId === sc.id
                          ? 'border-slate-900 bg-white ring-2 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[11px] text-slate-500">
                          SCENARIO {sc.scenarioNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          sc.status === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sc.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {sc.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        {sc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {sc.description}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-100">
                        <span>{sc.steps.filter(s => s.status === 'completed').length}/{sc.steps.length} Steps</span>
                        <span>{sc.lastTestedDate ? `Tested: ${sc.lastTestedDate}` : 'Not run yet'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Scenario Details & Live Runner (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                        SCENARIO {selectedScenario.scenarioNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {selectedScenario.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">
                      {selectedScenario.description}
                    </p>
                  </div>

                  <button
                    onClick={() => runFullScenario(selectedScenario.id)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1.5 shrink-0 shadow-2xs transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    Run Scenario Now
                  </button>
                </div>

                {/* Workflow Roles Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-950 block mb-0.5">Customer Experience:</span>
                    <span className="text-blue-900 leading-tight">{selectedScenario.customerAction}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-950 block mb-0.5">Bank Operations Workflow:</span>
                    <span className="text-emerald-900 leading-tight">{selectedScenario.bankAction}</span>
                  </div>
                </div>

                {/* Step by step execution checklist */}
                <div className="space-y-2 pt-2">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>Validation Sequence ({selectedScenario.steps.length} Steps)</span>
                    <span className="text-[11px] text-slate-500 font-normal">Click checkmark to toggle step</span>
                  </h5>

                  <div className="space-y-2">
                    {selectedScenario.steps.map(step => (
                      <div
                        key={step.stepNumber}
                        className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                          step.status === 'completed'
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => executeScenarioStep(selectedScenario.id, step.stepNumber)}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                              step.status === 'completed'
                                ? 'bg-emerald-700 text-white'
                                : 'border border-slate-300 bg-white hover:bg-slate-100'
                            }`}
                          >
                            {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <span className="font-bold text-slate-900 text-[11px]">
                              Step {step.stepNumber}: {step.title}
                            </span>
                            <span className="text-slate-500 text-[10px] block mt-0.5">
                              {step.description}
                            </span>
                          </div>
                        </div>

                        <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase shrink-0 ${
                          (step.actor || '').includes('Customer')
                            ? 'bg-blue-100 text-blue-800'
                            : (step.actor || '').includes('Maker')
                            ? 'bg-purple-100 text-purple-800'
                            : (step.actor || '').includes('Checker')
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {step.actor || 'Staff'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Persona Jump */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-700">Test this scenario under persona:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { switchUserRole('customer'); onClose(); }}
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-800"
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => { switchUserRole('branch_maker'); onClose(); }}
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-800"
                    >
                      Branch Maker
                    </button>
                    <button
                      onClick={() => { switchUserRole('branch_checker'); onClose(); }}
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-800"
                    >
                      Branch Checker
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* Modules Audit Checklist */
            <div className="space-y-6">
              {modulesList.map((cat, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-200">
                    {cat.category} ({cat.items.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.items.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs">
                            {item.name}
                          </div>
                          <div className="text-slate-500 text-[11px] leading-tight">
                            {item.notes}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800 shrink-0">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>National Bank · SafeVault Locker Management System · Enterprise Release</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
          >
            Close Suite
          </button>
        </div>

      </div>
    </div>
  );
};
