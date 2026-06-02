import type { LucideIcon } from 'lucide-react';
import {
  ConciergeBell,
  Dog,
  KeyRound,
  MapPin,
  Microwave,
  Shirt,
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
    description: 'Уютный номер для короткой остановки в центре города: телевизор, шкафчик и всё нужное под рукой.',
    price: 'от 6 900 ₽',
    area: '15 м²',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Телевизор', 'Запирающийся шкафчик', 'Холодильник', 'Кабельное ТВ'],
    accent: 'В центре города',
  },
  {
    title: 'Комфорт',
    description: 'Больше пространства для отдыха после дороги: спокойная обстановка и доступ к общей кухне.',
    price: 'от 8 900 ₽',
    area: '15 м²',
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Телевизор', 'Кондиционер', 'Фен по запросу', 'Гладильные принадлежности'],
    accent: 'Выбор гостей',
  },
];

export const benefits: Benefit[] = [
  {
    title: 'Центр города',
    description: 'Хостел расположен в Комсомольске-на-Амуре, рядом с городским ритмом и повседневной инфраструктурой.',
    Icon: MapPin,
  },
  {
    title: 'Общая кухня',
    description: 'Кухня оборудована для самостоятельного приготовления пищи, есть микроволновая печь.',
    Icon: Microwave,
  },
  {
    title: 'Можно с питомцем',
    description: 'Возможно бесплатное размещение с домашним любимцем.',
    Icon: Dog,
  },
  {
    title: 'Бесплатный интернет',
    description: 'Гостям доступен интернет для связи, работы и планирования поездки.',
    Icon: Wifi,
  },
  {
    title: 'Круглосуточная стойка',
    description: 'Стойка регистрации работает 24/7, доступна индивидуальная регистрация заезда и отъезда.',
    Icon: ConciergeBell,
  },
  {
    title: 'Стиральная машина',
    description: 'В хостеле есть стиральная машина и гладильные принадлежности.',
    Icon: Shirt,
  },
];

export const reviews: Review[] = [
  {
    name: '',
    role: 'отзыв с 2ГИС',
    rating: '5.0',
    text: 'Хорошее место, удобное бесконтактное заселение, уютные чистые номера. Есть всё, что необходимо для проживания. В комнате аккуратно, спокойно и тепло, можно быстро заехать без лишних ожиданий. Для короткой поездки вариант очень удобный.',
  },
  {
    name: '',
    role: 'отзыв с Островка',
    rating: '5.0',
    text: 'Жила сутки в двухместном номере с большой кроватью. За 1000 рублей - идеальное соотношение цена-качество. Везде чисто, понравилась большая зона отдыха, всё продумано и удобно. В номере был ТВ и кондиционер. Несмотря на большое количество людей, шума не было. Рекомендую!',
  },
  {
    name: '',
    role: 'отзыв с Tripadvisor',
    rating: '5.0',
    text: 'Единственный хостел в Комсомольске-на-Амуре, где есть зона отдыха, игры и книги, ортопедические матрасы и отдельные душевые. Сделано с душой и любовью, администраторы следят за порядком. На кухне есть всё для приготовления еды, невероятно чисто, спать приятно и не шумно.',
  },
];

export const stats = [
  { value: '27', label: 'номеров' },
  { value: '4.9', label: 'рейтинг гостей' },
  { value: '8 мин', label: 'до центра' },
];

export const hotelHighlights = [
  { label: 'Бесплатный интернет', Icon: Wifi },
  { label: 'Общая кухня', Icon: Utensils },
  { label: 'Можно с питомцем', Icon: Dog },
  { label: 'Индивидуальный заезд', Icon: KeyRound },
];
