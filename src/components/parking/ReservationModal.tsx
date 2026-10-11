import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParkingZone, VehicleType, Reservation } from '../../types';
import { X, Car, Bike, Clock, Calendar, ShieldCheck, CheckCircle2, QrCode, Printer } from 'lucide-react';

interface ReservationModalProps {
  zone: ParkingZone;
  onClose: () => void;
  onSuccess?: (reservation: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ zone, onClose, onSuccess }) => {
  const { createReservation, currentUser, setActiveTab } = useApp();

  const [vehicleType, setVehicleType] = useState<VehicleType>('four_wheeler');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('PY-01-AB-1234');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const selectedSlotConfig =
    vehicleType === 'two_wheeler' ? zone.twoWheelerSlots : zone.fourWheelerSlots;
  const isSlotAvailable = selectedSlotConfig.available > 0;
  const hourlyRate = selectedSlotConfig.hourlyRate;
  const totalAmount = hourlyRate * durationHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!vehicleRegistration.trim()) {
      setError('Please enter a valid vehicle registration number (e.g. PY-01-AB-1234).');
      return;
    }

    if (!isSlotAvailable) {
      setError(`Sorry, no ${vehicleType === 'two_wheeler' ? 'two-wheeler' : 'four-wheeler'} slots available at ${zone.name}.`);
      return;
    }

    const startDateTime = `${date}T${time}:00`;
    const res = createReservation({
      parkingZoneId: zone.id,
      vehicleType,
      vehicleRegistration: vehicleRegistration.trim(),
      startTime: startDateTime,
      durationHours,
    });

    if (res.success && res.reservation) {
      setConfirmedReservation(res.reservation);
      if (onSuccess) onSuccess(res.reservation);
    } else {
      setError(res.error || 'Failed to complete reservation. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#071D38] text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">
              Smart Parking Reservation
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white font-heading truncate">
              {zone.name}
            </h3>
            <p className="text-xs text-gray-300 truncate mt-0.5">{zone.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {confirmedReservation ? (
            /* Confirmation Slip */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-[#172B45]">Parking Reserved!</h4>
              <p className="text-xs text-[#6B7B90]">
                Your spot has been secured. Show this digital pass or QR upon entry.
              </p>

              {/* Pass Ticket Box */}
              <div className="bg-[#F4F7FB] border-2 border-dashed border-gray-300 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-500">Reservation ID</span>
                  <span className="text-xs font-mono font-bold text-[#1769E8]">
                    {confirmedReservation.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Assigned Bay:</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      Slot {confirmedReservation.slotNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Vehicle Reg:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {confirmedReservation.vehicleRegistration}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Duration:</span>
                    <span className="font-semibold text-gray-800">
                      {confirmedReservation.durationHours} Hours (₹{confirmedReservation.totalAmount})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Status:</span>
                    <span className="font-semibold text-emerald-600 capitalize">
                      {confirmedReservation.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-center gap-3">
                  <QrCode className="w-12 h-12 text-[#071D38]" />
                  <div className="text-[10px] text-gray-500 leading-tight">
                    SmartCity Puducherry Access Token
                    <br />
                    <span className="font-mono text-gray-700">Scan at entrance boom barrier</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('my_reservations');
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  View in My Reservations
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Vehicle Type Choice */}
              <div>
                <label className="block text-xs font-bold text-[#172B45] mb-1.5">
                  Select Vehicle Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVehicleType('four_wheeler')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      vehicleType === 'four_wheeler'
                        ? 'border-[#1769E8] bg-blue-50/60 ring-2 ring-[#1769E8]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        vehicleType === 'four_wheeler'
                          ? 'bg-[#1769E8] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172B45]">Four-Wheeler</div>
                      <div className="text-[11px] text-gray-500">₹{zone.fourWheelerSlots.hourlyRate}/hr</div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {zone.fourWheelerSlots.available} slots left
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('two_wheeler')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      vehicleType === 'two_wheeler'
                        ? 'border-[#1769E8] bg-blue-50/60 ring-2 ring-[#1769E8]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        vehicleType === 'two_wheeler'
                          ? 'bg-[#1769E8] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172B45]">Two-Wheeler</div>
                      <div className="text-[11px] text-gray-500">₹{zone.twoWheelerSlots.hourlyRate}/hr</div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {zone.twoWheelerSlots.available} slots left
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Vehicle Registration Number */}
              <div>
                <label className="block text-xs font-bold text-[#172B45] mb-1">
                  Vehicle Registration Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. PY-01-AB-1234"
                    value={vehicleRegistration}
                    onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
                    className="flex-1 uppercase font-mono font-bold bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8]"
                  />
                  <button
                    type="button"
                    onClick={() => setVehicleRegistration('PY-01-AB-1234')}
                    className="text-[10px] font-semibold px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 shrink-0"
                  >
                    Demo Plate
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-[#172B45] mb-1">
                  <span>Duration: {durationHours} Hours</span>
                  <span className="text-[#1769E8]">₹{hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value))}
                  className="w-full accent-[#1769E8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>1 hr</span>
                  <span>3 hrs</span>
                  <span>5 hrs</span>
                  <span>10 hrs</span>
                </div>
              </div>

              {/* Pricing Calculation Summary */}
              <div className="bg-[#F4F7FB] rounded-xl p-3 border border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Base Rate ({vehicleType === 'two_wheeler' ? '2W' : '4W'})</span>
                  <span>₹{hourlyRate} × {durationHours} hrs</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Smart City Convenience Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE (Demo)</span>
                </div>
                <div className="flex justify-between font-black text-[#172B45] pt-1 border-t border-gray-200 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-[#1769E8]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isSlotAvailable}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-colors ${
                    isSlotAvailable
                      ? 'bg-[#1769E8] hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSlotAvailable ? `Confirm & Reserve (₹${totalAmount})` : 'No Slots Available'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
