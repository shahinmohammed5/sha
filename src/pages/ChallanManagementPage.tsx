import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChallanReceiptModal } from '../components/challans/ChallanReceiptModal';
import { EChallan, ReportCategory, ChallanStatus } from '../types';
import { STANDARD_FINES } from '../data/mockData';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Printer,
  XCircle,
  CheckCircle,
  Clock,
  Shield,
  AlertTriangle,
  QrCode,
  DollarSign,
} from 'lucide-react';

export const ChallanManagementPage: React.FC = () => {
  const {
    eChallans,
    issueChallan,
    updateChallanPayment,
    cancelChallan,
    selectedChallanId,
    setSelectedChallanId,
    currentRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeReceiptModal, setActiveReceiptModal] = useState<EChallan | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Challan Form state
  const [vehicleReg, setVehicleReg] = useState<string>('PY-01-BK-4092');
  const [offenceCategory, setOffenceCategory] = useState<ReportCategory>('Illegal Parking');
  const [location, setLocation] = useState<string>('Goubert Avenue, White Town');
  const [fineAmount, setFineAmount] = useState<number>(500);
  const [description, setDescription] = useState<string>('Stationary vehicle parked on yellow double line blocking public access.');
  const [cancelModalChallan, setCancelModalChallan] = useState<EChallan | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Handle selected challan from other tabs
  React.useEffect(() => {
    if (selectedChallanId) {
      const target = eChallans.find((c) => c.id === selectedChallanId);
      if (target) {
        setActiveReceiptModal(target);
        setSelectedChallanId(null);
      }
    }
  }, [selectedChallanId, eChallans]);

  const filteredChallans = eChallans.filter((ch) => {
    const matchesSearch =
      ch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.offenceCategory.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && ch.paymentStatus !== statusFilter) return false;
    return true;
  });

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const created = issueChallan({
      vehicleRegistration: vehicleReg,
      offenceCategory,
      offenceDescription: description,
      location,
      fineAmount,
    });
    setShowCreateModal(false);
    setActiveReceiptModal(created);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalChallan || !cancelReason.trim()) return;
    cancelChallan(cancelModalChallan.id, cancelReason);
    setCancelModalChallan(null);
    setCancelReason('');
  };

  const getPaymentBadge = (status: ChallanStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
            Paid
          </span>
        );
      case 'pending_payment':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
            Pending Payment
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold uppercase tracking-wider line-through">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
            Issued
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Traffic Police Digital Enforcement</span>
          </div>
          <h1 className="text-2xl font-black text-[#172B45] font-heading">
            Digital E-Challan Management
          </h1>
          <p className="text-xs text-[#6B7B90] mt-0.5">
            Issue traffic infraction notices, track digital payments, and print official notices.
          </p>
        </div>

        {currentRole === 'police' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Issue New E-Challan
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by challan number (e.g. ECH-PY), vehicle registration, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FB] border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {['all', 'pending_payment', 'paid', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl font-semibold capitalize shrink-0 transition-all ${
                  statusFilter === st
                    ? 'bg-[#071D38] text-white shadow-sm'
                    : 'bg-[#F4F7FB] text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challans Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F7FB] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">Challan ID</th>
                <th className="p-3.5">Vehicle Reg</th>
                <th className="p-3.5">Offence Details</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Penalty Fine</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Issued Date</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChallans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No e-challans found matching your search.
                  </td>
                </tr>
              ) : (
                filteredChallans.map((ch) => (
                  <tr
                    key={ch.id}
                    onClick={() => setActiveReceiptModal(ch)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 pl-5 font-mono font-bold text-[#1769E8]">
                      {ch.id}
                    </td>
                    <td className="p-3.5 font-mono font-black text-gray-900">
                      {ch.vehicleRegistration}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-[#172B45]">{ch.offenceCategory}</div>
                      <p className="text-[11px] text-gray-500 truncate">{ch.offenceDescription}</p>
                    </td>
                    <td className="p-3.5 text-gray-700 max-w-[180px] truncate">{ch.location}</td>
                    <td className="p-3.5 font-black text-rose-600 text-sm">
                      ₹{ch.fineAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">{getPaymentBadge(ch.paymentStatus)}</td>
                    <td className="p-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(ch.issuedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveReceiptModal(ch)}
                          className="py-1 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          Notice
                        </button>

                        {currentRole === 'police' && ch.paymentStatus !== 'cancelled' && (
                          <button
                            onClick={() => setCancelModalChallan(ch)}
                            className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Cancel / Revoke Challan"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Challan Wizard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-5 bg-[#071D38] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  New Violation Entry
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Issue Digital E-Challan Notice
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChallan} className="p-6 space-y-4 text-xs">
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
                  Offence Classification <span className="text-rose-500">*</span>
                </label>
                <select
                  value={offenceCategory}
                  onChange={(e) => {
                    const cat = e.target.value as ReportCategory;
                    setOffenceCategory(cat);
                    setFineAmount(STANDARD_FINES[cat] || 500);
                  }}
                  className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-2.5 text-xs text-[#172B45]"
                >
                  {Object.keys(STANDARD_FINES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (Tariff: ₹{STANDARD_FINES[cat]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Violation Location (Puducherry) <span className="text-rose-500">*</span>
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
                  Penalty Fine Amount (₹) <span className="text-rose-500">*</span>
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
                  Offence Specifics / Notes
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
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Issue E-Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Challan Audit Reason Modal */}
      {cancelModalChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 text-xs">
            <h3 className="font-extrabold text-base text-[#172B45]">
              Revoke Challan {cancelModalChallan.id}
            </h3>
            <p className="text-gray-500">
              Please enter an official audit reason for cancelling this penalty. This action is permanently recorded in the police audit trail.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Mistaken vehicle plate reading upon review of high-resolution dashcam footage..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 bg-[#F4F7FB] border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelModalChallan(null)}
                className="py-2 px-3 rounded-xl border border-gray-200 text-gray-600 font-bold"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim()}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-bold"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {activeReceiptModal && (
        <ChallanReceiptModal
          challan={activeReceiptModal}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}
    </div>
  );
};
