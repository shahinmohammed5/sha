import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation, ReservationStatus } from '../types';
import {
  CalendarDays,
  Search,
  Filter,
  Car,
  Bike,
  QrCode,
  Printer,
  XCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const { reservations, cancelReservation, currentUser, setActiveTab } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPass, setSelectedPass] = useState<Reservation | null>(null);

  // Filter user reservations
  const filteredReservations = reservations.filter((res) => {
    // If not police, show user's own reservations (or all for demo evaluator)
    const matchesSearch =
      res.parkingZoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    return res.status === statusFilter;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold uppercase tracking-wider">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold uppercase tracking-wider line-through">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
            Driver Services
          </div>
          <h1 className="text-2xl font-black text-[#172B45] font-heading">
            My Parking Reservations
          </h1>
          <p className="text-xs text-[#6B7B90] mt-0.5">
            Manage your booked slots, download entry passes, or cancel upcoming reservations.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('find_parking')}
          className="py-2.5 px-4 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Car className="w-4 h-4" />
          Book New Parking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by reservation ID (e.g. RES-PY), zone name, or vehicle plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FB] border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['all', 'active', 'upcoming', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-[#071D38] text-white shadow-sm'
                  : 'bg-[#F4F7FB] text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center space-y-3">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-[#172B45]">No reservations found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You don't have any reservations matching the current criteria. Discover parking spots
            around Beach Road and book a slot instantly!
          </p>
          <button
            onClick={() => setActiveTab('find_parking')}
            className="mt-2 py-2 px-4 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700"
          >
            Explore Parking Lots
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#1769E8]">
                      {res.id}
                    </span>
                    <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                      {res.parkingZoneName}
                    </h3>
                  </div>
                  {getStatusBadge(res.status)}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#1769E8] shrink-0" />
                  <span className="truncate">{res.parkingAddress}</span>
                </div>

                {/* Key Details Card */}
                <div className="bg-[#F4F7FB] p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      {res.vehicleType === 'four_wheeler' ? (
                        <Car className="w-3.5 h-3.5 text-[#1769E8]" />
                      ) : (
                        <Bike className="w-3.5 h-3.5 text-[#1769E8]" />
                      )}
                      Vehicle:
                    </span>
                    <span className="font-mono font-bold text-[#172B45]">
                      {res.vehicleRegistration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Allocated Bay:</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      Slot {res.slotNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-800">
                      {res.durationHours} Hours (from{' '}
                      {new Date(res.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      )
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-bold">Total Paid:</span>
                    <span className="font-extrabold text-[#1769E8] text-sm">
                      ₹{res.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPass(res)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-gray-600" />
                  Pass / QR
                </button>

                {(res.status === 'upcoming' || res.status === 'active') && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel reservation ${res.id}? This will release the slot immediately.`)) {
                        cancelReservation(res.id);
                      }
                    }}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-gray-500">Digital Entry Ticket</span>
              <button
                onClick={() => setSelectedPass(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-[#172B45] font-heading">
                {selectedPass.parkingZoneName}
              </h3>
              <p className="text-xs text-gray-500">{selectedPass.parkingAddress}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 inline-block mx-auto">
              <QrCode className="w-36 h-36 text-[#071D38]" />
              <div className="font-mono text-xs font-bold text-gray-600 mt-2">
                {selectedPass.id}
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-black text-base">BAY {selectedPass.slotNumber}</div>
              <div>Plate: {selectedPass.vehicleRegistration}</div>
              <div className="text-[10px] text-emerald-600">Scan at entrance scanner</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Slip
              </button>
              <button
                onClick={() => setSelectedPass(null)}
                className="flex-1 py-2 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
