import React from 'react';
import { EChallan } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle, ShieldAlert, QrCode, AlertCircle } from 'lucide-react';

interface ChallanReceiptModalProps {
  challan: EChallan;
  onClose: () => void;
}

export const ChallanReceiptModal: React.FC<ChallanReceiptModalProps> = ({ challan, onClose }) => {
  const { updateChallanPayment, currentRole } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[95vh]">
        {/* Modal Controls Top Bar (Hidden in Print) */}
        <div className="p-3 bg-gray-900 text-white flex items-center justify-between no-print">
          <span className="text-xs font-bold text-gray-300">
            E-Challan Official Notice Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1 px-3 rounded-lg bg-[#1769E8] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Challan Document */}
        <div id="printable-challan" className="p-6 sm:p-8 overflow-y-auto space-y-5 bg-white text-[#172B45]">
          {/* Header & Emblem */}
          <div className="text-center border-b-2 border-[#071D38] pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#071D38] text-white mb-2 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#071D38]">
              Government of Puducherry
            </h2>
            <h3 className="text-xs font-bold uppercase text-[#1769E8]">
              Puducherry Traffic Police Department
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Traffic Enforcement & Smart City Digital E-Challan Notice
            </p>
          </div>

          {/* Demonstration Notice Watermark Badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-[10px] text-amber-800 font-medium">
            ⚠️ OFFICIAL DEMONSTRATION RECORD — Puducherry SmartCity Hackathon Portal
          </div>

          {/* Challan Metadata Bar */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Challan Number</span>
              <span className="font-mono font-black text-sm text-[#071D38]">{challan.id}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block text-[10px] uppercase font-bold">Status</span>
              <span
                className={`font-bold uppercase text-xs px-2 py-0.5 rounded-full ${
                  challan.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : challan.paymentStatus === 'cancelled'
                    ? 'bg-gray-100 text-gray-700 line-through'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {challan.paymentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Offence Details Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-2.5 bg-gray-50 border-b border-gray-200 font-bold text-gray-600">
              <span>Field</span>
              <span className="col-span-2">Recorded Information</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Vehicle Reg No:</span>
              <span className="col-span-2 font-mono font-extrabold text-[#1769E8] text-sm">
                {challan.vehicleRegistration}
              </span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Offence Category:</span>
              <span className="col-span-2 font-bold text-rose-700">{challan.offenceCategory}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Location:</span>
              <span className="col-span-2 font-medium">{challan.location}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Date & Time:</span>
              <span className="col-span-2">
                {new Date(challan.offenceTime).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                })}
              </span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Issuing Officer:</span>
              <span className="col-span-2 font-medium">
                {challan.officerName} ({challan.officerBadge})
              </span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-rose-50/50">
              <span className="text-rose-900 font-bold">Penalty Fine:</span>
              <span className="col-span-2 font-black text-rose-700 text-base">
                ₹{challan.fineAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Description of Violation */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-500 font-bold block mb-1">Violation Details:</span>
            <p className="text-gray-700 leading-relaxed">{challan.offenceDescription}</p>
          </div>

          {/* QR Code and Payment Instructions */}
          <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50 text-xs">
            <div className="p-2 bg-white rounded-lg border border-gray-200 shrink-0">
              <QrCode className="w-14 h-14 text-[#071D38]" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-[#172B45]">Digital Payment Portal</div>
              <p className="text-[11px] text-gray-500 leading-tight">
                Scan via UPI / Bharat BillPay or visit{' '}
                <span className="font-mono text-[#1769E8]">echallan.puducherry.gov.in</span>
              </p>
              <div className="text-[10px] text-gray-400">
                Mandatory payment within 90 days under Motor Vehicles Act, 1988.
              </div>
            </div>
          </div>

          {/* Action Row for Demo */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 no-print">
            {challan.paymentStatus === 'pending_payment' ? (
              <button
                onClick={() => updateChallanPayment(challan.id, 'paid')}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Simulate Payment (Mark as Paid)
              </button>
            ) : (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Settlement Completed
              </span>
            )}

            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
