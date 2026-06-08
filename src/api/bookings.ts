import { request } from './client';
import type { Booking, BookingStatus, BookingSource, ChessboardResult, Guest, Rate, Room, User } from './types';

// =========================
// Public
// =========================
export const publicBookingsApi = {
  create: (input: CreateBookingInput) =>
    request<Booking>('/api/public/bookings', { method: 'POST', body: input }),
};

// =========================
// Admin
// =========================
export const bookingsApi = {
  list: (params: BookingListParams = {}) =>
    request<{ items: Booking[] }>('/api/admin/bookings', { query: params as Record<string, string> }),

  detail: (id: number) => request<Booking>(`/api/admin/bookings/${id}`),

  create: (input: CreateBookingInput) =>
    request<Booking>('/api/admin/bookings', { method: 'POST', body: input }),

  update: (id: number, patch: UpdateBookingInput) =>
    request<Booking>(`/api/admin/bookings/${id}`, { method: 'PATCH', body: patch }),

  changeStatus: (id: number, to: BookingStatus, reason?: string) =>
    request<Booking>(`/api/admin/bookings/${id}/status`, {
      method: 'POST',
      body: { to, reason },
    }),

  cancel: (id: number) =>
    request<Booking>(`/api/admin/bookings/${id}`, { method: 'DELETE' }),
};

export interface BookingListParams {
  from?: string;
  to?: string;
  property?: string;
  kind?: string;
  status?: BookingStatus;
  q?: string;
}

export interface GuestInput {
  fullName: string;
  phone?: string;
  email?: string;
  docType?: string;
  docNumber?: string;
  notes?: string;
}

export interface CreateBookingInput {
  roomId: number;
  checkIn: string;       // YYYY-MM-DD
  checkOut: string;      // YYYY-MM-DD
  checkInTime?: string;  // "HH:MM" — дефолт 14:00
  checkOutTime?: string; // "HH:MM" — дефолт 12:00
  adults: number;
  source?: BookingSource;
  guestId?: number;
  guest?: GuestInput;
  totalAmount?: number;
  prepayment?: number;
  notes?: string;
}

export interface UpdateBookingInput {
  checkIn?: string;
  checkOut?: string;
  checkInTime?: string;
  checkOutTime?: string;
  adults?: number;
  guestId?: number;
  totalAmount?: number;
  prepayment?: number;
  notes?: string;
}

// =========================
// Chessboard
// =========================
export const chessboardApi = {
  // Показывает все номера обоих объектов. property/kind фильтры убраны по решению пользователя.
  get: (params: { from: string; days?: number }) =>
    request<ChessboardResult>('/api/admin/chessboard', { query: params }),
};

// =========================
// Admin rooms
// =========================
export const adminRoomsApi = {
  list: (params: { property?: string; kind?: string; floor?: number } = {}) =>
    request<{ items: Room[] }>('/api/admin/rooms', { query: params as Record<string, string> }),
  update: (id: number, patch: Record<string, unknown>) =>
    request<Room>(`/api/admin/rooms/${id}`, { method: 'PATCH', body: patch }),
  uploadPhotos: (id: number, files: File[]) => {
    const fd = new FormData();
    for (const f of files) fd.append('file', f, f.name);
    return request<{ items: { id: number; roomId: number; filename: string; url: string }[] }>(
      `/api/admin/rooms/${id}/photos`,
      { method: 'POST', formData: fd },
    );
  },
  deletePhoto: (roomId: number, photoId: number) =>
    request<void>(`/api/admin/rooms/${roomId}/photos/${photoId}`, { method: 'DELETE' }),
};

// =========================
// Guests
// =========================
export const guestsApi = {
  search: (q: string, limit = 20) =>
    request<{ items: Guest[] }>('/api/admin/guests', { query: { q, limit } }),
  create: (input: GuestInput) =>
    request<Guest>('/api/admin/guests', { method: 'POST', body: input }),
  update: (id: number, input: GuestInput) =>
    request<Guest>(`/api/admin/guests/${id}`, { method: 'PATCH', body: input }),
};

// =========================
// Rates
// =========================
export const ratesApi = {
  list: (params: { kindId?: number; property?: string; kind?: string }) =>
    request<{ items: Rate[] }>('/api/admin/rates', { query: params as Record<string, string> }),
  create: (input: Omit<Rate, 'id'>) =>
    request<Rate>('/api/admin/rates', { method: 'POST', body: input }),
  update: (id: number, input: Omit<Rate, 'id'>) =>
    request<Rate>(`/api/admin/rates/${id}`, { method: 'PUT', body: input }),
  remove: (id: number) =>
    request<void>(`/api/admin/rates/${id}`, { method: 'DELETE' }),
};

// =========================
// Users
// =========================
export const usersApi = {
  list: () => request<{ items: User[] }>('/api/admin/users'),
  create: (input: { email: string; password: string; role: User['role']; fullName: string }) =>
    request<User>('/api/admin/users', { method: 'POST', body: input }),
  update: (id: number, patch: { role?: User['role']; fullName?: string; isActive?: boolean; password?: string }) =>
    request<User>(`/api/admin/users/${id}`, { method: 'PATCH', body: patch }),
};
