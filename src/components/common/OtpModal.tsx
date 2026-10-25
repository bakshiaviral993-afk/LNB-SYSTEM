import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, AlertCircle } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  actionDescription: string;
  mobileEnding?: string;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  actionDescription,
  mobileEnding = '23456',
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setTimer(45);
      // Pre-fill demo OTP hint
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    setError('');

    // Auto advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
      onClose();
    }, 600);
  };

  const fillDemoOtp = () => {
    setOtp(['8', '8', '2', '1', '9', '0']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E3E8F0] flex items-center justify-between bg-[#F5F7FA]">
          <div className="flex items-center gap-2.5 text-[#17263C] font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-[#2457A7]/10 flex items-center justify-center text-[#2457A7] border border-[#2457A7]/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span>{title}</span>
              <p className="text-[11px] text-[#66758C] font-normal">Multi-Factor Step-Up Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#66758C] hover:text-[#17263C] transition-colors p-1.5 rounded-lg hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-[#2457A7]/5 border border-[#2457A7]/15 rounded-xl text-xs text-[#17263C]">
            <p className="font-semibold text-[#102544] mb-1">Bank Regulatory Step-Up Authorization</p>
            <p className="text-[#66758C] leading-relaxed">
              {actionDescription}. A 6-digit one-time password has been transmitted to registered mobile number ending in <span className="font-semibold text-[#17263C] font-mono">******{mobileEnding}</span>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17263C] mb-2">
              Enter 6-digit Bank Security Code
            </label>
            <div className="flex items-center justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-11 h-12 text-center text-lg font-bold font-mono text-[#17263C] bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              ))}
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-[#C83E44] mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#66758C] pt-1">
            <span>
              Resend code in:{' '}
              <span className="font-mono text-[#17263C] font-medium">
                {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : 'Expired'}
              </span>
            </span>
            <button
              type="button"
              onClick={fillDemoOtp}
              className="text-[#2457A7] hover:underline font-semibold"
            >
              Fill Demo OTP (882190)
            </button>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E3E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-slate-100 rounded-lg transition-colors border border-[#E3E8F0]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors shadow-bank-card disabled:opacity-50"
            >
              {isVerifying ? 'Authenticating...' : 'Confirm Authorization'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
