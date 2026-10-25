import React from 'react';
import { X, QrCode, Shield, MapPin, Calendar, Clock, Key, AlertTriangle, Printer } from 'lucide-react';
import { Appointment } from '../../types';

interface QrTokenModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const QrTokenModal: React.FC<QrTokenModalProps> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Digital Vault Check-In Token</h3>
              <p className="text-[11px] text-slate-300 font-mono">Token #{appointment.tokenNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* QR Display */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="bg-white p-3 border-2 border-slate-800 rounded-lg shadow-2xs">
              {/* Simulated high-contrast QR pattern */}
              <div className="w-40 h-40 bg-slate-950 p-2 rounded flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-white bg-slate-950 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white" />
                  </div>
                  <div className="w-10 h-10 border-4 border-white bg-slate-950 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white" />
                  </div>
                </div>
                <div className="flex items-center justify-center text-white/40 text-[9px] font-mono tracking-widest uppercase">
                  National Bank Vault Pass
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 border-4 border-white bg-slate-950 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white" />
                  </div>
                  <div className="w-12 h-6 border-2 border-white/80 bg-white/10 rounded flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded border border-slate-300">
                {appointment.qrCodeToken}
              </span>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Scan at the branch vault biometric turnstile
              </p>
            </div>
          </div>

          {/* Appointment Particulars */}
          <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-100">
            <div className="flex items-center justify-between pb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                Locker Details
              </span>
              <span className="font-semibold text-slate-900">
                Locker {appointment.lockerNumber} ({appointment.purpose})
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Scheduled Date
              </span>
              <span className="font-medium text-slate-900">{appointment.date}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time Window
              </span>
              <span className="font-semibold text-slate-900 font-mono">{appointment.timeSlot}</span>
            </div>

            <div className="flex items-start justify-between py-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                Branch Location
              </span>
              <span className="font-medium text-slate-900 text-right max-w-[200px]">
                {appointment.branchName}
              </span>
            </div>
          </div>

          {/* Security Protocols Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Security Instructions for Strongroom Entry:</p>
              <ul className="list-disc pl-3 text-amber-800 space-y-0.5">
                <li>Carry your original Locker Key ({appointment.lockerNumber}). No duplicate is held by the bank.</li>
                <li>Valid government photo ID (Aadhaar / Passport / Driving License) is mandatory.</li>
                <li>Only authorized registered operators permitted inside vault cubicles.</li>
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Security Pass</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
