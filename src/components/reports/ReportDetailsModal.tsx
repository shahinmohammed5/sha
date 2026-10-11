import React, { useState } from 'react';
import { IncidentReport, ReportStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Receipt,
  Car,
} from 'lucide-react';

interface ReportDetailsModalProps {
  report: IncidentReport;
  onClose: () => void;
  onIssueChallan?: (report: IncidentReport) => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  onClose,
  onIssueChallan,
}) => {
  const { currentRole, updateReportStatus, setActiveTab, setSelectedChallanId } = useApp();

  const [officerNote, setOfficerNote] = useState<string>('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<ReportStatus>(report.status);
  const [showStatusConfirm, setShowStatusConfirm] = useState<boolean>(false);

  const handleUpdateStatus = () => {
    updateReportStatus(report.id, selectedNewStatus, officerNote);
    setShowStatusConfirm(false);
    setOfficerNote('');
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">Submitted</span>;
      case 'under_review':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">Under Review</span>;
      case 'verified':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold uppercase tracking-wider">Verified</span>;
      case 'resolved':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">Resolved</span>;
      case 'rejected':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold uppercase tracking-wider">Rejected</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#071D38] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-blue-300 font-bold">{report.id}</span>
              {getStatusBadge(report.status)}
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white font-heading mt-1">
              {report.category}
            </h3>
            <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#1769E8]" />
              {report.locationName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Photo Evidence if uploaded */}
          {report.photoUrl && (
            <div>
              <h4 className="text-xs font-bold text-[#172B45] uppercase tracking-wider mb-2">
                Citizen Photo Evidence
              </h4>
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 max-h-56">
                <img
                  src={report.photoUrl}
                  alt={report.category}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-white">
                  Proof Captured · {new Date(report.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          )}

          {/* Report Description & Vehicle Plate */}
          <div className="bg-[#F4F7FB] p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
            <div className="font-bold text-[#172B45] flex items-center justify-between">
              <span>Incident Details</span>
              {report.vehicleRegistration && (
                <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-[#1769E8] font-black">
                  Plate: {report.vehicleRegistration}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{report.description}</p>
            <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" /> Reporter: {report.reporterName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" /> Filed:{' '}
                {new Date(report.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </span>
            </div>
          </div>

          {/* Linked Challan Badge */}
          {report.linkedChallanId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-900">
                    Linked E-Challan: {report.linkedChallanId}
                  </span>
                  <p className="text-[10px] text-emerald-700">Digital fine notice issued.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedChallanId(report.linkedChallanId!);
                  setActiveTab('echallans');
                  onClose();
                }}
                className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                View Challan
              </button>
            </div>
          )}

          {/* Status Timeline History */}
          <div>
            <h4 className="text-xs font-bold text-[#172B45] uppercase tracking-wider mb-2">
              Official Status Audit Trail
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-gray-200 ml-2">
              {report.statusHistory.map((hist, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-[#1769E8] border-2 border-white shadow-sm" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172B45] capitalize">
                      {hist.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(hist.timestamp).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">By {hist.actor}</div>
                  {hist.note && (
                    <div className="mt-1 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">
                      "{hist.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Police Decision Controls (Restricted to Police Role) */}
          {currentRole === 'police' && (
            <div className="pt-4 border-t border-gray-200 space-y-3 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#071D38]">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Officer Decision & Enforcement Actions</span>
              </div>

              {!showStatusConfirm ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedNewStatus('under_review');
                      setShowStatusConfirm(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNewStatus('verified');
                      setShowStatusConfirm(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Verify Violation
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNewStatus('resolved');
                      setShowStatusConfirm(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Resolve Incident
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNewStatus('rejected');
                      setShowStatusConfirm(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Reject Report
                  </button>
                  {onIssueChallan && (
                    <button
                      onClick={() => onIssueChallan(report)}
                      className="py-1.5 px-3 rounded-lg bg-[#071D38] hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm ml-auto"
                    >
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      Issue E-Challan
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-[#172B45]">
                    Confirm Status Change to{' '}
                    <span className="text-[#1769E8] uppercase">{selectedNewStatus}</span>
                  </div>
                  <textarea
                    placeholder="Enter official officer verification remarks or dispatch notes (mandatory for audit)..."
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1769E8]"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowStatusConfirm(false)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateStatus}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#1769E8] text-white font-bold hover:bg-blue-700"
                    >
                      Confirm Decision
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
