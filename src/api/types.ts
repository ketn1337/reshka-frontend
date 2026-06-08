// Зеркало Go-структур, отдаваемых API.

export type BookingStatus =
  | 'new'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type BookingSource = 'direct' | 'site' | 'ota' | 'phone' | 'max';

export type UserRole = 'admin' | 'manager' | 'receptionist';

export type RoomOrientation = 'inner' | 'street' | 'courtyard';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface Property {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  address: string;
  description?: string;
  accent?: string;
}

export interface RoomKind {
  id: number;
  propertyId: number;
  slug: string;
  title: string;
  description?: string;
  baseRate: number;
  capacity: number;
  area: number;
  beds: string;
}

export interface Photo {
  id: number;
  roomId: number;
  filename: string;
  url: string;
  position: number;
  isCover: boolean;
}

export interface Room {
  id: number;
  propertyId: number;
  propertyTitle?: string;
  propertySlug?: string;
  kindId: number;
  kindTitle?: string;
  kindSlug?: string;
  label: string;
  shortLabel: string;
  floor: number;
  side?: string;
  area?: number;
  orientation?: RoomOrientation;
  photos: Photo[];
}

export interface Guest {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  docType?: string;
  docNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface StatusEvent {
  fromStatus?: string;
  toStatus: string;
  reason?: string;
  changedBy?: number;
  changedAt: string;
}

export interface Booking {
  id: number;
  code: string;
  roomId: number;
  roomLabel?: string;
  propertyId?: number;
  propertyTitle?: string;
  guestId?: number;
  guest?: Guest;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;  // "HH:MM"
  checkOutTime?: string; // "HH:MM"
  nights?: number;
  adults: number;
  status: BookingStatus;
  source: BookingSource;
  totalAmount: number;
  prepayment: number;
  notes?: string;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  history?: StatusEvent[];
}

export interface ChessboardBar {
  bookingId: number;
  roomId: number;
  code: string;
  startISO: string; // "2026-06-15T14:00:00+10:00"
  endISO: string;   // "2026-06-17T12:00:00+10:00"
  nights: number;
  status: BookingStatus;
  guestName: string;
  adults: number;
  source: BookingSource;
  totalAmount: number;
}

export interface ChessboardResult {
  rooms: Room[];
  days: string[];
  bookings: ChessboardBar[];
}

export interface Rate {
  id: number;
  kindId: number;
  dateFrom: string;
  dateTo: string;
  weekdayRate: number;
  weekendRate: number;
}

export interface AvailabilityRoom {
  room: Room;
  kind: RoomKind;
  available: boolean;
  total: number;
}

export interface ApiError {
  code: string;
  message: string;
}
