import { rooms } from './data';

export type ResultsQuery = {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
};

export type BookingQuery = ResultsQuery & {
  roomTitle: string;
  createdAt: number | null;
};

const roomMeta = [
  {
    capacity: 2,
    beds: 'Queen-size кровать',
    rate: 6900,
    available: 25,
    rating: '4.8',
    floor: '1-4 этаж',
    tags: ['Телевизор', 'Шкафчик', 'Холодильник'],
    perks: ['Бесплатный интернет', 'Общая кухня'],
  },
  {
    capacity: 2,
    beds: 'King-size кровать',
    rate: 8900,
    available: 2,
    rating: '4.9',
    floor: '1-3 этаж',
    tags: ['Кондиционер', 'Телевизор', 'Фен по запросу'],
    perks: ['Можно с питомцем', 'Индивидуальный заезд'],
  },
];

export type CatalogRoom = (typeof rooms)[number] & (typeof roomMeta)[number];

export const roomTypes = ['Любой номер', 'Стандарт', 'Комфорт'];

export const catalogRooms = rooms.map((room, index) => ({
  ...room,
  ...roomMeta[index],
})) as CatalogRoom[];

function clampGuests(value: string | null) {
  return Math.min(Math.max(Number(value) || 2, 1), 6);
}

export function parseResultsQuery(search: string): ResultsQuery {
  const params = new URLSearchParams(search);

  return {
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    guests: clampGuests(params.get('guests')),
    roomType: params.get('roomType') || '',
  };
}

export function parseBookingQuery(search: string): BookingQuery {
  const params = new URLSearchParams(search);
  const createdAt = Number(params.get('createdAt'));

  return {
    ...parseResultsQuery(search),
    roomTitle: params.get('room') || params.get('roomType') || catalogRooms[0].title,
    createdAt: Number.isFinite(createdAt) && createdAt > 0 ? createdAt : null,
  };
}

export function findCatalogRoom(title: string) {
  return catalogRooms.find((room) => room.title === title) || catalogRooms[0];
}

export function buildBookingParams({
  roomTitle,
  checkIn,
  checkOut,
  guests,
  createdAt,
}: {
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  createdAt?: number;
}) {
  const params = new URLSearchParams();

  params.set('room', roomTitle);
  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  if (guests) params.set('guests', String(guests));
  if (createdAt) params.set('createdAt', String(createdAt));

  return params;
}

export function pushAppPath(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function formatDate(value: string) {
  if (!value) return 'любые даты';

  const timestamp = Date.parse(`${value}T00:00:00`);
  if (Number.isNaN(timestamp)) return 'любые даты';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(timestamp));
}

export function formatDateRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 'даты уточняются';
  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
}

export function formatCurrency(value: number) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

export function getNights(checkIn: string, checkOut: string) {
  const start = Date.parse(`${checkIn}T00:00:00`);
  const end = Date.parse(`${checkOut}T00:00:00`);

  if (Number.isNaN(start) || Number.isNaN(end)) return 1;

  const diff = Math.round((end - start) / 86_400_000);
  return diff > 0 ? Math.min(diff, 30) : 1;
}

export function getNightLabel(nights: number) {
  const mod10 = nights % 10;
  const mod100 = nights % 100;

  if (mod10 === 1 && mod100 !== 11) return `${nights} ночь`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${nights} ночи`;
  return `${nights} ночей`;
}

export function getGuestLabel(guests: number) {
  if (guests === 1) return '1 гость';
  if (guests >= 2 && guests <= 4) return `${guests} гостя`;
  return `${guests} гостей`;
}

export function getPrepaymentAmount(total: number) {
  return Math.ceil(total * 0.3 / 100) * 100;
}

function getRelativeDayLabel(date: Date, now: Date) {
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.round((targetStart - dayStart) / 86_400_000);

  if (dayDiff === 0) return 'сегодня';
  if (dayDiff === 1) return 'завтра';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatDeadline(timestamp: number, now = new Date()) {
  const deadline = new Date(timestamp);
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(deadline);

  return `до ${time} ${getRelativeDayLabel(deadline, now)}`;
}
