import type { LucideIcon } from 'lucide-react';
import {
  BedDouble,
  Car,
  Coffee,
  ConciergeBell,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Utensils,
  Wifi,
} from 'lucide-react';

export type Room = {
  title: string;
  description: string;
  price: string;
  area: string;
  image: string;
  amenities: string[];
  accent: string;
};

export type Benefit = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export type Review = {
  name: string;
  role: string;
  rating: string;
  text: string;
};

export const rooms: Room[] = [
  {
    title: 'Стандарт',
    description: 'Лаконичный номер для короткой поездки: спокойная отделка, рабочее место и всё нужное под рукой.',
    price: 'от 6 900 ₽',
    area: '22 м²',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Queen-size кровать', 'Рабочий стол', 'Душевая зона', 'Smart TV'],
    accent: 'Комфортный минимум',
  },
  {
    title: 'Комфорт',
    description: 'Больше воздуха и мягкого света. В этом типе доступны номера Аллея Труда 21 - 3 и 13.',
    price: 'от 8 900 ₽',
    area: '28 м²',
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    amenities: ['King-size кровать', 'Лаунж-кресло', 'Кофе-станция', 'Blackout шторы'],
    accent: 'Выбор гостей',
  },
];

export const benefits: Benefit[] = [
  {
    title: 'Удобное расположение',
    description: 'Быстрый доступ к деловому центру, кафе, театрам и основным маршрутам города.',
    Icon: MapPin,
  },
  {
    title: 'Завтрак включён',
    description: 'Сытное утро без лишних решений: горячие блюда, кофе и свежая выпечка.',
    Icon: Coffee,
  },
  {
    title: 'Бесплатный Wi-Fi',
    description: 'Стабильная связь для работы, видеозвонков и планирования отдыха.',
    Icon: Wifi,
  },
  {
    title: 'Парковка',
    description: 'Охраняемая зона для гостей, которые приезжают на личном автомобиле.',
    Icon: Car,
  },
  {
    title: '24/7 ресепшн',
    description: 'Поможем с поздним заездом, багажом, документами и городскими советами.',
    Icon: ConciergeBell,
  },
  {
    title: 'Трансфер',
    description: 'Встреча в аэропорту или на вокзале по предварительной заявке.',
    Icon: Plane,
  },
];

export const reviews: Review[] = [
  {
    name: 'Анна Морозова',
    role: 'деловая поездка',
    rating: '5.0',
    text: 'Очень спокойный номер, быстрый Wi-Fi и завтрак без очередей. Для командировки получилось идеально.',
  },
  {
    name: 'Илья Волков',
    role: 'выходные в городе',
    rating: '4.9',
    text: 'Понравился стиль: чёрный, жёлтый, ничего лишнего. Отель выглядит дороже своей цены.',
  },
  {
    name: 'Мария Сафина',
    role: 'семейный отдых',
    rating: '5.0',
    text: 'В семейном номере удобно разместились вчетвером. Персонал помог с трансфером и ранним завтраком.',
  },
];

export const stats = [
  { value: '27', label: 'номеров' },
  { value: '4.9', label: 'рейтинг гостей' },
  { value: '8 мин', label: 'до центра' },
];

export const hotelHighlights = [
  { label: 'Тихие номера', Icon: ShieldCheck },
  { label: 'Завтраки с 7:00', Icon: Utensils },
  { label: 'Премиум бельё', Icon: Sparkles },
  { label: 'Queen и King beds', Icon: BedDouble },
];
