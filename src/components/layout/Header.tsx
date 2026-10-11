import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Clock,
  Menu,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  Shield,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    setActiveTab,
    notifications,
    markNotificationRead,
    clearNotifications,
    parkingZones,
    setSelectedParkingZoneId,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter parking zones based on search query
  const searchResults = searchQuery.trim()
    ? parkingZones.filter(
        (z) =>
          z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          z.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          z.landmark.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-18 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Menu & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search parking lots, streets, or landmarks in Puducherry..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-[#F4F7FB] border border-gray-200 text-[#172B45] text-xs font-medium rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8] transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30 max-h-64 overflow-y-auto">
              <div className="p-2 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Parking Zones Found ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">
                  No parking spots matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setSelectedParkingZoneId(zone.id);
                      setActiveTab('find_parking');
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-3 hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#172B45]">{zone.name}</div>
                      <div className="text-[11px] text-gray-500">{zone.address}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#1769E8]">
                        {zone.availableSlots} available
                      </span>
                      <div className="text-[10px] text-gray-400">of {zone.totalSlots} slots</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Clock, Quick Persona Switch, Notifications, Emergency */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time IST Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-[#6B7B90] bg-[#F4F7FB] px-3 py-1.5 rounded-xl border border-gray-200/80">
          <Clock className="w-3.5 h-3.5 text-[#1769E8]" />
          <span>{currentTime || 'Puducherry Time (IST)'}</span>
        </div>

        {/* Quick Demo Persona Dropdown / Switcher */}
        <div className="hidden sm:flex items-center bg-[#F4F7FB] p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setCurrentRole('citizen')}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentRole === 'citizen'
                ? 'bg-white text-[#1769E8] shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            Citizen
          </button>
          <button
            onClick={() => setCurrentRole('police')}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentRole === 'police'
                ? 'bg-[#071D38] text-white shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            Police
          </button>
        </div>

        {/* Traffic Emergency Dial Button */}
        <a
          href="tel:103"
          title="Traffic Police Helpline: 103"
          className="hidden md:flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Help 103</span>
        </a>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-[#F4F7FB] border border-gray-200 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              <div className="p-3.5 bg-[#071D38] text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs">Live Traffic & System Alerts</h4>
                  <p className="text-[10px] text-gray-300">Puducherry SmartCity Updates</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-blue-300 hover:text-white underline font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No new alerts at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 text-left hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                        {notif.type === 'danger' && (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        )}
                        {notif.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-[#1769E8]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#172B45] truncate">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7B90] mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Thumbnail */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition-opacity"
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#1769E8] text-white flex items-center justify-center text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#172B45] leading-tight truncate max-w-[120px]">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-[#6B7B90] capitalize">
              {currentRole}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
