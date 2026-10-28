import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Users,
  Search,
  UserCheck,
  Shield,
  FileCheck2,
  FileText,
  Lock,
  ChevronRight,
  Phone,
  Mail,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CreditCard
} from 'lucide-react';

export const CustomerManagementDesk: React.FC = () => {
  const {
    lockers,
    nominees,
    currentUser,
    branches,
    serviceRequests,
    documents
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-rahul-01');
  const [activeTab, setActiveTab] = useState<'profile' | 'mandates' | 'nominees' | 'lockers'>('profile');

  // Customer master records derived from real demo hirers
  const customerList = [
    {
      id: 'cust-rahul-01',
      cif: 'CIF-8829104',
      name: 'Rahul Sharma',
      type: 'Individual (Resident)',
      pan: 'ABCPS1234F',
      mobile: '+91 98765 43210',
      email: 'rahul.sharma@enterprise.in',
      address: 'Flat 402, Sea Green Heights, Worli Sea Face, Mumbai 400018',
      operativeAccount: 'NB-00129840192 (Savings - Active)',
      riskCategory: 'Low Risk',
      kycStatus: 'Verified (Re-KYC Due: 2028)',
      mandateType: 'Either or Survivor (E or S)',
      lockersCount: lockers.filter(l => l.customerId === 'cust-rahul-01').length
    },
    {
      id: 'cust-anita-02',
      cif: 'CIF-9938102',
      name: 'Anita Verma',
      type: 'Joint Account Hirer',
      pan: 'BKMPV5678G',
      mobile: '+91 98111 22334',
      email: 'anita.verma@corp.net',
      address: 'Plot 18, Sector 15, Vashi, Navi Mumbai 400703',
      operativeAccount: 'NB-00994821044 (Current Account)',
      riskCategory: 'Medium Risk',
      kycStatus: 'Verified (CKYC Valid)',
      mandateType: 'Jointly by All Hirers',
      lockersCount: lockers.filter(l => l.customerId === 'cust-anita-02').length
    },
    {
      id: 'cust-vikram-03',
      cif: 'CIF-3341098',
      name: 'Vikram Malhotra',
      type: 'Sole Proprietorship',
      pan: 'AAMPM9912K',
      mobile: '+91 97234 11223',
      email: 'v.malhotra@tradelink.org',
      address: 'Suite 3B, Nariman Point Commercial Tower, Mumbai 400021',
      operativeAccount: 'NB-00441209841 (OD Facility Account)',
      riskCategory: 'Low Risk',
      kycStatus: 'Verified (CKYC Valid)',
      mandateType: 'Power of Attorney (PoA)',
      lockersCount: lockers.filter(l => l.customerId === 'cust-vikram-03').length
    }
  ];

  const filteredCustomers = customerList.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.cif.toLowerCase().includes(q) ||
      c.pan.toLowerCase().includes(q) ||
      c.mobile.includes(q)
    );
  });

  const activeCustomer = customerList.find(c => c.id === selectedCustomerId) || customerList[0];
  const customerLockers = lockers.filter(l => l.customerId === activeCustomer.id);
  const customerNominees = Object.values(nominees).flat();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#102544] text-[#008C88] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#102544] tracking-tight">
                Customer Portfolio & Operating Mandates Desk
              </h1>
              <p className="text-xs text-[#66758C]">
                360° Hirer Master, CKYC status, Form DA-1 nominees, and mandate authorization controls
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#66758C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Name, CIF, PAN or Mobile..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F5F7FA] border border-[#E3E8F0] text-xs rounded-lg text-[#102544] placeholder-[#66758C] focus:outline-none focus:border-[#2457A7]"
            />
          </div>
        </div>
      </div>

      {/* Main Split Layout: Customer Selector on Left, 360 Portfolio on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List Column */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#66758C] px-1">
            Registered SafeVault Hirers ({filteredCustomers.length})
          </div>

          <div className="space-y-2">
            {filteredCustomers.map(cust => {
              const isSelected = cust.id === activeCustomer.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#102544] text-white border-[#102544] shadow-xs'
                      : 'bg-white text-[#102544] border-[#E3E8F0] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm tracking-tight">{cust.name}</div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E3E8F0] text-[#102544]'
                    }`}>
                      {cust.cif}
                    </span>
                  </div>

                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-white/70' : 'text-[#66758C]'}`}>
                    {cust.type} · PAN: {cust.pan}
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-[#008C88] font-semibold' : 'text-[#2457A7] font-semibold'}>
                      {cust.mandateType}
                    </span>
                    <span className="font-mono font-bold">
                      {cust.lockersCount} {cust.lockersCount === 1 ? 'Locker' : 'Lockers'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 360 Customer Detail View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-[#E3E8F0]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'text-[#66758C] hover:text-[#102544]'
              }`}
            >
              Hirer Master Profile
            </button>
            <button
              onClick={() => setActiveTab('mandates')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'mandates'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'text-[#66758C] hover:text-[#102544]'
              }`}
            >
              Operating Mandates
            </button>
            <button
              onClick={() => setActiveTab('nominees')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'nominees'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'text-[#66758C] hover:text-[#102544]'
              }`}
            >
              Form DA-1 Nominees
            </button>
            <button
              onClick={() => setActiveTab('lockers')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'lockers'
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'text-[#66758C] hover:text-[#102544]'
              }`}
            >
              Allocated Lockers ({customerLockers.length})
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8F0]">
                <div>
                  <h2 className="text-base font-extrabold text-[#102544]">{activeCustomer.name}</h2>
                  <div className="text-xs text-[#66758C] flex items-center gap-2 mt-0.5">
                    <span>{activeCustomer.type}</span>
                    <span>·</span>
                    <span className="font-mono text-[#102544] font-bold">{activeCustomer.cif}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {activeCustomer.kycStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
                  <span className="text-[11px] font-bold text-[#66758C]">Permanent Account Number (PAN)</span>
                  <div className="font-mono font-bold text-[#102544] text-sm">{activeCustomer.pan}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">ITD NSDL Verified Match</div>
                </div>

                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
                  <span className="text-[11px] font-bold text-[#66758C]">Linked Operative Account</span>
                  <div className="font-mono font-bold text-[#102544]">{activeCustomer.operativeAccount}</div>
                  <div className="text-[10px] text-[#66758C]">Auto-Debit Mandate Active</div>
                </div>

                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
                  <span className="text-[11px] font-bold text-[#66758C]">Registered Mobile & 2FA</span>
                  <div className="font-semibold text-[#102544]">{activeCustomer.mobile}</div>
                  <div className="text-[10px] text-emerald-700">SMS OTP & Biometrics Enabled</div>
                </div>

                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
                  <span className="text-[11px] font-bold text-[#66758C]">Communication Address</span>
                  <div className="text-[#102544] leading-relaxed">{activeCustomer.address}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mandates Tab */}
          {activeTab === 'mandates' && (
            <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
                <div>
                  <h3 className="font-bold text-[#102544] text-sm">Operating Mandate Clauses</h3>
                  <p className="text-[11px] text-[#66758C]">Statutory vault entry authorization signed under Master Agreement</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                  {activeCustomer.mandateType}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-start gap-3">
                  <KeyRound className="w-4 h-4 text-[#2457A7] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-[#102544]">Access Authorization Rule</div>
                    <p className="text-[11px] text-[#66758C] mt-0.5 leading-relaxed">
                      Under "{activeCustomer.mandateType}", single hirer or survivor can operate without joint co-signature. Key custodian requires 2FA token check on turnstile entry.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-start gap-3">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-[#102544]">Power of Attorney / Authority Letter Status</div>
                    <p className="text-[11px] text-[#66758C] mt-0.5 leading-relaxed">
                      PoA registered on 14-Aug-2024. Validated by Chief Legal Manager. No court stay or revocation notice on file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nominees Tab */}
          {activeTab === 'nominees' && (
            <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
                <div>
                  <h3 className="font-bold text-[#102544] text-sm">Banking Companies (Nomination) Rules, 1985</h3>
                  <p className="text-[11px] text-[#66758C]">Statutory Form DA-1 filing records</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Active DA-1 On Record
                </span>
              </div>

              <div className="space-y-3">
                {customerNominees.map(n => (
                  <div key={n.id} className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#102544] text-sm">{n.name}</div>
                      <div className="text-[11px] text-[#66758C]">
                        Relationship: <strong className="text-[#102544]">{n.relationship}</strong> · {n.isMinor ? 'Minor (Guardian Assigned)' : 'Major'} · Form Ref: {n.formDa1Reference}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {n.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lockers Tab */}
          {activeTab === 'lockers' && (
            <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-[#102544] text-sm">Leased SafeVault Lockers</h3>
              {customerLockers.length === 0 ? (
                <div className="py-6 text-center text-[#66758C]">
                  No lockers currently leased under this customer CIF.
                </div>
              ) : (
                <div className="space-y-2">
                  {customerLockers.map(l => (
                    <div key={l.id} className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#102544] text-white flex items-center justify-center font-mono font-bold text-xs">
                          {l.lockerNumber}
                        </div>
                        <div>
                          <div className="font-bold text-[#102544]">{branches.find(b => b.id === l.branchId)?.name}</div>
                          <div className="text-[11px] text-[#66758C]">Size: {l.size} · Annual Tariff: ₹{l.annualRent.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'Occupied' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {l.status}
                        </span>
                        <div className="text-[10px] text-[#66758C] mt-0.5">
                          {(l.outstandingRent || 0) > 0 ? `Dues: ₹${l.outstandingRent}` : 'Zero Dues'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
