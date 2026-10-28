import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { QrTokenModal } from '../common/QrTokenModal';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Key,
  Shield,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  XCircle,
  RefreshCw
} from 'lucide-react';

export const BookVisit: React.FC = () => {
  const {
    lockers,
    appointments,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    selectedLockerId,
    setSelectedLockerId
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  // Booking Form State
  const [targetLockerId, setTargetLockerId] = useState<string>(selectedLockerId || customerLockers[0]?.id || 'lck-125');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-25');
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM - 11:30 AM');
  const [purpose, setPurpose] = useState<Appointment['purpose']>('Routine Vault Access');
  const [accompanyingCount, setAccompanyingCount] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Selected appointment for QR Token Modal
  const [activeQrApt, setActiveQrApt] = useState<Appointment | null>(null);

  // Reschedule state
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('2026-10-26');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('02:00 PM - 02:30 PM');

  const selectedLockerObj = lockers.find(l => l.id === targetLockerId) || customerLockers[0];

  const availableSlots = [
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:30 PM - 04:00 PM',
  ];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLockerObj) return;

    const token = bookAppointment({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId: selectedLockerObj.id,
      lockerNumber: selectedLockerObj.lockerNumber,
      branchId: selectedLockerObj.branchId,
      branchName: selectedLockerObj.branchName,
      date: selectedDate,
      timeSlot: selectedSlot,
      purpose,
      accompanyingPersons: accompanyingCount,
      specialInstructions: specialInstructions || undefined,
    });

    // Auto open QR pass
    const created = appointments.find(a => a.tokenNumber === token);
    if (created) {
      setActiveQrApt(created);
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleAptId) {
      rescheduleAppointment(rescheduleAptId, rescheduleDate, rescheduleSlot);
      setRescheduleAptId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="pb-4 border-b border-[#E3E8F0]">
        <h1 className="text-xl font-extrabold tracking-tight text-[#102544]">
          Book Safe Vault Visit Appointment
        </h1>
        <p className="text-xs text-[#66758C] mt-0.5">
          Schedule access to branch strongroom, generate digital check-in token, and verify custodian security escort
        </p>
      </div>

      {/* Main Grid: Form Left, Active Appointments Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Booking Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-5 text-xs">
          <div className="border-b border-[#E3E8F0] pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#102544] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2457A7]" />
              <span>Schedule Strongroom Visit</span>
            </h2>
            <span className="text-[11px] text-[#66758C]">Max 1 visitor slot per locker per day</span>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-4">
            
            {/* Locker Selection */}
            <div>
              <label className="block font-medium text-[#17263C] mb-1.5">
                Select Safe Deposit Locker
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customerLockers.map(lkr => (
                  <div
                    key={lkr.id}
                    onClick={() => {
                      setTargetLockerId(lkr.id);
                      setSelectedLockerId(lkr.id);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      targetLockerId === lkr.id
                        ? 'border-[#102544] bg-[#102544] text-white shadow-xs'
                        : 'border-[#E3E8F0] bg-[#F5F7FA] text-[#17263C] hover:bg-[#E3E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-sm">Locker {lkr.lockerNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${targetLockerId === lkr.id ? 'bg-white/20 text-white' : 'bg-white text-[#66758C] border border-[#E3E8F0]'}`}>
                        {lkr.size}
                      </span>
                    </div>
                    <div className={`text-[11px] mt-1 ${targetLockerId === lkr.id ? 'text-white/80' : 'text-[#66758C]'}`}>
                      {lkr.branchName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Purpose Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-10-23"
                  max="2026-11-20"
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-mono text-[#17263C] font-medium focus:outline-none focus:border-[#2457A7] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">
                  Purpose of Visit
                </label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value as Appointment['purpose'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] focus:outline-none focus:border-[#2457A7] focus:bg-white"
                >
                  <option value="Routine Vault Access">Routine Vault Access (Safe Custody)</option>
                  <option value="Operate with Joint Holder">Operate with Joint Holder</option>
                  <option value="Nominee Verification">Nominee Verification</option>
                  <option value="Locker Surrender">Locker Surrender / Closure</option>
                  <option value="Inventory Inspection">Inventory Inspection</option>
                </select>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block font-medium text-[#17263C] mb-1.5">
                Select 30-Minute Strongroom Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2.5 rounded-lg border text-center font-mono font-medium transition-colors text-[11px] ${
                      selectedSlot === slot
                        ? 'bg-[#102544] text-white border-[#102544] shadow-xs font-bold'
                        : 'bg-[#F5F7FA] text-[#17263C] border-[#E3E8F0] hover:bg-[#E3E8F0]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Accompanying Persons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">
                  Accompanying Persons (Max 1)
                </label>
                <select
                  value={accompanyingCount}
                  onChange={e => setAccompanyingCount(parseInt(e.target.value))}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-[#17263C] font-medium focus:outline-none focus:border-[#2457A7] focus:bg-white"
                >
                  <option value={0}>0 (Operating Alone)</option>
                  <option value={1}>1 (Joint Holder / Authorized Rep)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">
                  Special Notes / Accessibility Assistance
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheelchair assistance required"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-[#17263C] focus:outline-none focus:border-[#2457A7] focus:bg-white"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 bg-[#2457A7]/10 border border-[#2457A7]/20 rounded-xl text-[11px] text-[#102544] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-[#2457A7] shrink-0 mt-0.5" />
              <div>
                <strong>Branch Strongroom Entry Requirements:</strong>
                <p className="text-[#66758C] mt-0.5">
                  Carry your physical Locker Key. Present the Digital QR Token and original Government Photo ID (Aadhaar / Voter ID / Passport) at the branch vault entry gate.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#008C88]" />
                <span>Confirm Appointment & Generate QR Token</span>
              </button>
            </div>

          </form>
        </div>

        {/* Existing Appointments & History (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-bank-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#102544]">
                Scheduled Appointments ({appointments.length})
              </h3>
              <span className="text-[#66758C] font-mono text-[11px]">Real-time CBS sync</span>
            </div>

            <div className="space-y-3">
              {appointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-[#E3E8F0] bg-white hover:border-[#2457A7] transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#102544] text-xs">
                        {apt.tokenNumber}
                      </span>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => setActiveQrApt(apt)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/25 rounded hover:bg-[#2457A7]/20 flex items-center gap-1 transition-colors"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>View Pass</span>
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-[#66758C] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#66758C]">Locker:</span>
                      <span className="font-semibold text-[#17263C]">Locker {apt.lockerNumber} ({apt.purpose})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#66758C]">Date & Slot:</span>
                      <span className="font-mono font-medium text-[#102544]">{apt.date} · {apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#66758C]">Branch:</span>
                      <span className="text-[#17263C] truncate max-w-[180px]">{apt.branchName}</span>
                    </div>
                  </div>

                  {/* Actions for Confirmed appointments */}
                  {apt.status === 'Confirmed' && (
                    <div className="pt-2 border-t border-[#E3E8F0] flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setRescheduleAptId(apt.id)}
                        className="text-[#66758C] hover:text-[#17263C] font-medium flex items-center gap-1 hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reschedule</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Cancel appointment ${apt.tokenNumber}?`)) {
                            cancelAppointment(apt.id);
                          }
                        }}
                        className="text-[#C83E44] hover:text-[#C83E44]/80 font-medium flex items-center gap-1 hover:underline"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {apt.status === 'Completed' && (
                    <div className="pt-1 text-[10px] text-[#16845B] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#16845B]" />
                      <span>Completed at {apt.completedTime} · Logged in Access History</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Reschedule Modal */}
      {rescheduleAptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-md w-full p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-[#102544]">
              Reschedule Visit Appointment
            </h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min="2026-10-23"
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-mono tabular-nums text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[#17263C] mb-1">New Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={e => setRescheduleSlot(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  {availableSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleAptId(null)}
                  className="px-3 py-1.5 text-[#66758C] hover:bg-[#F5F7FA] rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] transition-colors shadow-xs"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Token Modal */}
      <QrTokenModal
        appointment={activeQrApt}
        onClose={() => setActiveQrApt(null)}
      />

    </div>
  );
};
