import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportDetailsModal } from '../components/reports/ReportDetailsModal';
import { IncidentReport, ReportStatus } from '../types';
import {
  FileText,
  Search,
  Filter,
  AlertTriangle,
  PlusCircle,
  MapPin,
  Clock,
  ArrowRight,
  Receipt,
  CheckCircle,
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { incidentReports, setActiveTab, selectedReportId, setSelectedReportId } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReportModal, setActiveReportModal] = useState<IncidentReport | null>(null);

  // If selectedReportId was set from elsewhere, trigger modal
  React.useEffect(() => {
    if (selectedReportId) {
      const target = incidentReports.find((r) => r.id === selectedReportId);
      if (target) {
        setActiveReportModal(target);
        setSelectedReportId(null);
      }
    }
  }, [selectedReportId, incidentReports]);

  const filteredReports = incidentReports.filter((rep) => {
    const matchesSearch =
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.vehicleRegistration &&
        rep.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    return rep.status === statusFilter;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
            Submitted
          </span>
        );
      case 'under_review':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
            Under Review
          </span>
        );
      case 'verified':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold uppercase tracking-wider">
            Verified
          </span>
        );
      case 'resolved':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">
            Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase tracking-wider">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
            Citizen Vigilance
          </div>
          <h1 className="text-2xl font-black text-[#172B45] font-heading">
            My Submitted Traffic Reports
          </h1>
          <p className="text-xs text-[#6B7B90] mt-0.5">
            Track police verification status, officer notes, and digital e-challan outcomes.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report_issue')}
          className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Another Issue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by report ID (e.g. PY-REP), offence category, street, or license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F7FB] border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['all', 'submitted', 'under_review', 'verified', 'resolved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition-all ${
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

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-[#172B45]">No reports found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not submitted any reports matching this status filter. Help keep Puducherry roads safe by reporting obstructions.
          </p>
          <button
            onClick={() => setActiveTab('report_issue')}
            className="mt-2 py-2 px-4 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700"
          >
            File a Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setActiveReportModal(report)}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#1769E8]">
                    {report.id}
                  </span>
                  {getStatusBadge(report.status)}
                </div>

                <h3 className="font-extrabold text-base text-[#172B45] font-heading group-hover:text-[#1769E8] transition-colors">
                  {report.category}
                </h3>

                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1769E8] shrink-0" />
                  <span className="truncate">{report.locationName}</span>
                </p>

                <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                  {report.description}
                </p>

                {/* Evidence Photo Preview Thumbnail if present */}
                {report.photoUrl && (
                  <div className="mt-3 relative rounded-xl overflow-hidden h-28 border border-gray-100 bg-gray-100">
                    <img
                      src={report.photoUrl}
                      alt={report.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-medium">
                      Photo Evidence Attached
                    </div>
                  </div>
                )}

                {/* Linked Challan Notice */}
                {report.linkedChallanId && (
                  <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold">
                      Challan Issued: {report.linkedChallanId}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[#1769E8] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Timeline <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {activeReportModal && (
        <ReportDetailsModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
        />
      )}
    </div>
  );
};
