import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleRecord } from '../types';
import {
  Search,
  Car,
  ShieldAlert,
  Calendar,
  FileCheck,
  AlertTriangle,
  User,
  Fuel,
  Receipt,
  Plus,
  Shield,
  CheckCircle,
} from 'lucide-react';

export const VehicleSearchPage: React.FC = () => {
  const { searchVehicleRecord, eChallans, incidentReports, setActiveTab } = useApp();

  const [searchPlate, setSearchPlate] = useState<string>('PY-01-BK-4092');
  const [vehicleResult, setVehicleResult] = useState<VehicleRecord | null>(() =>
    searchVehicleRecord('PY-01-BK-4092')
  );

  const DEMO_PLATES = [
    'PY-01-BK-4092',
    'PY-05-C-7841',
    'TN-07-EA-9912',
    'PY-01-CR-1102',
    'PY-01-AB-1234',
    'PY-01-XY-9988',
  ];

  const handleSearch = (plate: string) => {
    setSearchPlate(plate);
    const res = searchVehicleRecord(plate);
    setVehicleResult(res);
  };

  // Find linked challans and incident reports for this plate
  const plateChallans = eChallans.filter(
    (ch) =>
      ch.vehicleRegistration.replace(/\s+/g, '-').toUpperCase() ===
      searchPlate.replace(/\s+/g, '-').toUpperCase()
  );

  const plateIncidents = incidentReports.filter(
    (r) =>
      r.vehicleRegistration &&
      r.vehicleRegistration.replace(/\s+/g, '-').toUpperCase() ===
        searchPlate.replace(/\s+/g, '-').toUpperCase()
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>RTO Vehicle Registry & ANPR Verification</span>
        </div>
        <h1 className="text-2xl font-black text-[#172B45] font-heading">
          Vehicle Search & Offence History
        </h1>
        <p className="text-xs text-[#6B7B90] mt-0.5">
          Inspect VAHAN database records, fitness, insurance validity, and prior traffic offences for enforcement.
        </p>
      </div>

      {/* Search Bar & Demo Presets */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchPlate);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Registration Plate (e.g. PY-01-BK-4092)..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              className="w-full uppercase font-mono font-bold bg-[#F4F7FB] border border-gray-200 text-xs rounded-xl pl-9 pr-4 py-3 text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Lookup VAHAN Record
          </button>
        </form>

        {/* Demo Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Demo Plates:
          </span>
          {DEMO_PLATES.map((plate) => (
            <button
              key={plate}
              onClick={() => handleSearch(plate)}
              className={`font-mono text-xs px-2.5 py-1 rounded-lg border transition-all ${
                searchPlate === plate
                  ? 'bg-[#071D38] text-white border-[#071D38] font-bold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Record Results */}
      {vehicleResult ? (
        <div className="space-y-6 animate-fade-in">
          {/* Main Vehicle Specifications Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 bg-[#071D38] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="font-mono text-lg font-black tracking-wider text-white">
                    {vehicleResult.registrationNumber}
                  </div>
                  <div className="text-xs text-blue-200 font-medium">{vehicleResult.makerModel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Registration
                </span>
                <button
                  onClick={() => setActiveTab('echallans')}
                  className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Issue Challan
                </button>
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Registered Owner</span>
                <div className="font-bold text-[#172B45] text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1769E8]" />
                  {vehicleResult.ownerName}
                </div>
                <span className="text-[10px] text-gray-500 block">Class: {vehicleResult.vehicleClass}</span>
              </div>

              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Jurisdiction RTO</span>
                <div className="font-bold text-[#172B45] text-sm">{vehicleResult.registeredRTO}</div>
                <span className="text-[10px] text-gray-500 block">Fuel: {vehicleResult.fuelType}</span>
              </div>

              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Insurance Validity</span>
                <div className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Valid till {vehicleResult.insuranceValidUntil}
                </div>
                <span className="text-[10px] text-gray-500 block">PUCC till {vehicleResult.pollutionValidUntil}</span>
              </div>

              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Fitness Certificate</span>
                <div className="font-bold text-[#172B45] text-sm">Valid till {vehicleResult.fitnessValidUntil}</div>
                <span className="text-[10px] text-gray-500 block">Reg Date: {vehicleResult.registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Violations & Challans History for this Plate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challans History */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#172B45] uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#1769E8]" />
                  E-Challan History ({plateChallans.length})
                </h3>
              </div>

              {plateChallans.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                  No active e-challans issued against this vehicle. Clean record!
                </div>
              ) : (
                <div className="space-y-2">
                  {plateChallans.map((ch) => (
                    <div
                      key={ch.id}
                      className="p-3 rounded-xl border border-gray-200 bg-[#F4F7FB]/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#1769E8]">{ch.id}</span>
                        <div className="font-bold text-[#172B45] mt-0.5">{ch.offenceCategory}</div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(ch.offenceTime).toLocaleDateString('en-IN')} · {ch.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[#172B45] text-sm block">
                          ₹{ch.fineAmount}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ch.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ch.paymentStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Citizen Reports */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#172B45] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Linked Citizen Incident Reports ({plateIncidents.length})
              </h3>

              {plateIncidents.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                  No citizen violation reports filed against this registration plate.
                </div>
              ) : (
                <div className="space-y-2">
                  {plateIncidents.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl border border-gray-200 bg-[#F4F7FB]/50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#1769E8]">{rep.id}</span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {rep.status}
                        </span>
                      </div>
                      <div className="font-bold text-[#172B45]">{rep.category}</div>
                      <p className="text-[11px] text-gray-600 line-clamp-1">{rep.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-2">
          <Car className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-[#172B45]">No Vehicle Record Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Please enter a valid registration number like <span className="font-mono font-bold">PY-01-BK-4092</span> or choose one of the demo presets above.
          </p>
        </div>
      )}
    </div>
  );
};
