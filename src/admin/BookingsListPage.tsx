import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings';
import { AdminButton, AdminPageHeader } from './AdminLayout';
import { pushPath } from '../lib/route';
import { format, parseISO } from 'date-fns';
import { statusLabels } from './status';
import type { BookingStatus } from '../api/types';

export default function BookingsListPage() {
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [q, setQ] = useState('');
  const list = useQuery({
    queryKey: ['bookings', status, q],
    queryFn: () => bookingsApi.list({ status: status || undefined, q: q || undefined }),
  });

  return (
    <div>
      <AdminPageHeader
        title="Бронирования"
        subtitle="Все записи — фильтр по статусу, поиск по коду/заметкам"
      />
      <div className="flex flex-wrap items-center gap-2 border-b border-black/5 bg-white px-8 py-3">
        <input
          placeholder="Поиск (код, заметки)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm outline-none focus:border-reshka-yellow"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus | '')}
          className="rounded-md border border-black/10 bg-white px-2 py-1.5 text-xs font-bold"
        >
          <option value="">Все статусы</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#fbfaf6] text-left text-xs font-extrabold uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-4 py-3">Код</th>
              <th className="px-4 py-3">Номер</th>
              <th className="px-4 py-3">Гость</th>
              <th className="px-4 py-3">Заезд</th>
              <th className="px-4 py-3">Выезд</th>
              <th className="px-4 py-3">Сумма</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.data?.items.map((b) => (
              <tr key={b.id} className="border-t border-black/5 hover:bg-[#fbfaf6]">
                <td className="px-4 py-3 font-extrabold">{b.code}</td>
                <td className="px-4 py-3">{b.roomLabel ?? `#${b.roomId}`}</td>
                <td className="px-4 py-3">{b.guest?.fullName ?? '—'}</td>
                <td className="px-4 py-3">{format(parseISO(b.checkIn), 'd MMM')}</td>
                <td className="px-4 py-3">{format(parseISO(b.checkOut), 'd MMM')}</td>
                <td className="px-4 py-3 font-extrabold">{b.totalAmount.toLocaleString('ru-RU')} ₽</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-reshka-yellow/20 px-2 py-0.5 text-[11px] font-extrabold uppercase text-reshka-black">
                    {statusLabels[b.status] ?? b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => pushPath(`/admin/bookings/${b.id}`)} className="text-xs font-extrabold text-reshka-yellow hover:underline">
                    Открыть
                  </button>
                </td>
              </tr>
            ))}
            {list.isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-black/50">
                  Загрузка…
                </td>
              </tr>
            )}
            {list.data && list.data.items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-black/50">
                  Броней нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
