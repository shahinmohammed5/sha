import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  ParkingZone,
  Reservation,
  IncidentReport,
  EChallan,
  VehicleRecord,
  AuditLog,
  NotificationItem,
  ReportStatus,
  ReportCategory,
  VehicleType,
  ChallanStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PARKING_ZONES,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_RESERVATIONS,
  INITIAL_ECHALLANS,
  VEHICLE_DATABASE,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  loginUser: (role: UserRole, customUser?: Partial<User>) => void;
  logoutUser: () => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedParkingZoneId: string | null;
  setSelectedParkingZoneId: (id: string | null) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  selectedChallanId: string | null;
  setSelectedChallanId: (id: string | null) => void;

  // Parking & Reservations
  parkingZones: ParkingZone[];
  reservations: Reservation[];
  createReservation: (data: {
    parkingZoneId: string;
    vehicleType: VehicleType;
    vehicleRegistration: string;
    startTime: string;
    durationHours: number;
  }) => { success: boolean; reservation?: Reservation; error?: string };
  cancelReservation: (id: string) => boolean;

  // Incident Reports
  incidentReports: IncidentReport[];
  submitIncidentReport: (data: {
    category: ReportCategory;
    description: string;
    locationName: string;
    lat: number;
    lng: number;
    photoUrl?: string;
    vehicleRegistration?: string;
    reporterName?: string;
    reporterPhone?: string;
  }) => IncidentReport;
  updateReportStatus: (
    reportId: string,
    newStatus: ReportStatus,
    officerNote?: string
  ) => boolean;

  // E-Challans
  eChallans: EChallan[];
  issueChallan: (data: {
    vehicleRegistration: string;
    incidentReportId?: string;
    offenceCategory: ReportCategory;
    offenceDescription: string;
    location: string;
    fineAmount: number;
  }) => EChallan;
  updateChallanPayment: (challanId: string, status: ChallanStatus) => boolean;
  cancelChallan: (challanId: string, reason: string) => boolean;

  // Vehicle Database
  vehicleDatabase: Record<string, VehicleRecord>;
  searchVehicleRecord: (regNumber: string) => VehicleRecord | null;

  // Audit Logs & Notifications
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;

  // Demo Reset
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  USER: 'smartcity_py_user',
  PARKING: 'smartcity_py_parking',
  RESERVATIONS: 'smartcity_py_reservations',
  REPORTS: 'smartcity_py_reports',
  CHALLANS: 'smartcity_py_challans',
  AUDIT: 'smartcity_py_audit',
  NOTIFICATIONS: 'smartcity_py_notifications',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Current User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_USERS[1]; // Arun Kumar (Citizen) default for rich initial view
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedParkingZoneId, setSelectedParkingZoneId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedChallanId, setSelectedChallanId] = useState<string | null>(null);

  // 2. Parking Zones
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARKING);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_PARKING_ZONES;
  });

  // 3. Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_RESERVATIONS;
  });

  // 4. Incident Reports
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_INCIDENT_REPORTS;
  });

  // 5. E-Challans
  const [eChallans, setEChallans] = useState<EChallan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHALLANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_ECHALLANS;
  });

  // 6. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'notif-1',
        title: 'Report Under Review',
        message: 'Your report PY-REP-2026-8941 is now assigned to Inspector Vijayaraghavan.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'info',
        read: false,
        linkTab: 'my_reports',
      },
      {
        id: 'notif-2',
        title: 'Parking Reservation Active',
        message: 'Your reservation for JN Street Plaza is now active until 12:00 PM.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'success',
        read: false,
        linkTab: 'my_reservations',
      },
    ];
  });

  // 8. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) { console.warn(e); }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify(parkingZones));
    } catch (e) { console.warn(e); }
  }, [parkingZones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) { console.warn(e); }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(incidentReports));
    } catch (e) { console.warn(e); }
  }, [incidentReports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLANS, JSON.stringify(eChallans));
    } catch (e) { console.warn(e); }
  }, [eChallans]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
    } catch (e) { console.warn(e); }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) { console.warn(e); }
  }, [notifications]);

  // Toast helper
  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'danger' = 'info'
  ) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User management
  const setCurrentRole = (role: UserRole) => {
    if (role === 'police') {
      setCurrentUser(INITIAL_USERS[0]);
    } else if (role === 'citizen') {
      setCurrentUser(INITIAL_USERS[1]);
    } else {
      setCurrentUser(INITIAL_USERS[2]);
    }
    addToast('Role Switched', `Switched view to ${role.toUpperCase()} profile.`, 'info');
  };

  const loginUser = (role: UserRole, customUser?: Partial<User>) => {
    let base = role === 'police' ? INITIAL_USERS[0] : role === 'citizen' ? INITIAL_USERS[1] : INITIAL_USERS[2];
    if (customUser) {
      base = { ...base, ...customUser, role };
    }
    setCurrentUser(base);
    addToast('Signed In', `Welcome back, ${base.name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(INITIAL_USERS[2]); // Revert to guest driver
    addToast('Signed Out', 'You have been switched to visitor mode.', 'info');
  };

  // Reservation workflow
  const createReservation = ({
    parkingZoneId,
    vehicleType,
    vehicleRegistration,
    startTime,
    durationHours,
  }: {
    parkingZoneId: string;
    vehicleType: VehicleType;
    vehicleRegistration: string;
    startTime: string;
    durationHours: number;
  }) => {
    const zone = parkingZones.find((z) => z.id === parkingZoneId);
    if (!zone) {
      return { success: false, error: 'Parking zone not found.' };
    }

    const typeConfig = vehicleType === 'two_wheeler' ? zone.twoWheelerSlots : zone.fourWheelerSlots;
    if (typeConfig.available <= 0 || zone.availableSlots <= 0) {
      return { success: false, error: `No available slots for ${vehicleType === 'two_wheeler' ? 'two-wheelers' : 'four-wheelers'} at ${zone.name}.` };
    }

    // Calculate dates
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationHours * 3600000);
    const totalAmount = typeConfig.hourlyRate * durationHours;
    const slotNumber = vehicleType === 'two_wheeler' ? `2W-${Math.floor(Math.random() * 50) + 1}` : `4W-${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(Math.random() * 30) + 1}`;
    const reservationId = `RES-PY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation: Reservation = {
      id: reservationId,
      userId: currentUser.id,
      userName: currentUser.name,
      parkingZoneId: zone.id,
      parkingZoneName: zone.name,
      parkingAddress: zone.address,
      vehicleType,
      vehicleRegistration: vehicleRegistration.toUpperCase().trim(),
      startTime: start.toISOString(),
      durationHours,
      endTime: end.toISOString(),
      hourlyRate: typeConfig.hourlyRate,
      totalAmount,
      slotNumber,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      qrCodeData: `SMARTCITY-RES-${reservationId}-${vehicleRegistration.toUpperCase().trim()}`,
    };

    // Decrement slots safely
    setParkingZones((prev) =>
      prev.map((pz) => {
        if (pz.id !== zone.id) return pz;
        const newAvailable = Math.max(0, pz.availableSlots - 1);
        if (vehicleType === 'two_wheeler') {
          return {
            ...pz,
            availableSlots: newAvailable,
            twoWheelerSlots: {
              ...pz.twoWheelerSlots,
              available: Math.max(0, pz.twoWheelerSlots.available - 1),
            },
          };
        } else {
          return {
            ...pz,
            availableSlots: newAvailable,
            fourWheelerSlots: {
              ...pz.fourWheelerSlots,
              available: Math.max(0, pz.fourWheelerSlots.available - 1),
            },
          };
        }
      })
    );

    setReservations((prev) => [newReservation, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Parking Slot Reserved',
      message: `Confirmed slot ${slotNumber} at ${zone.name} (₹${totalAmount}).`,
      timestamp: new Date().toISOString(),
      type: 'success',
      read: false,
      linkTab: 'my_reservations',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Reservation Confirmed', `Slot ${slotNumber} booked successfully at ${zone.name}!`, 'success');
    return { success: true, reservation: newReservation };
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res || res.status === 'cancelled') return false;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );

    // Release slot back
    setParkingZones((prev) =>
      prev.map((pz) => {
        if (pz.id !== res.parkingZoneId) return pz;
        const newAvailable = Math.min(pz.totalSlots, pz.availableSlots + 1);
        if (res.vehicleType === 'two_wheeler') {
          return {
            ...pz,
            availableSlots: newAvailable,
            twoWheelerSlots: {
              ...pz.twoWheelerSlots,
              available: Math.min(pz.twoWheelerSlots.total, pz.twoWheelerSlots.available + 1),
            },
          };
        } else {
          return {
            ...pz,
            availableSlots: newAvailable,
            fourWheelerSlots: {
              ...pz.fourWheelerSlots,
              available: Math.min(pz.fourWheelerSlots.total, pz.fourWheelerSlots.available + 1),
            },
          };
        }
      })
    );

    addToast('Reservation Cancelled', `Booking ${id} was cancelled and slot released.`, 'info');
    return true;
  };

  // Incident Reports
  const submitIncidentReport = ({
    category,
    description,
    locationName,
    lat,
    lng,
    photoUrl,
    vehicleRegistration,
    reporterName,
    reporterPhone,
  }: {
    category: ReportCategory;
    description: string;
    locationName: string;
    lat: number;
    lng: number;
    photoUrl?: string;
    vehicleRegistration?: string;
    reporterName?: string;
    reporterPhone?: string;
  }) => {
    const reportId = `PY-REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newReport: IncidentReport = {
      id: reportId,
      reporterId: currentUser.id,
      reporterName: reporterName || currentUser.name || 'Anonymous Citizen',
      reporterPhone: reporterPhone || currentUser.phone,
      category,
      description,
      locationName,
      lat,
      lng,
      photoUrl,
      vehicleRegistration: vehicleRegistration ? vehicleRegistration.toUpperCase().trim() : undefined,
      status: 'submitted',
      statusHistory: [
        {
          status: 'submitted',
          timestamp: now,
          actor: reporterName || currentUser.name,
          note: 'Report registered in Puducherry SmartCity portal.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setIncidentReports((prev) => [newReport, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'log-' + Date.now(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'SUBMITTED_REPORT',
      entityType: 'report',
      entityId: reportId,
      timestamp: now,
      details: `Citizen submitted traffic report for ${category} at ${locationName}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast('Report Submitted', `Incident ${reportId} has been filed for traffic police review.`, 'success');
    return newReport;
  };

  const updateReportStatus = (
    reportId: string,
    newStatus: ReportStatus,
    officerNote?: string
  ) => {
    const target = incidentReports.find((r) => r.id === reportId);
    if (!target) return false;

    const now = new Date().toISOString();
    const historyItem = {
      status: newStatus,
      timestamp: now,
      actor: currentUser.name,
      note: officerNote,
    };

    setIncidentReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          status: newStatus,
          assignedOfficerId: currentUser.id,
          assignedOfficerName: currentUser.name,
          officerNotes: officerNote ? (r.officerNotes ? `${r.officerNotes} | ${officerNote}` : officerNote) : r.officerNotes,
          updatedAt: now,
          statusHistory: [...r.statusHistory, historyItem],
        };
      })
    );

    // Audit log
    const audit: AuditLog = {
      id: 'log-' + Date.now(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `REPORT_STATUS_${newStatus.toUpperCase()}`,
      entityType: 'report',
      entityId: reportId,
      timestamp: now,
      details: `Officer updated incident status to ${newStatus}. Note: ${officerNote || 'None'}`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast('Status Updated', `Report ${reportId} status set to "${newStatus.replace('_', ' ')}".`, 'info');
    return true;
  };

  // E-Challans
  const issueChallan = ({
    vehicleRegistration,
    incidentReportId,
    offenceCategory,
    offenceDescription,
    location,
    fineAmount,
  }: {
    vehicleRegistration: string;
    incidentReportId?: string;
    offenceCategory: ReportCategory;
    offenceDescription: string;
    location: string;
    fineAmount: number;
  }) => {
    const challanId = `ECH-PY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const cleanReg = vehicleRegistration.toUpperCase().trim();

    const newChallan: EChallan = {
      id: challanId,
      vehicleRegistration: cleanReg,
      incidentReportId,
      offenceCategory,
      offenceDescription,
      location,
      offenceTime: now,
      officerId: currentUser.id,
      officerName: currentUser.name,
      officerBadge: currentUser.badgeNumber || 'PY-TP-402',
      fineAmount,
      paymentStatus: 'pending_payment',
      issuedAt: now,
    };

    setEChallans((prev) => [newChallan, ...prev]);

    // Link back to incident report if exists
    if (incidentReportId) {
      setIncidentReports((prev) =>
        prev.map((r) =>
          r.id === incidentReportId
            ? {
                ...r,
                status: 'resolved',
                linkedChallanId: challanId,
                statusHistory: [
                  ...r.statusHistory,
                  {
                    status: 'resolved',
                    timestamp: now,
                    actor: currentUser.name,
                    note: `E-Challan ${challanId} issued (Fine ₹${fineAmount}). Incident closed.`,
                  },
                ],
              }
            : r
        )
      );
    }

    // Audit log
    const audit: AuditLog = {
      id: 'log-' + Date.now(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'ISSUED_CHALLAN',
      entityType: 'challan',
      entityId: challanId,
      timestamp: now,
      details: `Issued e-challan ${challanId} for vehicle ${cleanReg} (₹${fineAmount}) by ${currentUser.name}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast('E-Challan Issued', `Digital Challan ${challanId} created for ${cleanReg} (₹${fineAmount}).`, 'success');
    return newChallan;
  };

  const updateChallanPayment = (challanId: string, status: ChallanStatus) => {
    const now = new Date().toISOString();
    setEChallans((prev) =>
      prev.map((ch) =>
        ch.id === challanId
          ? {
              ...ch,
              paymentStatus: status,
              paidAt: status === 'paid' ? now : ch.paidAt,
            }
          : ch
      )
    );
    addToast('Payment Status Updated', `Challan ${challanId} marked as ${status.replace('_', ' ')}.`, 'success');
    return true;
  };

  const cancelChallan = (challanId: string, reason: string) => {
    const now = new Date().toISOString();
    setEChallans((prev) =>
      prev.map((ch) =>
        ch.id === challanId
          ? {
              ...ch,
              paymentStatus: 'cancelled',
              cancelledAt: now,
              cancellationReason: reason,
            }
          : ch
      )
    );

    const audit: AuditLog = {
      id: 'log-' + Date.now(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CANCELLED_CHALLAN',
      entityType: 'challan',
      entityId: challanId,
      timestamp: now,
      details: `Challan ${challanId} was cancelled by ${currentUser.name}. Reason: ${reason}`,
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast('Challan Cancelled', `Challan ${challanId} revoked. Audit note recorded.`, 'warning');
    return true;
  };

  // Vehicle lookup
  const searchVehicleRecord = (regNumber: string): VehicleRecord | null => {
    const clean = regNumber.toUpperCase().trim().replace(/\s+/g, '-');
    // Check known database
    if (VEHICLE_DATABASE[clean]) {
      return VEHICLE_DATABASE[clean];
    }
    // Also try fuzzy normalized
    for (const key of Object.keys(VEHICLE_DATABASE)) {
      if (key.replace(/-/g, '') === clean.replace(/-/g, '')) {
        return VEHICLE_DATABASE[key];
      }
    }
    // Plausible synthetic generator for valid Indian format
    if (clean.length >= 6) {
      return {
        registrationNumber: clean,
        ownerName: 'Registered Citizen (Demo)',
        vehicleClass: clean.includes('PY-05') ? 'Two Wheeler (Motorcycle)' : 'Motor Car (Private)',
        makerModel: 'Demo Vehicle Model 2023',
        registrationDate: '2023-01-15',
        fitnessValidUntil: '2038-01-14',
        insuranceValidUntil: '2027-02-10',
        fuelType: 'Petrol',
        pollutionValidUntil: '2026-11-20',
        registeredRTO: clean.startsWith('PY') ? 'Puducherry RTO' : 'Regional Transport Office',
        blacklisted: false,
        activeViolationsCount: 0,
      };
    }
    return null;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Reset to original demo data
  const resetDemoData = () => {
    localStorage.clear();
    setParkingZones(INITIAL_PARKING_ZONES);
    setReservations(INITIAL_RESERVATIONS);
    setIncidentReports(INITIAL_INCIDENT_REPORTS);
    setEChallans(INITIAL_ECHALLANS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[1]);
    setActiveTab('dashboard');
    addToast('Demo Data Reset', 'Restored all sample parking slots, reports, and challans to initial demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        setCurrentRole,
        loginUser,
        logoutUser,
        activeTab,
        setActiveTab,
        selectedParkingZoneId,
        setSelectedParkingZoneId,
        selectedReportId,
        setSelectedReportId,
        selectedChallanId,
        setSelectedChallanId,
        parkingZones,
        reservations,
        createReservation,
        cancelReservation,
        incidentReports,
        submitIncidentReport,
        updateReportStatus,
        eChallans,
        issueChallan,
        updateChallanPayment,
        cancelChallan,
        vehicleDatabase: VEHICLE_DATABASE,
        searchVehicleRecord,
        auditLogs,
        notifications,
        markNotificationRead,
        clearNotifications,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
