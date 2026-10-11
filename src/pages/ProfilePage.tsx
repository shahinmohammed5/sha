import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  User,
  Shield,
  RotateCcw,
  CheckCircle2,
  Database,
  Info,
  Server,
  Lock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    resetDemoData,
    parkingZones,
    incidentReports,
    eChallans,
    reservations,
  } = useApp();

  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
          Account & Configuration
        </div>
        <h1 className="text-2xl font-black text-[#172B45] font-heading">
          Profile, Roles & Demo Environment
        </h1>
        <p className="text-xs text-[#6B7B90] mt-0.5">
          Manage your session persona, test access permissions, and restore demonstration records.
        </p>
      </div>

      {/* User Persona Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#071D38] text-white flex items-center justify-center text-xl font-bold font-heading">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#172B45] font-heading">
                {currentUser.name}
              </h2>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  currentRole === 'police'
                    ? 'bg-rose-100 text-rose-800'
                    : currentRole === 'citizen'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {currentRole}
              </span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> {currentUser.email}
              </span>
              {currentUser.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {currentUser.phone}
                </span>
              )}
            </div>
            {currentRole === 'police' && (
              <div className="text-xs text-[#1769E8] font-semibold mt-1">
                Badge: #{currentUser.badgeNumber} · {currentUser.station}
              </div>
            )}
          </div>
        </div>

        {/* Quick Persona Switcher */}
        <div className="bg-[#F4F7FB] p-3 rounded-2xl border border-gray-200 space-y-2 w-full md:w-auto">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Switch Testing Persona:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentRole('citizen')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'citizen'
                  ? 'bg-white text-[#1769E8] shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Citizen (Arun Kumar)
            </button>
            <button
              onClick={() => setCurrentRole('police')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'police'
                  ? 'bg-[#071D38] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Police (Insp. Vijayaraghavan)
            </button>
            <button
              onClick={() => setCurrentRole('public')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'public'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Visitor / Driver
            </button>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200/80 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-amber-950">
                Hackathon Presentation — Reset Demo Records
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Restores the 7 Puducherry parking zones to initial available slot counts, recreates all 8
                sample incident reports, sample reservations, and sample e-challans.
              </p>
            </div>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shrink-0 transition-colors"
            >
              Reset Sample Data
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmReset(false)}
                className="py-1.5 px-3 rounded-lg border border-amber-300 text-amber-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmReset(false);
                }}
                className="py-1.5 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System Information & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-[#172B45] text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1769E8]" />
            Local Data Layer State
          </h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span>Parking Zones:</span>
              <span className="font-bold text-[#172B45]">{parkingZones.length} Locations</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span>Incident Reports:</span>
              <span className="font-bold text-[#172B45]">{incidentReports.length} Reports</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span>Driver Reservations:</span>
              <span className="font-bold text-[#172B45]">{reservations.length} Bookings</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span>Digital E-Challans:</span>
              <span className="font-bold text-[#172B45]">{eChallans.length} Notices</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Persistence Provider:</span>
              <span className="font-semibold text-emerald-600">
                Browser Local Storage (Demo Mode)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-[#172B45] text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            Hackathon Production Architecture
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Designed for modular cloud deployment:
          </p>
          <ul className="space-y-1.5 text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Full React 19 + TypeScript + Tailwind CSS design system</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Interactive Leaflet maps with OpenStreetMap tiles</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>RBAC validation for Driver, Citizen, and Police Officer roles</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Printable official e-challan notice generation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
