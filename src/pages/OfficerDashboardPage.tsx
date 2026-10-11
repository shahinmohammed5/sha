import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportDetailsModal } from '../components/reports/ReportDetailsModal';
import { ChallanReceiptModal } from '../components/challans/ChallanReceiptModal';
import { IncidentReport, EChallan, ReportCategory } from '../types';
import { STANDARD_FINES } from '../data/mockData';
import {
  ShieldAlert,
  ClipboardList,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  UserCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Shield,
  Filter,
} from 'lucide-react';

export const OfficerDashboardPage: React.FC = () => {
  const {
    currentUser,
    incidentReports,
    eChallans,
    issueChallan,
    setActiveTab,
    auditLogs,
  } = useApp();

  const [activeReportModal, setActiveReportModal] = useState<IncidentReport | null>(null);
  const [activeChallanModal, setActiveChallanModal] = useState<EChallan | null>(null);
  const [showQuickChallanModal, setShowQuickChallanModal] = useState<boolean>(false);

  // Quick Challan Form State
  const [vehicleReg, setVehicleReg] = useState<string>('PY-01-BK-4092');
  const [category, setCategory] = useState<ReportCategory>('Illegal Parking');
  const [location, setLocation] = useState<string>('Rue Dumas, White Town');
  const [fineAmount, setFineAmount] = useState<number>(STANDARD_FINES['Illegal Parking'] || 500);
  const [description, setDescription] = useState<string>('Vehicle parked in designated no-parking red zone obstructing traffic flow.');

  // Stats calculation
  const pendingReports = incidentReports.filter(
    (r) => r.status === 'submitted' || r.status === 'under_review'
  );
  const verifiedReports = incidentReports.filter((r) => r.status === 'verified');
  const resolvedReports = incidentReports.filter((r) => r.status === 'resolved');

  const totalFines = eChallans.reduce((sum, ch) => sum + ch.fineAmount, 0);
  const paidFines = eChallans
    .filter((ch) => ch.paymentStatus === 'paid')
    .reduce((sum, ch) => sum + ch.fineAmount, 0);

  // Categories distribution
  const categoryCounts = incidentReports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const handleQuickIssueChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const created = issueChallan({
      vehicleRegistration: vehicleReg,
      offenceCategory: category,
      offenceDescription: description,
      location,
      fineAmount,
    });
    setShowQuickChallanModal(false);
    setActiveChallanModal(created);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Officer Command Bar */}
      <div className="bg-[#071D38] text-white rounded-2xl p-6 shadow-xl border border-[#0D294A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-rose-500" />
            <span>Puducherry Traffic Police Enforcement Wing</span>
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-white">
            Traffic Police Command Center
          </h1>
          <p className="text-xs text-blue-200 mt-0.5">
            Officer on Duty: <span className="font-bold text-white">{currentUser.name}</span> · Badge #{currentUser.badgeNumber || 'PY-TP-402'} · Grand Bazaar Station
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowQuickChallanModal(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Issue Digital E-Challan
          </button>
          <button
            onClick={() => setActiveTab('vehicle_search')}
            className="py-2.5 px-4 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Vehicle RTO Search
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Pending Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 font-heading">
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Awaiting officer dispatch/check</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Verified Incidents</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600 font-heading">
            {verifiedReports.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Confirmed with CCTV / ANPR</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Challans Issued</span>
            <Receipt className="w-4 h-4 text-[#1769E8]" />
          </div>
          <div className="text-3xl font-black text-[#172B45] font-heading">
            {eChallans.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Total fines: ₹{totalFines.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-heading">
            {resolvedReports.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">₹{paidFines.toLocaleString('en-IN')} collected</p>
        </div>
      </div>

      {/* Main Grid: Priority Incident Triage & Quick Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Priority Incident Queue */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#172B45] font-heading">
                Citizen Incident Triage Queue
              </h2>
              <p className="text-xs text-gray-500">
                Action pending reports submitted by citizens across Puducherry
              </p>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs font-bold text-[#1769E8] hover:underline flex items-center gap-1"
            >
              Full Incidents Table <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidentReports.slice(0, 5).map((rep) => (
              <div
                key={rep.id}
                onClick={() => setActiveReportModal(rep)}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1769E8]">{rep.id}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'verified'
                          ? 'bg-purple-100 text-purple-800'
                          : rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rep.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#172B45]">{rep.category}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{rep.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>📍 {rep.locationName}</span>
                    {rep.vehicleRegistration && (
                      <span className="font-mono font-bold text-[#1769E8]">
                        Plate: {rep.vehicleRegistration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReportModal(rep);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#071D38] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
                  >
                    Review & Decide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Category Breakdown & Audit Log */}
        <div className="lg:col-span-4 space-y-6">
          {/* Offence Distribution Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#172B45] uppercase tracking-wider">
              Violations by Category
            </h3>
            <div className="space-y-2">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / incidentReports.length) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-700">
                      <span className="font-medium truncate">{cat}</span>
                      <span className="font-bold text-[#172B45]">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1769E8] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Action Log */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#172B45] uppercase tracking-wider flex items-center justify-between">
              <span>Recent Officer Audit Log</span>
              <span className="text-[10px] text-gray-400 lowercase">live trail</span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-gray-100 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                    <span className="font-semibold text-gray-700">{log.action}</span>
                    <span>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2">{log.details}</p>
                  <span className="text-[10px] text-[#1769E8] font-medium block mt-0.5">
                    By {log.actorName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Issue E-Challan Modal */}
      {showQuickChallanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-5 bg-[#071D38] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Traffic Enforcement
                </span>
                <h3 className="text-base font-extrabold text-white">Issue Digital E-Challan</h3>
              </div>
              <button
                onClick={() => setShowQuickChallanModal(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickIssueChallan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Vehicle Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PY-01-BK-4092"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  className="w-full uppercase font-mono font-bold bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs text-[#172B45]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Offence Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const cat = e.target.value as ReportCategory;
                    setCategory(cat);
                    setFineAmount(STANDARD_FINES[cat] || 500);
                  }}
                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs text-[#172B45]"
                >
                  {Object.keys(STANDARD_FINES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (Standard Fine: ₹{STANDARD_FINES[cat]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Offence Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs text-[#172B45]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Fine Amount (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(parseInt(e.target.value))}
                  className="w-full font-bold text-[#1769E8] bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Violation Notes / Particulars
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowQuickChallanModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Confirm & Issue Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeReportModal && (
        <ReportDetailsModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onIssueChallan={(rep) => {
            setVehicleReg(rep.vehicleRegistration || 'PY-01-BK-4092');
            setCategory(rep.category);
            setLocation(rep.locationName);
            setFineAmount(STANDARD_FINES[rep.category] || 500);
            setDescription(rep.description);
            setActiveReportModal(null);
            setShowQuickChallanModal(true);
          }}
        />
      )}

      {activeChallanModal && (
        <ChallanReceiptModal
          challan={activeChallanModal}
          onClose={() => setActiveChallanModal(null)}
        />
      )}
    </div>
  );
};
