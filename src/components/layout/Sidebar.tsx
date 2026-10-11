import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Receipt,
  User,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
}) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    currentUser,
    logoutUser,
    setCurrentRole,
    incidentReports,
    reservations,
  } = useApp();

  // Badge counters
  const pendingIncidentsCount = incidentReports.filter(
    (r) => r.status === 'submitted' || r.status === 'under_review'
  ).length;

  const activeReservationsCount = reservations.filter(
    (r) => r.status === 'active' || r.status === 'upcoming'
  ).length;

  // Nav categories
  const citizenItems = [
    {
      id: 'dashboard',
      label: 'City Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'find_parking',
      label: 'Find Parking',
      icon: MapPin,
    },
    {
      id: 'my_reservations',
      label: 'My Reservations',
      icon: CalendarDays,
      badge: activeReservationsCount > 0 ? activeReservationsCount : undefined,
    },
    {
      id: 'report_issue',
      label: 'Report Violation',
      icon: AlertTriangle,
      highlight: true,
    },
    {
      id: 'my_reports',
      label: 'My Submitted Reports',
      icon: FileText,
    },
  ];

  const policeItems = [
    {
      id: 'police_dashboard',
      label: 'Police Command',
      icon: ShieldCheck,
      badge: pendingIncidentsCount > 0 ? `${pendingIncidentsCount} new` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'incidents',
      label: 'Incidents Queue',
      icon: ClipboardList,
      badge: pendingIncidentsCount > 0 ? pendingIncidentsCount : undefined,
    },
    {
      id: 'vehicle_search',
      label: 'Vehicle Registry (RTO)',
      icon: Search,
    },
    {
      id: 'echallans',
      label: 'E-Challans Issued',
      icon: Receipt,
    },
  ];

  const commonItems = [
    {
      id: 'profile',
      label: 'Account & Demo Reset',
      icon: User,
    },
  ];

  return (
    <aside
      className={`bg-[#071D38] text-white flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } border-r border-[#0D294A]`}
    >
      {/* Top Logo Brand */}
      <div>
        <div className="h-20 flex items-center px-5 border-b border-[#0D294A] gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1769E8] to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <MapPin className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                  SmartCity
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  PY
                </span>
              </div>
              <p className="text-[11px] text-[#8EA2BE] font-medium truncate mt-0.5">
                Puducherry Traffic Portal
              </p>
            </div>
          )}
        </div>

        {/* Quick Role Switcher Header Pill */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <div className="bg-[#0D294A] rounded-xl p-2.5 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-[#8EA2BE] font-bold mb-1.5 flex items-center justify-between">
                <span>Active Persona</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    currentRole === 'police'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : currentRole === 'citizen'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {currentRole}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setCurrentRole('citizen')}
                  className={`text-[11px] py-1 px-1 rounded-lg font-semibold transition-all ${
                    currentRole === 'citizen'
                      ? 'bg-[#1769E8] text-white shadow'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Citizen
                </button>
                <button
                  onClick={() => setCurrentRole('police')}
                  className={`text-[11px] py-1 px-1 rounded-lg font-semibold transition-all ${
                    currentRole === 'police'
                      ? 'bg-[#1769E8] text-white shadow'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Police
                </button>
                <button
                  onClick={() => setCurrentRole('public')}
                  className={`text-[11px] py-1 px-1 rounded-lg font-semibold transition-all ${
                    currentRole === 'public'
                      ? 'bg-[#1769E8] text-white shadow'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Visitor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="px-3 py-2 space-y-6 overflow-y-auto max-h-[calc(100vh-270px)]">
          {/* General & Citizen Services */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#6B7B90] mb-2">
                Citizen & Driver Services
              </p>
            )}
            <div className="space-y-1">
              {citizenItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                      isActive
                        ? 'bg-[#1769E8] text-white shadow-lg shadow-blue-600/30 font-semibold'
                        : item.highlight
                        ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                        : 'text-[#B0C1D7] hover:bg-[#0D294A] hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-[#8EA2BE]'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic Police Section */}
          <div>
            {!collapsed && (
              <div className="px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6B7B90] mb-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-rose-400" /> Police Authority
                </span>
                {currentRole !== 'police' && (
                  <span className="text-[9px] text-amber-400/90 font-normal lowercase">(officer only)</span>
                )}
              </div>
            )}
            <div className="space-y-1">
              {policeItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (currentRole !== 'police') {
                        setCurrentRole('police');
                      }
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                      isActive
                        ? 'bg-[#1769E8] text-white shadow-lg shadow-blue-600/30 font-semibold'
                        : 'text-[#B0C1D7] hover:bg-[#0D294A] hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#8EA2BE]'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor || 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System & Settings */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#6B7B90] mb-2">
                System
              </p>
            )}
            <div className="space-y-1">
              {commonItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                      isActive
                        ? 'bg-[#1769E8] text-white shadow'
                        : 'text-[#B0C1D7] hover:bg-[#0D294A] hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#8EA2BE]'
                      }`}
                    />
                    {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-[#0D294A] bg-[#05162C]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0D294A]/60 border border-white/5">
          <div className="relative shrink-0">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover border border-white/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#071D38] ${
                currentRole === 'police'
                  ? 'bg-rose-500'
                  : currentRole === 'citizen'
                  ? 'bg-emerald-500'
                  : 'bg-blue-400'
              }`}
            />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-[#8EA2BE] capitalize truncate mt-0.5">
                {currentRole === 'police' ? currentUser.badgeNumber || 'Traffic Police' : `${currentRole} Account`}
              </div>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={logoutUser}
              title="Sign Out"
              className="text-[#8EA2BE] hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
