import { catalogRooms, type CatalogRoom } from './booking';

export type PropertyId = 'alley' | 'pioneer';

export const roomKindLabels = {
  standard: 'Стандарт',
  comfort: 'Комфорт',
} as const;

export type RoomKind = keyof typeof roomKindLabels;

export type RoomUnit = {
  id: string;
  kind: RoomKind;
  label: string;
  shortLabel: string;
  floor: string;
  side: string;
  area: string;
  orientation: string;
};

export type PropertyView = {
  id: PropertyId;
  title: string;
  shortTitle: string;
  description: string;
  accent: string;
  rooms: RoomUnit[];
};

export const roomKindOrder: RoomKind[] = ['standard', 'comfort'];

const comfortRoomsByProperty: Record<PropertyId, number[]> = {
  alley: [3, 13],
  pioneer: [],
};

function getRoomKindForNumber(propertyId: PropertyId, number: number): RoomKind {
  return comfortRoomsByProperty[propertyId].includes(number) ? 'comfort' : 'standard';
}

export function getRoomKindDetail(kind: RoomKind): CatalogRoom {
  return catalogRooms.find((room) => room.title === roomKindLabels[kind]) || catalogRooms[0];
}

function buildRooms({
  propertyId,
  address,
  count,
  roomPrefix = '',
  firstFloor = 1,
}: {
  propertyId: PropertyId;
  address: string;
  count: number;
  roomPrefix?: string;
  firstFloor?: number;
}) {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const floor = firstFloor + Math.floor(index / 5);
    const orientation = index % 3 === 0 ? 'во двор' : index % 3 === 1 ? 'на улицу' : 'на тихую сторону';
    const kind = getRoomKindForNumber(propertyId, number);
    const kindDetail = getRoomKindDetail(kind);

    return {
      id: `${propertyId}-${number}`,
      kind,
      label: `${address} - ${roomPrefix}${number}`,
      shortLabel: `${roomPrefix}${number}`,
      floor: `${floor} этаж`,
      side: index % 2 === 0 ? 'левая линия' : 'правая линия',
      area: kindDetail.area,
      orientation,
    };
  });
}

export const roomProperties: PropertyView[] = [
  {
    id: 'alley',
    title: 'Аллея Труда 21',
    shortTitle: 'Аллея 21',
    description: '13 номеров в компактном корпусе: 11 стандартов и 2 комфорта.',
    accent: '11 Стандарт + 2 Комфорт',
    rooms: buildRooms({
      propertyId: 'alley',
      address: 'Аллея Труда 21',
      count: 13,
      firstFloor: 1,
    }),
  },
  {
    id: 'pioneer',
    title: 'Пионерская 63',
    shortTitle: 'Пионерская 63',
    description: '14 номеров формата Стандарт с отдельной навигацией по корпусу.',
    accent: '14 Стандарт',
    rooms: buildRooms({
      propertyId: 'pioneer',
      address: 'Пионерская 63',
      count: 14,
      roomPrefix: 'О',
      firstFloor: 2,
    }),
  },
];

export function getPropertyById(propertyId: PropertyId) {
  return roomProperties.find((property) => property.id === propertyId) || roomProperties[0];
}

export function getAvailableRoomKinds(property: PropertyView) {
  return roomKindOrder.filter((kind) => property.rooms.some((room) => room.kind === kind));
}

export function getRoomsByKind(property: PropertyView, kind: RoomKind) {
  return property.rooms.filter((room) => room.kind === kind);
}

export function normalizePropertyId(value: string | null): PropertyId | undefined {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return undefined;
  if (normalized === 'alley' || normalized.includes('алле')) return 'alley';
  if (normalized === 'pioneer' || normalized.includes('пионер')) return 'pioneer';

  return undefined;
}

export function normalizeRoomKind(value: string | null): RoomKind | undefined {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return undefined;
  if (normalized === 'comfort' || normalized.includes('комфорт')) return 'comfort';
  if (normalized === 'standard' || normalized.includes('стандарт')) return 'standard';

  return undefined;
}

export function parseRoomViewQuery(search: string) {
  const params = new URLSearchParams(search);

  return {
    propertyId: normalizePropertyId(params.get('address') || params.get('property') || params.get('location')) || 'alley',
    roomKind: normalizeRoomKind(params.get('roomType') || params.get('type')) || 'standard',
    roomId: params.get('room') || '',
  };
}

export function buildRoomViewPath({
  propertyId,
  roomKind,
  roomId,
  checkIn,
  checkOut,
  guests,
}: {
  propertyId: PropertyId;
  roomKind: RoomKind;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const params = new URLSearchParams();

  params.set('address', propertyId);
  params.set('roomType', roomKindLabels[roomKind]);
  if (roomId) params.set('room', roomId);
  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  if (guests) params.set('guests', String(guests));

  return `/room-view?${params.toString()}`;
}
