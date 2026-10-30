import React, { useState } from 'react';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  SlidersHorizontal,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
  Check,
  X,
  Sparkles
} from 'lucide-react';

export interface DashboardModuleConfig {
  id: string;
  label: string;
  description: string;
  visible: boolean;
}

export const DEFAULT_DASHBOARD_MODULES: DashboardModuleConfig[] = [
  { id: 'balance-card', label: 'Available Balance & Linked Account', description: 'Real-time masked balance, auto-hide, rent sufficiency & sparkline', visible: true },
  { id: 'action-required', label: 'Action Required Alerts', description: 'Urgent compliance, rent, and KYC reminders', visible: true },
  { id: 'kpi-tiles', label: 'Portfolio Overview KPI Tiles', description: 'Key metrics with trend indicators and status', visible: true },
  { id: 'locker-health', label: 'Locker Health & Security Score', description: 'Radial score ring and biometric checklist', visible: true },
  { id: 'quick-services', label: 'Quick Services Grid', description: '1-tap shortcuts to core vault actions', visible: true },
  { id: 'upcoming-visit', label: 'Upcoming Vault Visit & Queue Ticker', description: 'Live digital turnstile check-in pass card', visible: true },
  { id: 'rent-deposit', label: 'Rent Billing & Tariff Breakdown', description: 'Annual rent, GST, late fees, and surrender refunds', visible: true },
  { id: 'security-centre', label: 'Security & Access Vigilance', description: 'Turnstile logs, security freeze toggle, and dispute reporting', visible: true },
  { id: 'cover-liability', label: 'Statutory Cover & Liability', description: '100x rent ceiling RBI statutory protection', visible: true },
  { id: 'branch-insights', label: 'Branch Footfall Heat Strip', description: 'Strongroom traffic heat strip and recommended visitation hours', visible: true },
  { id: 'locker-analytics', label: 'Visual Locker Analytics', description: 'Donut expense breakdown and monthly visits bar chart', visible: true },
  { id: 'recent-activity', label: 'Recent Activity & Access Logs', description: 'Turnstile audit logs and filterable events', visible: true }
];

export interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: DashboardModuleConfig[];
  onSave: (modules: DashboardModuleConfig[]) => void;
  onReset: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  modules,
  onSave,
  onReset
}) => {
  useScrollLock(isOpen);
  const [localModules, setLocalModules] = useState<DashboardModuleConfig[]>(modules);

  if (!isOpen) return null;

  const toggleVisibility = (id: string) => {
    setLocalModules(prev =>
      prev.map(m => (m.id === id ? { ...m, visible: !m.visible } : m))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setLocalModules(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === localModules.length - 1) return;
    setLocalModules(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleApply = () => {
    onSave(localModules);
    onClose();
  };

  const handleResetToDefault = () => {
    setLocalModules(DEFAULT_DASHBOARD_MODULES);
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
            <div>
              <h3 className="text-h3 font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                Customize Dashboard
              </h3>
              <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                Reorder cards and hide modules to suit your daily workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of modules */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {localModules.map((mod, idx) => (
            <div
              key={mod.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                mod.visible
                  ? 'bg-[#FAF6F8] dark:bg-[#2A1220] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]'
                  : 'bg-slate-100/60 dark:bg-black/30 border-dashed border-slate-300 dark:border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col gap-0.5 text-[#6B5B68] dark:text-[#A898A4]">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-0.5 hover:text-[#97144D] dark:hover:text-[#FFDF85] disabled:opacity-20 text-[10px] leading-none"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === localModules.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-0.5 hover:text-[#97144D] dark:hover:text-[#FFDF85] disabled:opacity-20 text-[10px] leading-none"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1] block truncate">
                    {mod.label}
                  </span>
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block truncate">
                    {mod.description}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleVisibility(mod.id)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  mod.visible
                    ? 'bg-[#97144D]/10 text-[#97144D] dark:bg-[#97144D]/25 dark:text-[#FFDF85]'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                }`}
                title={mod.visible ? 'Hide from dashboard' : 'Show on dashboard'}
              >
                {mod.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 h-10 rounded-xl text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] hover:bg-[#FAF6F8] dark:hover:bg-[#2A1220] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 sm:flex-initial px-5 h-10 bg-[#97144D] hover:bg-[#851144] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active-press cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#FFDF85]" />
            <span>Save Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
};
