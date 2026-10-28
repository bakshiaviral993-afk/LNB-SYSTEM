import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { rentPricingMatrix } from '../../data/mockData';
import { LockerSize, OperatingMode } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Key,
  Calculator,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Calendar,
  Info
} from 'lucide-react';

export const FindLocker: React.FC = () => {
  const { branches, lockers, applications, applyForLocker, setCustomerView, waitingList, joinWaitingList, setSelectedLockerId } = useBanking();
  const [activeTab, setActiveTab] = useState<'search' | 'calculator' | 'apply' | 'my-applications' | 'waiting-list'>('search');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(true);
  const [waitlistSuccessMsg, setWaitlistSuccessMsg] = useState<string | null>(null);

  // Application form state
  const [formBranchId, setFormBranchId] = useState<string>('br-del-01');
  const [formSize, setFormSize] = useState<LockerSize>('Medium');
  const [formOperatingMode, setFormOperatingMode] = useState<OperatingMode>('Single');
  const [formCustomerName, setFormCustomerName] = useState('Rahul Sharma');
  const [formCif, setFormCif] = useState('CIF-9028192831');
  const [formPan, setFormPan] = useState('ABCPS1234F');
  const [formPhone, setFormPhone] = useState('+91 98101 23456');
  const [formEmail, setFormEmail] = useState('rahul.sharma@enterprise-corp.in');
  const [formIncome, setFormIncome] = useState('₹25 Lakhs - ₹50 Lakhs');
  const [formNominee, setFormNominee] = useState('Rohan Sharma (Son)');
  const [formAccount, setFormAccount] = useState('5010049281720 (Premier Savings)');
  const [submittedAppNumber, setSubmittedAppNumber] = useState<string | null>(null);

  // Calculator state
  const [calcSize, setCalcSize] = useState<LockerSize>('Medium');
  const [calcTenureYears, setCalcTenureYears] = useState<number>(1);
  const [includeFdSecurity, setIncludeFdSecurity] = useState<boolean>(true);

  // Filtered branches
  const filteredBranches = branches.filter(b => {
    if (selectedCity !== 'All' && b.city !== selectedCity) return false;
    if (selectedBranchId !== 'all' && b.id !== selectedBranchId) return false;
    return true;
  });

  const cities = ['All', ...Array.from(new Set(branches.map(b => b.city)))];

  // Filtered lockers
  const filteredLockers = lockers.filter(l => {
    if (selectedBranchId !== 'all' && l.branchId !== selectedBranchId) return false;
    if (selectedSize !== 'All' && l.size !== selectedSize) return false;
    if (availabilityOnly && l.status !== 'Vacant') return false;
    return true;
  });

  // Calculate pricing breakdown
  const currentPricing = rentPricingMatrix[calcSize];
  const totalBaseRent = currentPricing.annualRent * calcTenureYears;
  const gstAmount = Math.round(totalBaseRent * 0.18);
  const stampDutyAndAgreement = 500;
  const securityDepositAmount = includeFdSecurity ? currentPricing.deposit : 0;
  const totalPayableEstimate = totalBaseRent + gstAmount + stampDutyAndAgreement + securityDepositAmount;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branchObj = branches.find(b => b.id === formBranchId);
    const appNum = applyForLocker({
      customerName: formCustomerName,
      cifNumber: formCif,
      phone: formPhone,
      email: formEmail,
      branchId: formBranchId,
      branchName: branchObj ? branchObj.name : 'Main Branch',
      sizeRequested: formSize,
      operatingMode: formOperatingMode,
      annualIncomeBracket: formIncome,
      panNumber: formPan,
      nomineeName: formNominee,
      linkedAccountNumber: formAccount,
    });
    setSubmittedAppNumber(appNum);
    setActiveTab('my-applications');
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F0]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#102544]">
            Locker Discovery & Allotment
          </h1>
          <p className="text-xs text-[#66758C] mt-0.5">
            Real-time branch vault availability, transparent rental tariff estimator, and online allotment workflow
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xl border border-[#E3E8F0] overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'search' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Availability Grid
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'calculator' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Rent Calculator
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'apply' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Apply for Locker
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'my-applications' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('waiting-list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'waiting-list' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Waiting List ({waitingList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SEARCH & AVAILABILITY GRID */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#17263C] mb-1">City</label>
              <select
                value={selectedCity}
                onChange={e => {
                  setSelectedCity(e.target.value);
                  setSelectedBranchId('all');
                }}
                className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:outline-none focus:border-[#2457A7] focus:bg-white transition-colors"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#17263C] mb-1">Branch</label>
              <select
                value={selectedBranchId}
                onChange={e => setSelectedBranchId(e.target.value)}
                className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:outline-none focus:border-[#2457A7] focus:bg-white transition-colors"
              >
                <option value="all">All Branches</option>
                {filteredBranches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#17263C] mb-1">Locker Size</label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:outline-none focus:border-[#2457A7] focus:bg-white transition-colors"
              >
                <option value="All">All Sizes</option>
                <option value="Small">Small (Jewelry & Passbooks)</option>
                <option value="Medium">Medium (General Valuables)</option>
                <option value="Large">Large (Property Deeds & Heirlooms)</option>
                <option value="Extra Large">Extra Large (High Capacity)</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer h-9 px-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg w-full text-[#17263C] hover:bg-[#E3E8F0]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={e => setAvailabilityOnly(e.target.checked)}
                  className="rounded text-[#102544] focus:ring-[#2457A7]"
                />
                <span className="font-medium text-xs">Show Vacant Units Only</span>
              </label>
            </div>
          </div>

          {/* Size Specifications Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(sz => {
              const info = rentPricingMatrix[sz];
              const isSelected = selectedSize === sz;
              return (
                <div
                  key={sz}
                  onClick={() => setSelectedSize(isSelected ? 'All' : sz)}
                  className={`p-4 bg-white border rounded-xl cursor-pointer transition-all shadow-xs ${
                    isSelected ? 'border-[#102544] ring-2 ring-[#102544]/20' : 'border-[#E3E8F0] hover:border-[#2457A7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102544] uppercase tracking-wider">{sz}</span>
                    <span className="text-xs font-mono tabular-nums font-bold text-[#16845B]">
                      ₹{info.annualRent.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#66758C] mt-1">
                    Dim: {info.dimensions}
                  </div>
                  <p className="text-[11px] text-[#66758C] mt-2 line-clamp-2 leading-relaxed">
                    {info.desc}
                  </p>
                  <div className="pt-3 border-t border-[#E3E8F0] mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-[#66758C]">Security FD: <span className="font-mono tabular-nums">₹{info.deposit.toLocaleString('en-IN')}</span></span>
                    <span className="text-[#2457A7] font-semibold">Filter →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lockers Matrix Table */}
          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-[#E3E8F0] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-sm font-semibold text-[#102544]">
                  Vault Units & Compartments ({filteredLockers.length})
                </h3>
                <p className="text-xs text-[#66758C]">
                  Instant allocation available for vacant units upon verification of linked savings account
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0]">
                    <th className="py-3 px-4 font-semibold">Locker #</th>
                    <th className="py-3 px-4 font-semibold">Branch & Location</th>
                    <th className="py-3 px-4 font-semibold">Size & Dimensions</th>
                    <th className="py-3 px-4 font-semibold text-right">Annual Rent (Excl GST)</th>
                    <th className="py-3 px-4 font-semibold text-right">FD Security Deposit</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {filteredLockers.map(lkr => (
                    <tr key={lkr.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#102544]">
                        {lkr.lockerNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#17263C]">{lkr.branchName}</div>
                        <div className="text-[11px] text-[#66758C]">{lkr.floor} · {lkr.tier}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#17263C]">{lkr.size}</span>
                        <div className="text-[11px] font-mono text-[#66758C]">{lkr.dimensions}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-[#102544]">
                        ₹{lkr.annualRent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#66758C]">
                        ₹{lkr.securityDeposit.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={lkr.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lkr.status === 'Vacant' ? (
                          <button
                            onClick={() => {
                              setFormBranchId(lkr.branchId);
                              setFormSize(lkr.size);
                              setActiveTab('apply');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors shadow-xs"
                          >
                            Apply Unit
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const code = joinWaitingList(lkr.branchId, lkr.size);
                              setWaitlistSuccessMsg(`Registered on waiting list (${code}) for ${lkr.size} locker at ${lkr.branchName}.`);
                              setActiveTab('waiting-list');
                            }}
                            className="px-2.5 py-1 text-xs text-[#2457A7] hover:text-[#102544] font-semibold hover:underline"
                          >
                            Join Waitlist →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RENT CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-xs space-y-5 text-xs">
            <div>
              <h2 className="text-sm font-bold text-[#102544] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#2457A7]" />
                <span>Transparent Safe Deposit Tariff Calculator</span>
              </h2>
              <p className="text-xs text-[#66758C] mt-0.5">
                Calculate total financial commitment as per Reserve Bank of India transparent pricing norms
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">Select Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setCalcSize(sz)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                        calcSize === sz ? 'bg-[#102544] text-white border-[#102544]' : 'bg-[#F5F7FA] text-[#17263C] border-[#E3E8F0] hover:bg-[#E3E8F0]/50'
                      }`}
                    >
                      <div className="font-bold">{sz}</div>
                      <div className="text-[11px] opacity-80 font-mono tabular-nums">₹{rentPricingMatrix[sz].annualRent.toLocaleString('en-IN')}/yr</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#17263C] mb-1">
                    Lease Tenure: <span className="font-bold text-[#102544] font-mono tabular-nums">{calcTenureYears} Year(s)</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    value={calcTenureYears}
                    onChange={e => setCalcTenureYears(parseInt(e.target.value))}
                    className="w-full accent-[#102544]"
                  />
                  <div className="flex justify-between text-[11px] text-[#66758C] mt-1">
                    <span>1 Year</span>
                    <span>2 Years</span>
                    <span>3 Years (Max advance)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeFdSecurity}
                      onChange={e => setIncludeFdSecurity(e.target.checked)}
                      className="mt-0.5 rounded text-[#102544] focus:ring-[#2457A7]"
                    />
                    <div className="text-[11px] text-[#66758C]">
                      <span className="font-semibold block text-[#102544]">Include Linked Term Deposit (Security Deposit)</span>
                      As per RBI guidelines, banks may obtain a term deposit covering 3 years rent plus break-open charges to cover eventualities.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3E8F0] flex justify-end">
              <button
                onClick={() => {
                  setFormSize(calcSize);
                  setActiveTab('apply');
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Proceed to Apply for {calcSize} Locker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pricing Receipt Summary Card */}
          <div className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#66758C] border-b border-[#E3E8F0] pb-2">
              Initial Financial Outflow Estimate
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#66758C]">Base Annual Rent ({calcTenureYears} yr)</span>
                <span className="font-mono tabular-nums font-medium text-[#102544]">₹{totalBaseRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">GST @ 18%</span>
                <span className="font-mono tabular-nums font-medium text-[#102544]">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">e-Stamp Duty & Documentation</span>
                <span className="font-mono tabular-nums font-medium text-[#102544]">₹{stampDutyAndAgreement}</span>
              </div>
              {includeFdSecurity && (
                <div className="flex justify-between">
                  <span className="text-[#66758C]">Fixed Deposit Security (Refundable)</span>
                  <span className="font-mono tabular-nums font-medium text-[#102544]">₹{securityDepositAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E3E8F0] flex justify-between font-bold text-sm text-[#102544]">
                <span>Total Initial Outflow</span>
                <span className="font-mono tabular-nums text-[#16845B]">₹{totalPayableEstimate.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#E3E8F0] rounded-lg text-[11px] text-[#66758C] leading-relaxed">
              * The security deposit continues to earn interest at prevailing bank term deposit rates (currently 7.10% p.a.). It is not an expenditure and is fully refundable upon locker surrender.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLY FOR LOCKER */}
      {activeTab === 'apply' && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-bold text-[#102544]">
              Application for Safe Deposit Locker Compartment
            </h2>
            <p className="text-xs text-[#66758C] mt-0.5">
              Form L-101 as per Banking Regulation Act, 1949 and RBI Master Direction
            </p>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">Target Branch</label>
                <select
                  value={formBranchId}
                  onChange={e => setFormBranchId(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.availableLockers} vacant units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Requested Locker Size</label>
                <select
                  value={formSize}
                  onChange={e => setFormSize(e.target.value as LockerSize)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  <option value="Small">Small (₹2,500/yr)</option>
                  <option value="Medium">Medium (₹4,500/yr)</option>
                  <option value="Large">Large (₹7,800/yr)</option>
                  <option value="Extra Large">Extra Large (₹12,500/yr)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Operating Mandate</label>
                <select
                  value={formOperatingMode}
                  onChange={e => setFormOperatingMode(e.target.value as OperatingMode)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  <option value="Single">Single (Self Only)</option>
                  <option value="Either or Survivor">Either or Survivor (Joint Mandate)</option>
                  <option value="Jointly">Jointly (Both Signatures Mandatory)</option>
                  <option value="Former or Survivor">Former or Survivor</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Annual Income Bracket</label>
                <select
                  value={formIncome}
                  onChange={e => setFormIncome(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  <option value="₹10 Lakhs - ₹15 Lakhs">₹10 Lakhs - ₹15 Lakhs</option>
                  <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                  <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                  <option value="₹50 Lakhs+">₹50 Lakhs+</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Primary Applicant Name</label>
                <input
                  type="text"
                  value={formCustomerName}
                  onChange={e => setFormCustomerName(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Customer CIF Number</label>
                <input
                  type="text"
                  value={formCif}
                  disabled
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-mono tabular-nums text-[#66758C] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">PAN Card Number</label>
                <input
                  type="text"
                  value={formPan}
                  disabled
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-mono tabular-nums text-[#66758C] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Registered Phone</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Nominee Name (Form DA-1 Initial Declaration)</label>
                <input
                  type="text"
                  value={formNominee}
                  onChange={e => setFormNominee(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Auto-Debit Linked Account</label>
                <input
                  type="text"
                  value={formAccount}
                  disabled
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#66758C] font-mono tabular-nums cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-[11px] text-[#66758C] space-y-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-[#102544] focus:ring-[#2457A7]" />
                <span>
                  I/We agree to the Model Locker Agreement covenants, terms of safe custody, annual renewal auto-debit authority, and bank vault operational hours.
                </span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 text-[#66758C] hover:bg-[#F5F7FA] rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors shadow-xs"
              >
                Submit Locker Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: APPLICATION TRACKING */}
      {activeTab === 'my-applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102544]">
              Locker Application Status & History ({applications.length})
            </h3>
            <button
              onClick={() => setActiveTab('apply')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              + New Application
            </button>
          </div>

          <div className="space-y-3">
            {applications.map(app => (
              <div
                key={app.id}
                className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-xs text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3E8F0] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums font-bold text-[#102544]">{app.applicationNumber}</span>
                    <span className="text-[#66758C]">·</span>
                    <span className="font-semibold text-[#17263C]">{app.branchName}</span>
                    <span className="text-[#66758C]">·</span>
                    <span className="text-[#66758C]">{app.sizeRequested} Locker</span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#66758C] block">Applicant</span>
                    <span className="font-medium text-[#17263C]">{app.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Operating Mode</span>
                    <span className="font-medium text-[#17263C]">{app.operatingMode}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Submitted Date</span>
                    <span className="font-mono tabular-nums text-[#17263C]">{app.appliedDate}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Allotted Unit</span>
                    <span className="font-mono tabular-nums font-bold text-[#16845B]">
                      {app.allottedLockerNumber || 'Pending Allotment'}
                    </span>
                  </div>
                </div>

                {app.status === 'Approved - Allotted' && (
                  <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Allotment Confirmed · Locker {app.allottedLockerNumber}</span>
                      </span>
                      <span className="font-mono text-emerald-800 font-bold">
                        Ready for Physical Key Handover
                      </span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      Your compartment has been allocated. Please schedule a visit to execute the physical stamp agreement and receive your original tamper-evident key.
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          if (app.allottedLockerId) setSelectedLockerId(app.allottedLockerId);
                          setCustomerView('visit');
                        }}
                        className="px-3.5 py-1.5 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 text-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Schedule Key Handover Appointment</span>
                      </button>
                    </div>
                  </div>
                )}

                {app.notes && (
                  <div className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] text-[11px] text-[#66758C]">
                    <strong className="text-[#17263C]">Operations Note:</strong> {app.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WAITING LIST */}
      {activeTab === 'waiting-list' && (
        <div className="space-y-4">
          {waitlistSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-center justify-between">
              <span>{waitlistSuccessMsg}</span>
              <button onClick={() => setWaitlistSuccessMsg(null)} className="font-bold text-[#66758C] hover:text-[#17263C]">✕</button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Locker Waitlist Queue & Tracking ({waitingList.length})
              </h3>
              <p className="text-[#66758C] text-[11px]">
                Under RBI rules, vacant lockers are allocated transparently to waitlisted customers in order of priority
              </p>
            </div>
            <button
              onClick={() => setActiveTab('search')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              Browse Availability Grid →
            </button>
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0]">
                    <th className="py-3 px-4 font-semibold">Waitlist Code</th>
                    <th className="py-3 px-4 font-semibold">Branch Location</th>
                    <th className="py-3 px-4 font-semibold">Size Requested</th>
                    <th className="py-3 px-4 font-semibold">Applicant</th>
                    <th className="py-3 px-4 font-semibold">Registration Date</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Priority Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {waitingList.map(item => (
                    <tr key={item.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#102544]">
                        {item.waitlistCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#17263C]">
                        {item.branchName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#102544]">
                        {item.sizeRequested} Locker
                      </td>
                      <td className="py-3 px-4 text-[#66758C]">
                        <span className="text-[#17263C] font-medium">{item.customerName}</span> ({item.cifNumber})
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[#66758C]">
                        {item.joinedDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#102544]">
                        {item.priorityScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
