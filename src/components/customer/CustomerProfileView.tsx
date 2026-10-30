import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { mockBankCustomerProfile } from '../../services/bankIntegrationService';
import {
  User,
  Shield,
  CreditCard,
  FileText,
  Key,
  Bell,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight,
  LogOut,
  Sparkles,
  Building,
  HelpCircle,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';

interface CustomerProfileViewProps {
  onOpenTraceabilityMatrix?: () => void;
  onOpenAllServices?: () => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  onOpenTraceabilityMatrix,
  onOpenAllServices
}) => {
  const { logout, setCustomerView, resetDemoData } = useBanking();
  const profile = mockBankCustomerProfile;

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [instantAlertsEnabled, setInstantAlertsEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 pb-20 text-xs text-[#16233B]">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#0B1730] to-[#102544] text-white p-4 rounded-2xl shadow-md space-y-3 relative overflow-hidden border border-[#102544]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2457A7] to-[#008C88] border border-white/20 flex items-center justify-center font-bold text-lg text-white shadow-inner">
              RS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-white">{profile.customerName}</h1>
                <span className="bg-amber-400 text-[#102544] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  HNI PREMIER
                </span>
              </div>
              <span className="font-mono text-xs text-white/70 block mt-0.5">
                CIF: {profile.cifNumber}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            KYC Verified
          </span>
        </div>

        {/* Profile Contact Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-white/80 font-mono">
          <div>
            <span className="text-white/60 text-xs block font-sans">PAN Number</span>
            <strong>{profile.panNumber}</strong>
          </div>
          <div>
            <span className="text-white/60 text-xs block font-sans">Registered Mobile</span>
            <strong>{profile.mobile}</strong>
          </div>
          <div className="col-span-2">
            <span className="text-white/60 text-xs block font-sans">Official Email</span>
            <strong>{profile.email}</strong>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#16845B] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold p-1">✕</button>
        </div>
      )}

      {/* Linked Banking Accounts (CBS Auto-Debit) */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#2457A7]" />
            <h3 className="font-bold text-xs text-[#102544]">Linked Bank Accounts</h3>
          </div>
          <span className="text-xs text-[#16845B] font-bold font-mono">CBS Connected</span>
        </div>

        <div className="space-y-2">
          {profile.linkedAccounts.map((acc, idx) => (
            <div key={idx} className="p-3 bg-[#F6F8FB] rounded-xl border border-[#E3E8F0] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#16233B] block">{acc.accountType}</span>
                <span className="font-mono text-xs text-[#64748B]">A/c: •••• {acc.accountNumber.slice(-4)}</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-xs text-[#102544]">₹{acc.balance.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#008C88] block font-sans font-bold">Auto-Debit Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation to Customer Modules */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-4 shadow-sm space-y-2">
        <h3 className="font-bold text-xs text-[#64748B] uppercase tracking-wider mb-2">
          Locker Services & Portfolio
        </h3>

        {[
          { label: 'Holders & Mandates', desc: 'Joint hirers & operating instructions', view: 'holders', icon: User },
          { label: 'Nomination (Form DA-1)', desc: 'Register or modify nominees', view: 'holders', icon: Key },
          { label: 'Agreements & KYC Refresh', desc: 'Model Agreement & e-Sign status', view: 'agreements', icon: FileText },
          { label: 'Document Vault', desc: 'Allotment letters, receipts & tax invoices', view: 'vault', icon: FileText },
          { label: 'Customer Service Requests', desc: 'Lost key, damage, size upgrade & relocation', view: 'requests', icon: Shield },
          { label: 'Locker Surrender & Closure', desc: 'Initiate surrender & final settlement', view: 'closure', icon: LogOut },
          { label: 'Branch Directory & Help', desc: '28 branch manager contacts & FAQs', view: 'support', icon: HelpCircle }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              onClick={() => setCustomerView(item.view)}
              className="p-3 rounded-xl border border-transparent hover:border-[#E3E8F0] hover:bg-[#F6F8FB] cursor-pointer flex items-center justify-between transition-all min-h-[50px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#102544]/10 text-[#102544] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs text-[#16233B] block">{item.label}</strong>
                  <span className="text-xs text-[#64748B]">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Security & Biometrics Controls */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-[#64748B] uppercase tracking-wider">
          Security Preferences
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 bg-[#F6F8FB] rounded-xl border border-[#E3E8F0]">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-5 h-5 text-[#2457A7]" />
              <div>
                <strong className="text-xs text-[#16233B] block">Biometric / Face ID</strong>
                <span className="text-xs text-[#64748B]">One-touch login authentication</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricEnabled}
              onChange={e => {
                setBiometricEnabled(e.target.checked);
                showToast(`Biometric authentication ${e.target.checked ? 'enabled' : 'disabled'}.`);
              }}
              className="w-5 h-5 accent-[#102544] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F6F8FB] rounded-xl border border-[#E3E8F0]">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-[#008C88]" />
              <div>
                <strong className="text-xs text-[#16233B] block">Turnstile Access SMS/Email</strong>
                <span className="text-xs text-[#64748B]">Instant security alert on every vault entry</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={instantAlertsEnabled}
              onChange={e => {
                setInstantAlertsEnabled(e.target.checked);
                showToast(`Access alerts ${e.target.checked ? 'enabled' : 'disabled'}.`);
              }}
              className="w-5 h-5 accent-[#102544] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Traceability Matrix & Service Catalogue Hub */}
      <div
        onClick={onOpenTraceabilityMatrix}
        className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer hover:border-blue-400 transition-all flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2457A7] text-white flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs font-bold text-[#102544] block">
              Functional Service Catalogue (A–L)
            </strong>
            <span className="text-xs text-[#2457A7]">
              View requirements traceability matrix
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#2457A7] shrink-0" />
      </div>

      {/* Reset Demo Data & Logout */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            resetDemoData();
            showToast('Demonstration state reset to default.');
          }}
          className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-[#64748B] font-semibold rounded-xl text-xs transition-colors"
        >
          Reset Demo Data
        </button>

        <button
          onClick={logout}
          className="w-full h-12 bg-rose-50 hover:bg-rose-100 text-[#C83E44] border border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Secure Customer Logout</span>
        </button>
      </div>

    </div>
  );
};
