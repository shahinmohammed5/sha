import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportDetailsModal } from '../components/reports/ReportDetailsModal';
import { IncidentReport, ReportStatus, ReportCategory } from '../types';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Receipt,
  Camera,
  ArrowUpDown,
  Shield,
  Download,
} from 'lucide-react';

export const IncidentManagementPage: React.FC = () => {
  const { incidentReports, updateReportStatus, setActiveTab, setSelectedChallanId } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'category' | 'status'>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [activeReportModal, setActiveReportModal] = useState<IncidentReport | null>(null);

  // Filtering
  const filtered = incidentReports.filter((rep) => {
    const matchesSearch =
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.vehicleRegistration &&
        rep.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && rep.category !== categoryFilter) return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'createdAt') {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortAsc ? diff : -diff;
    }
    if (sortField === 'category') {
      return sortAsc ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
    }
    if (sortField === 'status') {
      return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">Submitted</span>;
      case 'under_review':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">Under Review</span>;
      case 'verified':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">Verified</span>;
      case 'resolved':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">Resolved</span>;
      case 'rejected':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">Rejected</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Traffic Enforcement Bureau</span>
          </div>
          <h1 className="text-2xl font-black text-[#172B45] font-heading">
            Incident Management & Verification
          </h1>
          <p className="text-xs text-[#6B7B90] mt-0.5">
            Review reported traffic violations, verify photographic evidence, and initiate penalties.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('echallans')}
          className="py-2 px-4 rounded-xl bg-[#071D38] hover:bg-navy-900 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          View All E-Challans
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by report ID, street, vehicle plate number, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F7FB] border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45] font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45] font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="Illegal Parking">Illegal Parking</option>
              <option value="Helmetless Riding">Helmetless Riding</option>
              <option value="Traffic Obstruction">Traffic Obstruction</option>
              <option value="Signal Violation">Signal Violation</option>
              <option value="Speeding">Speeding</option>
              <option value="Wrong-Side Driving">Wrong-Side Driving</option>
              <option value="Triple Riding">Triple Riding</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F7FB] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">Report ID</th>
                <th
                  onClick={() => {
                    setSortField('category');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-3.5 cursor-pointer hover:text-gray-900"
                >
                  <div className="flex items-center gap-1">
                    Offence & Description <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Plate No.</th>
                <th
                  onClick={() => {
                    setSortField('status');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-3.5 cursor-pointer hover:text-gray-900"
                >
                  <div className="flex items-center gap-1">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('createdAt');
                    setSortAsc(!sortAsc);
                  }}
                  className="p-3.5 cursor-pointer hover:text-gray-900"
                >
                  <div className="flex items-center gap-1">
                    Reported Time <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No traffic incidents found matching current filters.
                  </td>
                </tr>
              ) : (
                sorted.map((rep) => (
                  <tr
                    key={rep.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => setActiveReportModal(rep)}
                  >
                    <td className="p-3.5 pl-5 font-mono font-bold text-[#1769E8]">
                      {rep.id}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-[#172B45] flex items-center gap-1.5">
                        {rep.category}
                        {rep.photoUrl && (
                          <span title="Evidence Photo Attached">
                            <Camera className="w-3.5 h-3.5 text-purple-600 inline" />
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 truncate text-[11px]">{rep.description}</p>
                    </td>
                    <td className="p-3.5 text-gray-700 max-w-[200px] truncate">
                      {rep.locationName}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-gray-800">
                      {rep.vehicleRegistration || (
                        <span className="text-gray-300 font-normal italic">None</span>
                      )}
                    </td>
                    <td className="p-3.5">{getStatusBadge(rep.status)}</td>
                    <td className="p-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(rep.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReportModal(rep);
                        }}
                        className="py-1 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {activeReportModal && (
        <ReportDetailsModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onIssueChallan={(rep) => {
            setActiveReportModal(null);
            setActiveTab('echallans');
          }}
        />
      )}
    </div>
  );
};
