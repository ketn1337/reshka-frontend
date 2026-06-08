import type { BookingStatus } from '../api/types';

export const statusLabels: Record<BookingStatus, string> = {
  new: 'Новая',
  confirmed: 'Подтверждена',
  checked_in: 'Заселена',
  checked_out: 'Выселена',
  cancelled: 'Отменена',
  no_show: 'Неявка',
};

export const statusColors: Record<BookingStatus, string> = {
  new: 'bg-amber-100 text-amber-900',
  confirmed: 'bg-blue-100 text-blue-900',
  checked_in: 'bg-rose-200 text-rose-900',
  checked_out: 'bg-zinc-200 text-zinc-900',
  cancelled: 'bg-zinc-100 text-zinc-500 line-through',
  no_show: 'bg-zinc-100 text-zinc-500 line-through',
};
