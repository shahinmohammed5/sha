import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportCategory, IncidentReport } from '../types';
import {
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldAlert,
  Car,
  FileCheck,
  Info,
} from 'lucide-react';

export const CitizenReportPage: React.FC = () => {
  const { submitIncidentReport, currentUser, setActiveTab, setSelectedReportId } = useApp();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<ReportCategory>('Illegal Parking');
  const [description, setDescription] = useState<string>('');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('Rue Dumas, White Town, near French Consulate');
  const [lat, setLat] = useState<number>(11.9325);
  const [lng, setLng] = useState<number>(79.8340);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>(currentUser.name);
  const [reporterPhone, setReporterPhone] = useState<string>(currentUser.phone || '+91 98941 55210');
  const [goodFaithConsent, setGoodFaithConsent] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  // Quick preset sample violation photos for easy hackathon presentation
  const SAMPLE_PHOTOS = [
    {
      title: 'Illegal Parking on Footpath',
      url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Helmetless Two-Wheeler',
      url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Lorry Road Obstruction',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Quick Puducherry location presets
  const LOCATION_PRESETS = [
    { name: 'Rue Dumas, White Town, near French Consulate', lat: 11.9325, lng: 79.834 },
    { name: 'JN Street corner, near Goubert Market', lat: 11.936, lng: 79.8295 },
    { name: 'Beach Road Promenade, Gandhi Statue', lat: 11.9328, lng: 79.8358 },
    { name: 'Maraimalai Adigal Salai, Bus Stand', lat: 11.9288, lng: 79.8142 },
    { name: 'Indira Gandhi Square, Puducherry', lat: 11.9338, lng: 79.8185 },
    { name: 'Mission Street & Cathedral Cross', lat: 11.9342, lng: 79.8315 },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a detailed description (at least 10 characters).');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!locationName.trim()) {
      setError('Please enter or select a street or landmark in Puducherry.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodFaithConsent) {
      setError('Please confirm the good faith declaration to submit this report.');
      return;
    }

    const newReport = submitIncidentReport({
      category,
      description: description.trim(),
      locationName: locationName.trim(),
      lat,
      lng,
      photoUrl: photoUrl || undefined,
      vehicleRegistration: vehicleRegistration.trim() || undefined,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
    });

    setSubmittedReport(newReport);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[#1769E8] font-bold">
          Citizen Traffic Vigilance Portal
        </div>
        <h1 className="text-2xl font-black text-[#172B45] font-heading">
          Report a Traffic Violation
        </h1>
        <p className="text-xs text-[#6B7B90] mt-0.5">
          Submit photo evidence and street location for Puducherry Traffic Police verification and digital e-challan action.
        </p>
      </div>

      {submittedReport ? (
        /* Submission Success Screen */
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[#172B45] font-heading">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Your traffic violation report has been registered in the Puducherry Traffic Police control system.
            </p>
          </div>

          {/* Report Summary Card */}
          <div className="bg-[#F4F7FB] border border-gray-200 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="text-xs text-gray-500">Incident Reference ID</span>
              <span className="font-mono font-black text-sm text-[#1769E8]">
                {submittedReport.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Category:</span>
                <span className="font-bold text-[#172B45]">{submittedReport.category}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Location:</span>
                <span className="font-semibold text-gray-800">{submittedReport.locationName}</span>
              </div>
              {submittedReport.vehicleRegistration && (
                <div>
                  <span className="text-gray-500 block">Identified Plate:</span>
                  <span className="font-mono font-bold text-[#1769E8]">
                    {submittedReport.vehicleRegistration}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500 block">Current Status:</span>
                <span className="font-bold text-amber-600 uppercase">
                  {submittedReport.status}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500">
              Assigned to Traffic Police Control Room for officer verification. You will receive real-time updates in your portal.
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setSelectedReportId(submittedReport.id);
                setActiveTab('my_reports');
              }}
              className="py-2.5 px-5 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Track in My Reports
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setStep(1);
                setDescription('');
                setVehicleRegistration('');
                setPhotoUrl('');
              }}
              className="py-2.5 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Form */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Progress Indicator */}
          <div className="grid grid-cols-3 border-b border-gray-200 bg-[#F4F7FB]/50 text-xs font-bold text-center">
            <div
              className={`p-3.5 border-b-2 transition-all flex items-center justify-center gap-2 ${
                step === 1
                  ? 'border-[#1769E8] text-[#1769E8] bg-white'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1769E8] flex items-center justify-center text-[11px]">
                1
              </span>
              Violation Details
            </div>
            <div
              className={`p-3.5 border-b-2 transition-all flex items-center justify-center gap-2 ${
                step === 2
                  ? 'border-[#1769E8] text-[#1769E8] bg-white'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1769E8] flex items-center justify-center text-[11px]">
                2
              </span>
              Location in City
            </div>
            <div
              className={`p-3.5 border-b-2 transition-all flex items-center justify-center gap-2 ${
                step === 3
                  ? 'border-[#1769E8] text-[#1769E8] bg-white'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1769E8] flex items-center justify-center text-[11px]">
                3
              </span>
              Evidence & Submit
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Details */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-2">
                    Select Traffic Offence Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      'Illegal Parking',
                      'Helmetless Riding',
                      'Traffic Obstruction',
                      'Signal Violation',
                      'Speeding',
                      'Wrong-Side Driving',
                      'Triple Riding',
                      'Other',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat as ReportCategory)}
                        className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                          category === cat
                            ? 'border-[#1769E8] bg-blue-50/70 text-[#1769E8] ring-2 ring-[#1769E8]/20'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Describe the Violation <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific details such as vehicle behavior, exact footpath obstruction, hazard to pedestrians..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-3 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]/30 focus:border-[#1769E8]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Minimum 10 characters. Please avoid defamatory or abusive language.
                  </span>
                </div>

                {/* Optional Vehicle Plate */}
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Vehicle Registration Number (Optional if visible)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. PY-01-BK-4092 or TN-07-EA-9912"
                      value={vehicleRegistration}
                      onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
                      className="w-full max-w-sm uppercase font-mono font-bold bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                    />
                    <button
                      type="button"
                      onClick={() => setVehicleRegistration('PY-01-BK-4092')}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 text-xs font-medium shrink-0"
                    >
                      Fill Sample Plate
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                  >
                    Next: Location
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Street / Landmark in Puducherry <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter street name, junction, or landmark..."
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                </div>

                {/* Quick Presets for Puducherry */}
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-2">
                    Quick Landmark Presets:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LOCATION_PRESETS.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setLocationName(loc.name);
                          setLat(loc.lat);
                          setLng(loc.lng);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                          locationName === loc.name
                            ? 'border-[#1769E8] bg-blue-50 text-[#1769E8] font-bold'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#1769E8] shrink-0" />
                        <span className="truncate">{loc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* GPS Coordinates preview */}
                <div className="bg-[#F4F7FB] p-3 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                  <span className="text-gray-500">Puducherry GIS Geotag:</span>
                  <span className="font-mono text-gray-800 font-semibold">
                    Lat: {lat.toFixed(4)}° N, Lng: {lng.toFixed(4)}° E
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                  >
                    Next: Photo Evidence
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Photo Evidence & Review */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                {/* Photo Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-[#172B45] mb-1">
                    Upload Supporting Photograph (Optional for demo)
                  </label>

                  {photoUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-w-md bg-gray-900">
                      <img src={photoUrl} alt="Evidence preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-lg text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="border-2 border-dashed border-gray-300 hover:border-[#1769E8] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#F4F7FB]/50 hover:bg-blue-50/20 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs font-bold text-[#172B45]">
                          Click to upload evidence photo
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">
                          PNG, JPG, or WEBP up to 5 MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Quick demo photos picker */}
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 block mb-1">
                          Or select sample demo proof photo:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {SAMPLE_PHOTOS.map((sample, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPhotoUrl(sample.url)}
                              className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 text-gray-700 flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#1769E8]" />
                              {sample.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reporter Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#172B45] mb-1">
                      Reporter Name
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#172B45] mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#172B45]"
                    />
                  </div>
                </div>

                {/* Review Summary Box */}
                <div className="bg-[#F4F7FB] p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="font-bold text-[#172B45] text-xs uppercase tracking-wider mb-1">
                    Report Summary Preview
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-600">
                    <div>
                      Category: <span className="font-bold text-[#172B45]">{category}</span>
                    </div>
                    <div>
                      Plate:{' '}
                      <span className="font-mono font-bold text-[#1769E8]">
                        {vehicleRegistration || 'Not recorded'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      Location: <span className="font-semibold text-gray-800">{locationName}</span>
                    </div>
                  </div>
                </div>

                {/* Good Faith Consent */}
                <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={goodFaithConsent}
                    onChange={(e) => setGoodFaithConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#1769E8] focus:ring-[#1769E8]"
                  />
                  <span>
                    I confirm that this report is submitted in good faith for public traffic safety.
                    False or misleading reports are liable under Indian law.
                  </span>
                </label>

                {/* Bottom Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <FileCheck className="w-4 h-4" />
                    Submit Violation Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
