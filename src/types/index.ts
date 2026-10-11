export type UserRole = 'public' | 'citizen' | 'police';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  badgeNumber?: string; // For police
  station?: string;     // For police
  avatar?: string;
}

export type VehicleType = 'two_wheeler' | 'four_wheeler';

export interface ParkingZone {
  id: string;
  name: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
  totalSlots: number;
  availableSlots: number;
  twoWheelerSlots: {
    total: number;
    available: number;
    hourlyRate: number;
  };
  fourWheelerSlots: {
    total: number;
    available: number;
    hourlyRate: number;
  };
  features: string[]; // e.g. "EV Charging", "CCTV 24/7", "Wheelchair Accessible", "Covered Parking", "Valet"
  operatingHours: string;
  distanceKm?: number;
  isDemo?: boolean;
}

export type ReservationStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  parkingZoneId: string;
  parkingZoneName: string;
  parkingAddress: string;
  vehicleType: VehicleType;
  vehicleRegistration: string;
  startTime: string; // ISO string
  durationHours: number;
  endTime: string;   // ISO string
  hourlyRate: number;
  totalAmount: number;
  slotNumber: string;
  status: ReservationStatus;
  createdAt: string;
  qrCodeData?: string;
}

export type ReportCategory =
  | 'Illegal Parking'
  | 'Helmetless Riding'
  | 'Traffic Obstruction'
  | 'Signal Violation'
  | 'Speeding'
  | 'Wrong-Side Driving'
  | 'Triple Riding'
  | 'Other';

export type ReportStatus = 'submitted' | 'under_review' | 'verified' | 'resolved' | 'rejected';

export interface StatusHistoryItem {
  status: ReportStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface IncidentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterPhone?: string;
  category: ReportCategory;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  vehicleRegistration?: string;
  status: ReportStatus;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  officerNotes?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  linkedChallanId?: string;
}

export type ChallanStatus = 'issued' | 'pending_payment' | 'paid' | 'cancelled';

export interface EChallan {
  id: string; // e.g. ECH-PY-2026-0042
  vehicleRegistration: string;
  incidentReportId?: string;
  offenceCategory: ReportCategory;
  offenceDescription: string;
  location: string;
  offenceTime: string;
  officerId: string;
  officerName: string;
  officerBadge: string;
  fineAmount: number;
  paymentStatus: ChallanStatus;
  issuedAt: string;
  paidAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  challanPdfUrl?: string;
}

export interface VehicleRecord {
  registrationNumber: string;
  ownerName: string;
  vehicleClass: string; // e.g. "Two Wheeler (Scooter)", "Motor Car (Private)"
  makerModel: string;   // e.g. "Honda Activa 6G", "Hyundai Creta"
  registrationDate: string;
  fitnessValidUntil: string;
  insuranceValidUntil: string;
  fuelType: string;
  pollutionValidUntil: string;
  registeredRTO: string; // e.g. "Puducherry RTO (PY-01)"
  blacklisted: boolean;
  activeViolationsCount: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'report' | 'challan' | 'reservation' | 'parking';
  entityId: string;
  timestamp: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  linkTab?: string;
}
