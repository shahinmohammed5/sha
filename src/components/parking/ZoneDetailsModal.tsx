import React from 'react';
import { ParkingZone } from '../../types';
import { X, MapPin, Clock, ShieldCheck, Zap, Accessibility, Navigation, Car, Bike } from 'lucide-react';

interface ZoneDetailsModalProps {
  zone: ParkingZone;
  onClose: () => void;
  onReserve: (zone: ParkingZone) => void;
}

export const ZoneDetailsModal: React.FC<ZoneDetailsModalProps> = ({ zone, onClose, onReserve }) => {
  const occupancyPercentage = Math.round(
    ((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Banner with Zone Name */}
        <div className="relative bg-[#071D38] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-[#1769E8]" />
            <span>Puducherry Smart Parking Zone</span>
          </div>
          <h2 className="text-xl font-black text-white font-heading">{zone.name}</h2>
          <p className="text-xs text-gray-300 mt-1">{zone.address}</p>
          <div className="text-[11px] text-gray-400 mt-0.5">Near: {zone.landmark}</div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Capacity and Occupancy Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <span className="block text-2xl font-black text-[#172B45]">{zone.totalSlots}</span>
              <span className="text-[10px] uppercase font-bold text-gray-500">Total Bays</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              <span className="block text-2xl font-black text-emerald-600">{zone.availableSlots}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-700">Available</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
              <span className="block text-2xl font-black text-[#1769E8]">{occupancyPercentage}%</span>
              <span className="text-[10px] uppercase font-bold text-blue-700">Occupancy</span>
            </div>
          </div>

          {/* Slot Breakdown by Vehicle Type */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#172B45] uppercase tracking-wider">
              Slot Breakdown & Tariffs
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-gray-200 bg-[#F4F7FB]/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Car className="w-4 h-4 text-[#1769E8]" />
                  <span className="text-xs font-bold text-[#172B45]">Four-Wheeler</span>
                </div>
                <div className="text-xs text-gray-600">
                  Available: <span className="font-bold text-gray-800">{zone.fourWheelerSlots.available}</span> / {zone.fourWheelerSlots.total}
                </div>
                <div className="text-sm font-extrabold text-[#1769E8] mt-1">
                  ₹{zone.fourWheelerSlots.hourlyRate} / hr
                </div>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-[#F4F7FB]/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Bike className="w-4 h-4 text-[#1769E8]" />
                  <span className="text-xs font-bold text-[#172B45]">Two-Wheeler</span>
                </div>
                <div className="text-xs text-gray-600">
                  Available: <span className="font-bold text-gray-800">{zone.twoWheelerSlots.available}</span> / {zone.twoWheelerSlots.total}
                </div>
                <div className="text-sm font-extrabold text-[#1769E8] mt-1">
                  ₹{zone.twoWheelerSlots.hourlyRate} / hr
                </div>
              </div>
            </div>
          </div>

          {/* Operating Info */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Operating Timings:
              </span>
              <span className="font-semibold text-gray-800">{zone.operatingHours}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-gray-400" /> Distance from center:
              </span>
              <span className="font-semibold text-gray-800">{zone.distanceKm || '0.5'} km</span>
            </div>
          </div>

          {/* Amenities & Features */}
          <div>
            <h4 className="text-xs font-bold text-[#172B45] uppercase tracking-wider mb-2">
              Facility Features & Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {zone.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onReserve(zone);
              }}
              disabled={zone.availableSlots === 0}
              className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-colors ${
                zone.availableSlots > 0
                  ? 'bg-[#1769E8] hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {zone.availableSlots > 0 ? 'Reserve a Slot' : 'Lot is Full'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
