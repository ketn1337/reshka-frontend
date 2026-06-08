import { request } from './client';
import type { Property, Room, RoomKind, AvailabilityRoom } from './types';

export const propertiesApi = {
  list: () => request<{ items: Property[] }>('/api/properties'),
  detail: (slug: string) =>
    request<{ property: Property; kinds: RoomKind[] }>(`/api/properties/${slug}`),
  rooms: (slug: string, kind?: string) =>
    request<{ items: Room[] }>(`/api/properties/${slug}/rooms`, { query: { kind } }),
  room: (id: number) => request<Room>(`/api/rooms/${id}`),
};

export const availabilityApi = {
  search: (params: { property: string; checkIn: string; checkOut: string; kind?: string }) =>
    request<{ items: AvailabilityRoom[] }>('/api/availability', { query: params }),
};
