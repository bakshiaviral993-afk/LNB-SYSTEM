import React, { useState, useEffect, useMemo } from 'react';
import { useBanking } from '../../context/BankingContext';
import { rentPricingMatrix } from '../../data/mockData';
import { LockerSize, OperatingMode } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { LockerWaitlist } from './LockerWaitlist';
import {
  DEMO_BRANCHES_GEO,
  DEFAULT_DEMO_COORDINATES,
  calculateDistanceKm,
  reverseGeocodeMock,
  EnhancedBranchGeo,
  GeoCoordinate
} from '../../utils/geoUtils';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  Search,
  MapPin,
  Navigation,
  Compass,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Calendar,
  Info,
  Key,
  Calculator,
  SlidersHorizontal,
  ChevronRight,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

export const FindLocker: React.FC = () => {
  const { applications, applyForLocker, setCustomerView, joinWaitingList, setSelectedLockerId } = useBanking();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'search' | 'apply' | 'my-applications' | 'waiting-list'>('search');

  // Geolocation states
  const [userCoords, setUserCoords] = useState<GeoCoordinate | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationPermissionPrompt, setLocationPermissionPrompt] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('br-nm-01');

  // Calculator bottom sheet modal
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcSize, setCalcSize] = useState<LockerSize>('Medium');
  const [calcTenureYears, setCalcTenureYears] = useState<number>(1);
  const [includeFdSecurity, setIncludeFdSecurity] = useState<boolean>(true);

  // Hook up useScrollLock for calculator bottom sheet
  useScrollLock(isCalcOpen);

  // Application form state (Form L-101)
  const [formBranchId, setFormBranchId] = useState<string>('br-nm-01');
  const [formSize, setFormSize] = useState<LockerSize>('Medium');
  const [formOperatingMode, setFormOperatingMode] = useState<OperatingMode>('Single');
  const [formCustomerName] = useState('Rahul Sharma');
  const [formCif] = useState('CIF-9028192831');
  const [formPan] = useState('ABCPS1234F');
  const [formPhone, setFormPhone] = useState('+91 98101 23456');
  const [formEmail, setFormEmail] = useState('rahul.sharma@enterprise-corp.in');
  const [formIncome, setFormIncome] = useState('₹25 Lakhs - ₹50 Lakhs');
  const [formNominee, setFormNominee] = useState('Rohan Sharma (Son)');
  const [formAccount] = useState('5010049281720 (Premier Savings)');
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);

  // Toast / Confirmation notices
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(null), 4000);
  };

  // Request browser location
  const handleRequestLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      handleUseDemoLocation('Browser does not support geolocation API. Falling back to Navi Mumbai demo hub.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const geoInfo = reverseGeocodeMock(lat, lng);
        setUserCoords({
          latitude: lat,
          longitude: lng,
          accuracy: pos.coords.accuracy,
          areaName: geoInfo.areaName,
          cityName: geoInfo.cityName
        });
        setIsDetectingLocation(false);
        setLocationPermissionPrompt(false);
        showNotice(`Location detected: ${geoInfo.areaName}, ${geoInfo.cityName}`);
      },
      (err) => {
        console.warn('Geolocation error or denied, using demo fallback', err);
        handleUseDemoLocation('Location access denied or unavailable. Loaded demo location (Navi Mumbai).');
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // Explicit demo fallback
  const handleUseDemoLocation = (reasonMsg?: string) => {
    setUserCoords(DEFAULT_DEMO_COORDINATES);
    setIsDetectingLocation(false);
    setLocationPermissionPrompt(false);
    if (reasonMsg) {
      setLocationError(reasonMsg);
    }
  };

  // Compute branches with distances
  const branchesWithDistance = useMemo(() => {
    return DEMO_BRANCHES_GEO.map(b => {
      let distanceKm = 1.2; // default reasonable distance
      if (userCoords) {
        distanceKm = calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          b.latitude,
          b.longitude
        );
      }
      return {
        ...b,
        distanceKm
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userCoords]);

  // Set nearest branch automatically when location changes
  useEffect(() => {
    if (branchesWithDistance.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branchesWithDistance[0].id);
    }
  }, [branchesWithDistance, selectedBranchId]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branchesWithDistance.filter(b => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.area.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Distance filter
      if (b.distanceKm > maxDistanceKm) return false;

      // Available now filter
      if (onlyAvailableNow && !b.isOpenNow) return false;

      // Size filter
      if (selectedSizeFilter !== 'All') {
        const count = b.availableCounts[selectedSizeFilter as LockerSize] || 0;
        if (count === 0) return false;
      }

      return true;
    });
  }, [branchesWithDistance, searchQuery, maxDistanceKm, onlyAvailableNow, selectedSizeFilter]);

  // Selected branch object
  const currentBranch = branchesWithDistance.find(b => b.id === selectedBranchId) || branchesWithDistance[0];

  // Pricing calculations for Rent Calculator
  const pricingInfo = rentPricingMatrix[calcSize] || rentPricingMatrix['Medium'];
  const baseRent = pricingInfo.annualRent * calcTenureYears;
  const gstAmount = Math.round(baseRent * 0.18);
  const stampDutyFee = 500;
  const securityDeposit = includeFdSecurity ? pricingInfo.deposit : 0;
  const totalFinancialCommitment = baseRent + gstAmount + stampDutyFee + securityDeposit;

  // Submit Application Form L-101
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branchObj = branchesWithDistance.find(b => b.id === formBranchId);
    const appNum = applyForLocker({
      customerName: formCustomerName,
      cifNumber: formCif,
      phone: formPhone,
      email: formEmail,
      branchId: formBranchId,
      branchName: branchObj ? branchObj.name : 'Vashi Sector 17 Flagship Vault',
      sizeRequested: formSize,
      operatingMode: formOperatingMode,
      annualIncomeBracket: formIncome,
      panNumber: formPan,
      nomineeName: formNominee,
      linkedAccountNumber: formAccount,
    });
    showNotice(`Application ${appNum} submitted under statutory banking review!`);
    setActiveTab('my-applications');
    setFormStep(1);
  };

  return (
    <div className="space-y-4 pb-28 text-[#1F1420] dark:text-[#FBF4F8]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6B0E37] via-[#97144D] to-[#6B0E37] text-white p-4 rounded-3xl shadow-md border border-[#6B0E37]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#C9A24B]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFDF85] font-extrabold">
              LOCATION-BASED VAULT DISCOVERY
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/20">
            28 Vaults
          </span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          Find a Safe Deposit Locker
        </h1>
        <p className="text-xs text-white/80 mt-0.5">
          GPS-assisted branch availability, transparent tariff estimator & Form L-101 online application.
        </p>
      </div>

      {noticeMsg && (
        <div className="p-3 bg-[#1E8E5A]/15 border border-[#1E8E5A]/30 rounded-2xl text-[#1E8E5A] text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{noticeMsg}</span>
          </div>
          <button onClick={() => setNoticeMsg(null)} className="p-1 font-bold">✕</button>
        </div>
      )}

      {/* Sub-tab bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('search')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'search'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30]'
          }`}
        >
          Nearby Branches
        </button>
        <button
          onClick={() => setIsCalcOpen(true)}
          className="h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-white dark:bg-[#20101D] text-[#97144D] dark:text-[#E895B8] border border-[#97144D]/30 flex items-center gap-1"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Rent Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'apply'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30]'
          }`}
        >
          Apply (Form L-101)
        </button>
        <button
          onClick={() => setActiveTab('my-applications')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'my-applications'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30]'
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('waiting-list')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'waiting-list'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30]'
          }`}
        >
          Waitlist
        </button>
      </div>

      {/* TAB 1: LOCATION SEARCH & BRANCH LIST */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          
          {/* 1. LOCATION PERMISSION / DETECTION CARD */}
          {locationPermissionPrompt && (
            <div className="bg-white dark:bg-[#20101D] border-2 border-[#97144D]/25 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#97144D]/10 text-[#97144D] dark:text-[#E895B8] flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                    Allow Location to Find SafeVault Branches Near You
                  </h3>
                  <p className="text-xs text-[#6B5B68] dark:text-[#A898A4] leading-relaxed">
                    Instantly calculate driving distance to high-security strongrooms with live vacant compartment counts.
                  </p>
                </div>
              </div>

              {isDetectingLocation ? (
                <div className="py-4 flex flex-col items-center justify-center space-y-2">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#97144D] animate-radar opacity-70" />
                    <div className="w-4 h-4 rounded-full bg-[#97144D] text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#97144D] dark:text-[#E895B8] animate-pulse">
                    Detecting your location via GPS satellite network…
                  </span>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRequestLocation}
                      className="h-11 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Allow Location</span>
                    </button>
                    <button
                      onClick={() => setLocationPermissionPrompt(false)}
                      className="h-11 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] text-[#1F1420] dark:text-white font-bold text-xs flex items-center justify-center transition-colors"
                    >
                      Search Manually
                    </button>
                  </div>

                  <button
                    onClick={() => handleUseDemoLocation()}
                    className="w-full h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Use Demo Location (Navi Mumbai)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Location Indicator Banner */}
          {userCoords && (
            <div className="bg-[#FAF6F8] dark:bg-[#20101D] p-3 rounded-2xl border border-[#E8DFE5] dark:border-[#381B30] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Location:</span>
                <strong className="text-[#1F1420] dark:text-white font-bold">
                  {userCoords.areaName}, {userCoords.cityName}
                </strong>
              </div>
              <button
                onClick={() => setLocationPermissionPrompt(true)}
                className="text-[11px] font-bold text-[#97144D] dark:text-[#E895B8] underline"
              >
                Change
              </button>
            </div>
          )}

          {locationError && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span>{locationError}</span>
              <button onClick={() => setLocationError(null)} className="font-bold text-xs p-1">✕</button>
            </div>
          )}

          {/* 2. STYLIZED RADAR / MAP CARD (NO EXTERNAL API KEY REQUIRED) */}
          <div className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-[#1F1420] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#97144D] dark:text-[#E895B8]" />
                <span>Radar View · Branch Map</span>
              </h3>
              <span className="text-xs text-[#1E8E5A] font-bold font-mono">
                {filteredBranches.length} Strongrooms
              </span>
            </div>

            {/* Stylized Map View Canvas / SVG with pins */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1F1420] via-[#33152B] to-[#140812] border border-[#381B30] p-4 flex flex-col justify-between select-none">
              {/* Radar circular grid overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-72 h-72 border border-white rounded-full" />
                <div className="absolute w-48 h-48 border border-white rounded-full" />
                <div className="absolute w-24 h-24 border border-white rounded-full" />
                <div className="absolute w-full h-[1px] bg-white" />
                <div className="absolute h-full w-[1px] bg-white" />
              </div>

              {/* User Location Pulse Beacon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24B] animate-radar opacity-70" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#C9A24B] ring-2 ring-white shadow-lg" />
                </div>
                <span className="mt-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-[#FFDF85] font-bold backdrop-blur-xs whitespace-nowrap">
                  You are here
                </span>
              </div>

              {/* Branch Pins around the radar */}
              {branchesWithDistance.slice(0, 4).map((b, idx) => {
                const positions = [
                  { left: '25%', top: '25%' },
                  { left: '72%', top: '30%' },
                  { left: '30%', top: '75%' },
                  { left: '75%', top: '72%' }
                ];
                const pos = positions[idx] || { left: '50%', top: '80%' };
                const isSelected = b.id === selectedBranchId;

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      isSelected ? 'scale-110 z-30' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`p-1.5 rounded-xl text-white shadow-lg flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#97144D] ring-2 ring-[#FFDF85]'
                          : 'bg-white/20 border border-white/30 backdrop-blur-xs'
                      }`}>
                        <Building className="w-3 h-3 text-[#FFDF85]" />
                        <span className="text-[10px] font-bold font-mono">
                          {b.distanceKm}km
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="relative z-10 flex items-center justify-between text-white/70 text-[10px]">
                <span className="font-mono">GPS LOCK: ACTIVE</span>
                <span className="font-mono">SECTOR: {userCoords?.cityName || 'NAVI MUMBAI'}</span>
              </div>

              <div className="relative z-10 text-[11px] text-white font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xl self-start">
                Tap any branch pin to view locker slots
              </div>
            </div>
          </div>

          {/* 3. SEARCH & FILTER CONTROLS */}
          <div className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl p-4 shadow-sm space-y-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5B68] dark:text-[#A898A4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search branch, locality, city, or PIN code…"
                className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl pl-10 pr-4 text-xs font-semibold text-[#1F1420] dark:text-white focus:bg-white dark:focus:bg-[#20101D] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B5B68] p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4]">
                  Locker Size
                </span>
                <span className="text-[11px] text-[#97144D] dark:text-[#E895B8] font-semibold">
                  {selectedSizeFilter}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['All', 'Small', 'Medium', 'Large', 'Extra Large'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSizeFilter(sz)}
                    className={`h-9 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                      selectedSizeFilter === sz
                        ? 'bg-[#97144D] text-white shadow-xs'
                        : 'bg-[#FAF6F8] dark:bg-[#2A1527] text-[#1F1420] dark:text-white border border-[#E8DFE5] dark:border-[#381B30]'
                    }`}
                  >
                    {sz === 'Extra Large' ? 'XL' : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance slider & Available now toggle */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#E8DFE5] dark:border-[#381B30]">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  <span>Radius:</span>
                  <span className="text-[#97144D] dark:text-[#E895B8] font-mono">{maxDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={maxDistanceKm}
                  onChange={e => setMaxDistanceKm(parseInt(e.target.value, 10))}
                  className="w-full accent-[#97144D] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer self-end pb-1">
                <input
                  type="checkbox"
                  checked={onlyAvailableNow}
                  onChange={e => setOnlyAvailableNow(e.target.checked)}
                  className="w-4 h-4 accent-[#97144D] rounded"
                />
                <span className="text-xs font-bold text-[#1F1420] dark:text-white">Open Vaults Only</span>
              </label>
            </div>
          </div>

          {/* 4. SORTED NEARBY BRANCHES LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                Branches Sorted by Distance ({filteredBranches.length})
              </h3>
              <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] font-mono">
                Auto-Selected: Nearest
              </span>
            </div>

            {filteredBranches.length === 0 ? (
              <div className="p-8 bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl text-center space-y-2">
                <Building className="w-8 h-8 text-[#6B5B68] mx-auto opacity-50" />
                <p className="text-xs text-[#6B5B68] dark:text-[#A898A4]">
                  No SafeVault branches found matching the filters within {maxDistanceKm} km.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMaxDistanceKm(60);
                    setSelectedSizeFilter('All');
                    setOnlyAvailableNow(false);
                  }}
                  className="px-4 py-2 bg-[#97144D] text-white rounded-xl text-xs font-bold"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBranches.map(b => {
                  const isSelected = b.id === selectedBranchId;
                  const totalVacant = Object.values(b.availableCounts).reduce((acc, c) => acc + c, 0);

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-white dark:bg-[#20101D] border-[#97144D] ring-2 ring-[#97144D]/25 shadow-md'
                          : 'bg-white dark:bg-[#20101D] border-[#E8DFE5] dark:border-[#381B30] hover:border-[#97144D]/50 shadow-xs'
                      }`}
                    >
                      {/* Top row: Branch Name, Distance, Open/Closed Badge */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                              {b.name}
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#97144D] text-white">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B5B68] dark:text-[#A898A4] line-clamp-1">
                            {b.address}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-black text-sm text-[#97144D] dark:text-[#E895B8] block">
                            {b.distanceKm} km
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${b.isOpenNow ? 'text-[#1E8E5A]' : 'text-[#6B5B68]'}`}>
                            {b.isOpenNow ? '● Open Now' : '○ Closed Today'}
                          </span>
                        </div>
                      </div>

                      {/* Locker Availability Chips with counts and pricing per year */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] block">
                          Compartment Availability & Tariff:
                        </span>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {(['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(sz => {
                            const count = b.availableCounts[sz];
                            const price = b.pricingPerYear[sz];
                            const isAvailable = count > 0;

                            return (
                              <div
                                key={sz}
                                className={`p-2 rounded-xl border text-left transition-all ${
                                  isAvailable
                                    ? 'bg-[#FAF6F8] dark:bg-[#2A1527] border-[#E8DFE5] dark:border-[#381B30]'
                                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[11px] text-[#1F1420] dark:text-white">
                                    {sz === 'Extra Large' ? 'XL' : sz}
                                  </span>
                                  <span className={`text-[11px] font-mono font-black ${
                                    isAvailable ? 'text-[#1E8E5A]' : 'text-slate-400'
                                  }`}>
                                    {isAvailable ? `${count} left` : 'Full'}
                                  </span>
                                </div>
                                <span className="font-mono text-[11px] text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">
                                  ₹{price.toLocaleString('en-IN')}/yr
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-1 flex items-center justify-between gap-2 text-xs">
                        {totalVacant > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormBranchId(b.id);
                              setActiveTab('apply');
                            }}
                            className="w-full h-11 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <Key className="w-3.5 h-3.5 text-[#C9A24B]" />
                            <span>Apply for Compartment at {b.name.split(' ')[0]}</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const code = joinWaitingList(b.id, 'Medium');
                              showNotice(`Added to waiting list (${code}) for ${b.name}. Queue position #${b.waitingListQueue || 12}.`);
                              setActiveTab('waiting-list');
                            }}
                            className="w-full h-11 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Zero Vacancies · Join Waitlist (Queue #{b.waitingListQueue || 12})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENT CALCULATOR BOTTOM SHEET */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-md max-h-[88vh] overflow-y-auto space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[#381B30] text-xs">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#97144D] dark:text-[#E895B8]" />
                <h3 className="font-extrabold text-base text-[#1F1420] dark:text-white">
                  SafeVault Tariff Estimator
                </h3>
              </div>
              <button
                onClick={() => setIsCalcOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[#6B5B68]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4]">
                1. Select Size Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(sz => (
                  <button
                    key={sz}
                    onClick={() => setCalcSize(sz)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      calcSize === sz
                        ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-xs'
                        : 'bg-[#FAF6F8] dark:bg-[#2A1527] text-[#1F1420] dark:text-white border-[#E8DFE5] dark:border-[#381B30]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{sz}</span>
                    <span className="font-mono text-[11px] opacity-80 mt-0.5 block">
                      ₹{rentPricingMatrix[sz].annualRent.toLocaleString('en-IN')}/yr
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#6B5B68] dark:text-[#A898A4]">2. Lease Tenure</span>
                <span className="font-mono font-bold text-sm text-[#97144D] dark:text-[#E895B8]">
                  {calcTenureYears} Year(s)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                value={calcTenureYears}
                onChange={e => setCalcTenureYears(parseInt(e.target.value, 10))}
                className="w-full accent-[#97144D] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                <span>1 Year</span>
                <span>2 Years</span>
                <span>3 Years (Max Advance)</span>
              </div>
            </div>

            {/* Security Deposit Toggle */}
            <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
              <input
                type="checkbox"
                checked={includeFdSecurity}
                onChange={e => setIncludeFdSecurity(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#97144D] rounded"
              />
              <div className="text-xs text-[#6B5B68] dark:text-[#A898A4]">
                <strong className="text-[#1F1420] dark:text-white block font-bold">
                  Include Security Deposit (Fixed Deposit Lien)
                </strong>
                Mandatory 3 years rent guarantee as per RBI circular. Earns 7.10% p.a. interest and is fully refundable upon locker surrender.
              </div>
            </label>

            {/* Financial Commitment Calculation Breakdown */}
            <div className="p-3.5 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-2xl border border-[#E8DFE5] dark:border-[#381B30] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Base Annual Rent ({calcTenureYears} yr):</span>
                <span className="font-mono font-bold text-[#1F1420] dark:text-white">
                  ₹{baseRent.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Statutory GST @ 18%:</span>
                <span className="font-mono font-semibold text-[#1F1420] dark:text-white">
                  ₹{gstAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">e-Stamp Duty & Legal Deed:</span>
                <span className="font-mono font-semibold text-[#1F1420] dark:text-white">
                  ₹{stampDutyFee}
                </span>
              </div>
              {includeFdSecurity && (
                <div className="flex justify-between">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Security Deposit FD Lien:</span>
                  <span className="font-mono font-bold text-[#1E8E5A]">
                    ₹{securityDeposit.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#E8DFE5] dark:border-[#381B30] flex justify-between font-black text-sm text-[#1F1420] dark:text-white">
                <span>Total Outflow</span>
                <span className="font-mono text-base text-[#97144D] dark:text-[#E895B8]">
                  ₹{totalFinancialCommitment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setFormSize(calcSize);
                setIsCalcOpen(false);
                setActiveTab('apply');
              }}
              className="w-full h-12 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <span>Apply for {calcSize} Compartment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-STEP FORM L-101 APPLICATION */}
      {activeTab === 'apply' && (
        <form onSubmit={handleApplySubmit} className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-5 shadow-sm space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#97144D] dark:text-[#E895B8] font-bold">
                FORM L-101 · STATUTORY ALLOTMENT
              </span>
              <span className="text-xs font-bold text-[#6B5B68] dark:text-[#A898A4]">
                Step {formStep} of 3
              </span>
            </div>
            <h2 className="text-base font-black text-[#1F1420] dark:text-white">
              Application for Safe Deposit Locker
            </h2>

            {/* Stepper Progress Bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#97144D] transition-all duration-300"
                style={{ width: `${(formStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Branch & Locker Preference */}
          {formStep === 1 && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Target Branch Vault
                </label>
                <select
                  value={formBranchId}
                  onChange={e => setFormBranchId(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
                >
                  {branchesWithDistance.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.distanceKm} km away)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Requested Locker Size
                </label>
                <select
                  value={formSize}
                  onChange={e => setFormSize(e.target.value as LockerSize)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
                >
                  <option value="Small">Small (₹2,500/yr)</option>
                  <option value="Medium">Medium (₹4,500/yr)</option>
                  <option value="Large">Large (₹7,800/yr)</option>
                  <option value="Extra Large">Extra Large (₹12,500/yr)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Operating Mandate
                </label>
                <select
                  value={formOperatingMode}
                  onChange={e => setFormOperatingMode(e.target.value as OperatingMode)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
                >
                  <option value="Single">Single (Self Only)</option>
                  <option value="Either or Survivor">Either or Survivor (Joint)</option>
                  <option value="Jointly">Jointly (Both Signatures)</option>
                  <option value="Former or Survivor">Former or Survivor</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setFormStep(2)}
                className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Continue to Applicant Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Applicant KYC & Account Linking */}
          {formStep === 2 && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Primary Hirer Name
                </label>
                <input
                  type="text"
                  value={formCustomerName}
                  disabled
                  className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                    CIF Number
                  </label>
                  <input
                    type="text"
                    value={formCif}
                    disabled
                    className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-mono font-bold text-[#6B5B68] dark:text-[#A898A4] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                    PAN Card
                  </label>
                  <input
                    type="text"
                    value={formPan}
                    disabled
                    className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-mono font-bold text-[#6B5B68] dark:text-[#A898A4] cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Annual Income Bracket
                </label>
                <select
                  value={formIncome}
                  onChange={e => setFormIncome(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
                >
                  <option value="₹10 Lakhs - ₹15 Lakhs">₹10 Lakhs - ₹15 Lakhs</option>
                  <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                  <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                  <option value="₹50 Lakhs+">₹50 Lakhs+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Auto-Debit Linked Account
                </label>
                <input
                  type="text"
                  value={formAccount}
                  disabled
                  className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-mono font-bold text-[#6B5B68] dark:text-[#A898A4] cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="h-11 rounded-xl border border-[#E8DFE5] dark:border-[#381B30] font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setFormStep(3)}
                  className="h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Nominee</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Nominee Declaration & E-Consent */}
          {formStep === 3 && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Nominee Declaration (Form DA-1)
                </label>
                <input
                  type="text"
                  value={formNominee}
                  onChange={e => setFormNominee(e.target.value)}
                  placeholder="Full name & relationship of nominee"
                  required
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
                />
              </div>

              {/* Upload Identification / Proof mock */}
              <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-xl border border-dashed border-[#97144D]/40 space-y-2 text-center">
                <FileText className="w-6 h-6 text-[#97144D] dark:text-[#E895B8] mx-auto" />
                <span className="font-bold text-xs text-[#1F1420] dark:text-white block">
                  Identity Document Verified via Digilocker
                </span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">
                  Aadhaar e-KYC & PAN cross-checked successfully (Ref: KYC/DL/2026/099182)
                </span>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-4 h-4 mt-0.5 accent-[#97144D] rounded"
                />
                <span className="text-xs text-[#6B5B68] dark:text-[#A898A4]">
                  I agree to SafeVault Model Locker Deed covenants, statutory annual rental recovery, and bank vault operating protocols under RBI guidelines.
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="h-11 rounded-xl border border-[#E8DFE5] dark:border-[#381B30] font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="h-12 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C9A24B]" />
                  <span>Submit Application</span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 3: APPLICATION STATUS TIMELINE */}
      {activeTab === 'my-applications' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
              Application Status Timeline ({applications.length})
            </h3>
            <button
              onClick={() => {
                setFormStep(1);
                setActiveTab('apply');
              }}
              className="text-xs font-bold text-[#97144D] dark:text-[#E895B8] underline"
            >
              + New Application
            </button>
          </div>

          <div className="space-y-2.5">
            {applications.map(app => (
              <div
                key={app.id}
                className="p-4 bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl shadow-sm text-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#97144D] dark:text-[#E895B8]">
                      {app.applicationNumber}
                    </span>
                    <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">
                      {app.branchName} · {app.sizeRequested} Locker
                    </span>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                {/* Progress Stepper: Submitted > Review > Approved/Rejected */}
                <div className="py-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1.5">
                    <span className="text-[#1E8E5A]">1. Submitted</span>
                    <span className={app.status !== 'Submitted' ? 'text-[#1E8E5A]' : ''}>2. Review</span>
                    <span className={app.status.includes('Approved') ? 'text-[#1E8E5A]' : ''}>3. Allotted</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="w-1/3 bg-[#1E8E5A]" />
                    <div className={`w-1/3 ${app.status !== 'Submitted' ? 'bg-[#1E8E5A]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    <div className={`w-1/3 ${app.status.includes('Approved') ? 'bg-[#1E8E5A]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-[11px]">Applied Date</span>
                    <span className="font-mono font-bold text-[#1F1420] dark:text-white">{app.appliedDate}</span>
                  </div>
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-[11px]">Assigned Unit</span>
                    <span className="font-mono font-bold text-[#1E8E5A]">
                      {app.allottedLockerNumber ? `Locker ${app.allottedLockerNumber}` : 'Under Review'}
                    </span>
                  </div>
                </div>

                {app.status.includes('Approved') && (
                  <button
                    onClick={() => {
                      if (app.allottedLockerId) setSelectedLockerId(app.allottedLockerId);
                      setCustomerView('visit');
                    }}
                    className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-4 h-4 text-[#C9A24B]" />
                    <span>Schedule Physical Key Handover Visit</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WAITING LIST */}
      {activeTab === 'waiting-list' && (
        <div className="space-y-3">
          <LockerWaitlist />
        </div>
      )}

    </div>
  );
};
