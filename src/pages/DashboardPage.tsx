import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { ReservationModal } from '../components/parking/ReservationModal';
import { ZoneDetailsModal } from '../components/parking/ZoneDetailsModal';
import { ReportDetailsModal } from '../components/reports/ReportDetailsModal';
import { ParkingZone, IncidentReport } from '../types';
import {
  Car,
  AlertTriangle,
  FileText,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight,
  PlusCircle,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    currentRole,
    parkingZones,
    incidentReports,
    eChallans,
    reservations,
    setActiveTab,
    setSelectedParkingZoneId,
    setSelectedReportId,
  } = useApp();

  const [activeZoneForModal, setActiveZoneForModal] = useState<ParkingZone | null>(null);
  const [activeZoneForReservation, setActiveZoneForReservation] = useState<ParkingZone | null>(null);
  const [activeReportForModal, setActiveReportForModal] = useState<IncidentReport | null>(null);

  // Derive stats dynamically from data
  const totalParkingSlots = parkingZones.reduce((sum, z) => sum + z.totalSlots, 0);
  const availableParkingSlots = parkingZones.reduce((sum, z) => sum + z.availableSlots, 0);
  const occupiedSlots = totalParkingSlots - availableParkingSlots;
  const occupancyPercentage = Math.round((occupiedSlots / totalParkingSlots) * 100);

  const activeIncidents = incidentReports.filter(
    (r) => r.status === 'submitted' || r.status === 'under_review' || r.status === 'verified'
  );

  const resolvedIncidents = incidentReports.filter((r) => r.status === 'resolved');

  const totalFineAmount = eChallans.reduce((sum, ch) => sum + ch.fineAmount, 0);
  const paidFineAmount = eChallans
    .filter((ch) => ch.paymentStatus === 'paid')
    .reduce((sum, ch) => sum + ch.fineAmount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#071D38] via-[#0D294A] to-[#1769E8] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-blue-200 mb-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Puducherry Traffic Police & Smart City Initiative
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Vanakkam, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
              Real-time parking discovery, citizen traffic violation reporting, and digital enforcement
              across Puducherry Boulevard & White Town.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('find_parking')}
              className="py-2.5 px-4 rounded-xl bg-white text-[#071D38] hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 group"
            >
              <Car className="w-4 h-4 text-[#1769E8] group-hover:scale-110 transition-transform" />
              Reserve Parking
            </button>
            <button
              onClick={() => setActiveTab('report_issue')}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              Report Violation
            </button>
            {currentRole === 'police' && (
              <button
                onClick={() => setActiveTab('police_dashboard')}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Police Command
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Hero Metric Summary Cards (Matches Reference Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Parking Slots */}
        <div
          onClick={() => setActiveTab('find_parking')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#6B7B90] uppercase tracking-wider">
              Available Slots
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1769E8] flex items-center justify-center group-hover:bg-[#1769E8] group-hover:text-white transition-colors">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#172B45] font-heading">
              {availableParkingSlots}
            </span>
            <span className="text-xs text-[#6B7B90] font-medium">/ {totalParkingSlots} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 7 Zones Active
            </span>
            <span className="text-gray-400 font-medium">{occupancyPercentage}% Occupied</span>
          </div>
        </div>

        {/* Card 2: Active Traffic Incidents */}
        <div
          onClick={() => setActiveTab(currentRole === 'police' ? 'incidents' : 'my_reports')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#6B7B90] uppercase tracking-wider">
              Active Incidents
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 font-heading">
              {activeIncidents.length}
            </span>
            <span className="text-xs text-[#6B7B90] font-medium">in queue</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-amber-600 font-semibold">Under Field Review</span>
            <span className="text-gray-400 font-medium">Puducherry Central</span>
          </div>
        </div>

        {/* Card 3: Citizen Reports */}
        <div
          onClick={() => setActiveTab('my_reports')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#6B7B90] uppercase tracking-wider">
              Citizen Reports
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#172B45] font-heading">
              {incidentReports.length}
            </span>
            <span className="text-xs text-[#6B7B90] font-medium">total filed</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {resolvedIncidents.length} Resolved
            </span>
            <span className="text-gray-400 font-medium">Good faith records</span>
          </div>
        </div>

        {/* Card 4: E-Challans Enforced */}
        <div
          onClick={() => setActiveTab('echallans')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#6B7B90] uppercase tracking-wider">
              E-Challans Enforced
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#172B45] font-heading">
              ₹{totalFineAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#6B7B90] font-medium">({eChallans.length})</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">
              ₹{paidFineAmount.toLocaleString('en-IN')} Collected
            </span>
            <span className="text-amber-600 font-medium">₹{(totalFineAmount - paidFineAmount).toLocaleString('en-IN')} Pending</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
              Live GIS City Map
            </div>
            <h2 className="text-lg font-extrabold text-[#172B45] font-heading">
              Puducherry Smart Parking & Active Incident Zones
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('find_parking')}
              className="text-xs font-bold text-[#1769E8] hover:text-blue-700 flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-50 border border-blue-100 transition-colors"
            >
              Full Screen Parking Finder
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <LeafletMap
          parkingZones={parkingZones}
          incidents={incidentReports}
          height="460px"
          onSelectZone={(id) => {
            const z = parkingZones.find((p) => p.id === id);
            if (z) setActiveZoneForModal(z);
          }}
          onReserveZone={(id) => {
            const z = parkingZones.find((p) => p.id === id);
            if (z) setActiveZoneForReservation(z);
          }}
          onSelectIncident={(id) => {
            const inc = incidentReports.find((r) => r.id === id);
            if (inc) setActiveReportForModal(inc);
          }}
        />
      </div>

      {/* 2-Column Split: Real-time Parking Hub & Recent Incident Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live Parking Zones Availability */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                Parking Zone Availability
              </h3>
              <p className="text-xs text-[#6B7B90]">Live slot status across town</p>
            </div>
            <button
              onClick={() => setActiveTab('find_parking')}
              className="text-xs font-bold text-[#1769E8] hover:underline"
            >
              View all 7
            </button>
          </div>

          <div className="space-y-3">
            {parkingZones.slice(0, 4).map((zone) => {
              const occRate = Math.round(
                ((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100
              );
              const isNearlyFull = zone.availableSlots <= 10;

              return (
                <div
                  key={zone.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-[#F4F7FB]/60 hover:bg-blue-50/40 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#172B45]">{zone.name}</h4>
                      <p className="text-[11px] text-[#6B7B90] truncate max-w-xs">{zone.address}</p>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isNearlyFull
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {zone.availableSlots} slots left
                    </span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occRate > 85
                          ? 'bg-rose-500'
                          : occRate > 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      ₹{zone.fourWheelerSlots.hourlyRate}/hr (4W) · ₹{zone.twoWheelerSlots.hourlyRate}/hr (2W)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveZoneForModal(zone)}
                        className="text-xs font-semibold text-[#1769E8] hover:underline"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setActiveZoneForReservation(zone)}
                        className="text-xs font-bold text-white bg-[#1769E8] hover:bg-blue-700 px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Citizen Traffic Reports */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                Recent Citizen Reports
              </h3>
              <p className="text-xs text-[#6B7B90]">Violations reported for police action</p>
            </div>
            <button
              onClick={() => setActiveTab(currentRole === 'police' ? 'incidents' : 'my_reports')}
              className="text-xs font-bold text-[#1769E8] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {incidentReports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                onClick={() => setActiveReportForModal(report)}
                className="p-3.5 rounded-xl border border-gray-100 bg-[#F4F7FB]/60 hover:bg-gray-100/80 cursor-pointer transition-all flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#172B45] truncate">
                      {report.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        report.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.status === 'verified'
                          ? 'bg-purple-100 text-purple-800'
                          : report.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7B90] line-clamp-1 mt-0.5">{report.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                    <span>📍 {report.locationName}</span>
                    <span>·</span>
                    <span>
                      {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {report.vehicleRegistration && (
                      <>
                        <span>·</span>
                        <span className="font-mono font-bold text-[#1769E8]">
                          {report.vehicleRegistration}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeZoneForModal && (
        <ZoneDetailsModal
          zone={activeZoneForModal}
          onClose={() => setActiveZoneForModal(null)}
          onReserve={(zone) => {
            setActiveZoneForModal(null);
            setActiveZoneForReservation(zone);
          }}
        />
      )}

      {activeZoneForReservation && (
        <ReservationModal
          zone={activeZoneForReservation}
          onClose={() => setActiveZoneForReservation(null)}
        />
      )}

      {activeReportForModal && (
        <ReportDetailsModal
          report={activeReportForModal}
          onClose={() => setActiveReportForModal(null)}
          onIssueChallan={(rep) => {
            setActiveReportForModal(null);
            setActiveTab('echallans');
          }}
        />
      )}
    </div>
  );
};
