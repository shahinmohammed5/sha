import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentRole } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'find_parking', label: 'Parking', icon: MapPin },
    { id: 'my_reservations', label: 'Passes', icon: CalendarDays },
    {
      id: currentRole === 'police' ? 'police_dashboard' : 'report_issue',
      label: currentRole === 'police' ? 'Police' : 'Report',
      icon: currentRole === 'police' ? ShieldCheck : AlertTriangle,
      highlight: true,
    },
    {
      id: currentRole === 'police' ? 'echallans' : 'my_reports',
      label: currentRole === 'police' ? 'Challans' : 'My Reports',
      icon: currentRole === 'police' ? Receipt : CalendarDays,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg flex items-center justify-around px-2 py-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-[#1769E8] font-bold'
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive ? 'scale-110 text-[#1769E8]' : item.highlight ? 'text-amber-500' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
