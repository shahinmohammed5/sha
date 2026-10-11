import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { ReservationModal } from '../components/parking/ReservationModal';
import { ZoneDetailsModal } from '../components/parking/ZoneDetailsModal';
import { ParkingZone } from '../types';
import {
  Search,
  Filter,
  Car,
  Bike,
  Zap,
  Accessibility,
  Navigation,
  MapPin,
  Clock,
  Layers,
  List,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export const ParkingDiscoveryPage: React.FC = () => {
  const { parkingZones, selectedParkingZoneId, setSelectedParkingZoneId, addToast } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'split' | 'grid'>('split');
  const [activeZoneForModal, setActiveZoneForModal] = useState<ParkingZone | null>(null);
  const [activeZoneForReservation, setActiveZoneForReservation] = useState<ParkingZone | null>(null);

  // Filter logic
  const filteredZones = parkingZones.filter((zone) => {
    // Search match
    const matchSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.landmark.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    // Filter type match
    if (filterType === 'all') return true;
    if (filterType === 'available') return zone.availableSlots > 10;
    if (filterType === 'nearly_full') return zone.availableSlots > 0 && zone.availableSlots <= 10;
    if (filterType === 'full') return zone.availableSlots === 0;
    if (filterType === 'ev') return zone.features.some((f) => f.toLowerCase().includes('ev'));
    if (filterType === 'accessible')
      return zone.features.some((f) => f.toLowerCase().includes('wheelchair') || f.toLowerCase().includes('accessible'));
    if (filterType === 'two_wheeler') return zone.twoWheelerSlots.available > 0;
    if (filterType === 'four_wheeler') return zone.fourWheelerSlots.available > 0;

    return true;
  });

  const handleNavigate = (zone: ParkingZone) => {
    addToast(
      'Navigation Route Initiated',
      `Routing to ${zone.name} via Boulevard Street (${zone.distanceKm || 0.5} km).`,
      'info'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
            Smart Parking Management
          </div>
          <h1 className="text-2xl font-black text-[#172B45] font-heading">
            Find & Reserve Parking in Puducherry
          </h1>
          <p className="text-xs text-[#6B7B90] mt-0.5">
            Real-time space occupancy across Boulevard, White Town, and commercial sectors.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 self-start md:self-auto shadow-sm">
          <button
            onClick={() => setViewMode('split')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-[#1769E8] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Map & List View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#1769E8] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Grid View
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by parking lot name, street name (e.g. Beach Road, JN Street)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FB] border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Zones' },
            { id: 'available', label: 'Available (>10 slots)' },
            { id: 'nearly_full', label: 'Nearly Full' },
            { id: 'four_wheeler', label: 'Four-Wheeler' },
            { id: 'two_wheeler', label: 'Two-Wheeler' },
            { id: 'ev', label: 'EV Charging' },
            { id: 'accessible', label: 'Accessible' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                filterType === pill.id
                  ? 'bg-[#071D38] text-white shadow-sm'
                  : 'bg-[#F4F7FB] text-gray-600 hover:bg-gray-200/70 border border-gray-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Map (5 or 6 columns) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
              <LeafletMap
                parkingZones={filteredZones}
                selectedZoneId={selectedParkingZoneId}
                height="560px"
                onSelectZone={(id) => {
                  setSelectedParkingZoneId(id);
                  const z = parkingZones.find((p) => p.id === id);
                  if (z) setActiveZoneForModal(z);
                }}
                onReserveZone={(id) => {
                  const z = parkingZones.find((p) => p.id === id);
                  if (z) setActiveZoneForReservation(z);
                }}
              />
            </div>
          </div>

          {/* Right: Zone Cards List (6 columns) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
              <span>Showing {filteredZones.length} parking locations</span>
              <span>Puducherry Central Zone</span>
            </div>

            {filteredZones.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-sm text-[#172B45]">No parking zones found</h3>
                <p className="text-xs text-gray-500">
                  Try adjusting your search query or removing active filters.
                </p>
                <button
                  onClick={() => {
                    setFilterType('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs text-[#1769E8] font-bold underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredZones.map((zone) => {
                const isSelected = selectedParkingZoneId === zone.id;
                const occRate = Math.round(
                  ((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100
                );
                const isNearlyFull = zone.availableSlots <= 10;

                return (
                  <div
                    key={zone.id}
                    className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'border-[#1769E8] ring-2 ring-[#1769E8]/20 bg-blue-50/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Card Header matching Reference Image 2 */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                            {zone.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1769E8] shrink-0" />
                          {zone.address}
                        </p>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Near {zone.landmark}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                          zone.availableSlots === 0
                            ? 'bg-rose-100 text-rose-800'
                            : isNearlyFull
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {zone.availableSlots === 0
                          ? 'Full'
                          : isNearlyFull
                          ? 'Nearly Full'
                          : 'Available'}
                      </span>
                    </div>

                    {/* Stats Metrics Counter (Spaces / Available) */}
                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div className="bg-[#F4F7FB] p-3 rounded-xl border border-gray-100 text-center">
                        <span className="block text-2xl font-black text-[#172B45] font-heading">
                          {zone.totalSlots}
                        </span>
                        <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                          total spaces
                        </span>
                      </div>
                      <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 text-center">
                        <span className="block text-2xl font-black text-[#1769E8] font-heading">
                          {zone.availableSlots}
                        </span>
                        <span className="text-[11px] font-bold uppercase text-[#1769E8] tracking-wider">
                          available now
                        </span>
                      </div>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                        <span>Occupancy ({occRate}%)</span>
                        <span>{zone.totalSlots - zone.availableSlots} occupied</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            occRate > 85
                              ? 'bg-rose-500'
                              : occRate > 60
                              ? 'bg-amber-500'
                              : 'bg-[#159B72]'
                          }`}
                          style={{ width: `${occRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta info tags */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 py-2 border-t border-b border-gray-100 mb-4 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">
                          ₹{zone.fourWheelerSlots.hourlyRate}/hr (4W)
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-gray-800">
                          ₹{zone.twoWheelerSlots.hourlyRate}/hr (2W)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>🕒 {zone.operatingHours}</span>
                        <span>📍 {zone.distanceKm || '0.5'} km</span>
                      </div>
                    </div>

                    {/* Action Buttons matching Reference Image 2 */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActiveZoneForModal(zone)}
                        className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleNavigate(zone)}
                        className="py-2.5 px-3 rounded-xl border border-blue-200 text-[#1769E8] hover:bg-blue-50 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Navigate
                      </button>
                      <button
                        onClick={() => setActiveZoneForReservation(zone)}
                        disabled={zone.availableSlots === 0}
                        className={`py-2.5 px-3 rounded-xl text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 ${
                          zone.availableSlots > 0
                            ? 'bg-[#1769E8] hover:bg-blue-700 shadow-blue-500/20'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Reserve
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Full Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => {
            const occRate = Math.round(
              ((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100
            );
            return (
              <div
                key={zone.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                      {zone.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        zone.availableSlots > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {zone.availableSlots} free
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{zone.address}</p>

                  <div className="grid grid-cols-2 gap-2 my-4 text-center">
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="block text-xl font-black text-[#172B45]">{zone.totalSlots}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
                    </div>
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                      <span className="block text-xl font-black text-[#1769E8]">{zone.availableSlots}</span>
                      <span className="text-[10px] uppercase font-bold text-[#1769E8]">Available</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>4-Wheeler Rate:</span>
                      <span className="font-bold text-[#172B45]">₹{zone.fourWheelerSlots.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2-Wheeler Rate:</span>
                      <span className="font-bold text-[#172B45]">₹{zone.twoWheelerSlots.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setActiveZoneForModal(zone)}
                    className="py-2 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveZoneForReservation(zone)}
                    disabled={zone.availableSlots === 0}
                    className="py-2 px-3 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    </div>
  );
};
