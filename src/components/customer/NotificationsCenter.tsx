import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCircle2,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Clock,
  Filter,
  Check
} from 'lucide-react';

export const NotificationsCenter: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCustomerView } = useBanking();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Billing',
    'Security',
    'Appointment',
    'Agreement',
    'Service Request'
  ];

  const filteredNotifs = notifications.filter(n => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryIcon = (cat: NotificationItem['category']) => {
    switch (cat) {
      case 'Billing':
        return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case 'Security':
        return <Shield className="w-4 h-4 text-rose-700" />;
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-indigo-700" />;
      case 'Agreement':
        return <FileText className="w-4 h-4 text-amber-700" />;
      default:
        return <Bell className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Operational Alerts & Notifications
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Live Feed
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Automated alerts for vault entries, rental renewal cycles, e-agreement actions, appointment reminders, and security incidents
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-1.5 bg-white border border-[#E3E8F0] text-[#17263C] text-xs font-semibold rounded-lg hover:bg-[#F5F7FA] flex items-center gap-1.5 shadow-xs transition-colors self-start"
        >
          <Check className="w-3.5 h-3.5 text-[#16845B]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card">
        <span className="text-[#66758C] text-[11px] font-bold uppercase tracking-wider px-2">Category:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#102544] text-white shadow-xs'
                : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card divide-y divide-[#E3E8F0]">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-[#66758C] space-y-2">
            <Bell className="w-8 h-8 text-[#66758C]/40 mx-auto" />
            <p className="text-xs font-medium">No alerts recorded in this category.</p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 transition-colors cursor-pointer flex items-start gap-4 hover:bg-[#F5F7FA]/70 ${
                !n.read ? 'bg-[#2457A7]/5' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] shrink-0 mt-0.5">
                {getCategoryIcon(n.category)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${!n.read ? 'font-bold text-[#17263C]' : 'font-semibold text-[#17263C]'}`}>
                    {n.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#66758C] tabular-nums">{n.timestamp}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#C83E44]" title="Unread" />
                    )}
                  </div>
                </div>

                <p className="text-[#66758C] leading-relaxed text-xs">{n.message}</p>

                <div className="flex items-center gap-3 pt-1 text-[10px] text-[#66758C] font-mono">
                  <span className="font-semibold text-[#17263C]">Category: {n.category}</span>
                  <span>·</span>
                  <span>Dispatched via SMS & Mobile Banking</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
