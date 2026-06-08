import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { bookingsApi } from '../api/bookings';
import { ApiRequestError } from '../api/client';
import { AdminButton, AdminPageHeader } from './AdminLayout';
import { statusColors, statusLabels } from './status';
import { pushPath } from '../lib/route';
import type { BookingStatus } from '../api/types';

export default function BookingDetailPage({ pathname }: { pathname: string }) {
  const id = Number(pathname.split('/').pop());
  const qc = useQueryClient();
  const detail = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.detail(id),
    enabled: !!id,
  });
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  if (detail.isLoading) return <div className="p-8 text-sm text-black/50">Загрузка…</div>;
  if (detail.error) return <div className="p-8 text-sm text-rose-700">Ошибка: {String(detail.error)}</div>;
  const b = detail.data!;

  async function changeStatus(to: BookingStatus) {
    try {
      await bookingsApi.changeStatus(b!.id, to, reason || undefined);
      setReason('');
      setError(null);
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['chessboard'] });
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : 'Ошибка');
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={`Бронь ${b.code}`}
        subtitle={`Создана ${format(parseISO(b.createdAt), 'd MMM yyyy, HH:mm')}`}
        actions={
          <AdminButton variant="secondary" onClick={() => pushPath('/admin/bookings')}>
            ← К списку
          </AdminButton>
        }
      />
      <div className="grid gap-4 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Номер</div>
              <div className="font-display text-xl font-black">{b.roomLabel ?? `#${b.roomId}`}</div>
              <div className="text-sm text-black/60">{b.propertyTitle}</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusColors[b.status]}`}>
              {statusLabels[b.status]}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Заезд" value={format(parseISO(b.checkIn), 'd MMM yyyy')} />
            <Stat label="Выезд" value={format(parseISO(b.checkOut), 'd MMM yyyy')} />
            <Stat label="Гостей" value={String(b.adults)} />
            <Stat label="Источник" value={b.source} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Stat label="Сумма" value={`${b.totalAmount.toLocaleString('ru-RU')} ₽`} />
            <Stat label="Предоплата" value={`${b.prepayment.toLocaleString('ru-RU')} ₽`} />
          </div>

          {b.notes && (
            <div className="mt-6 rounded-2xl bg-[#fbfaf6] p-4 text-sm">
              <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Заметки</div>
              <div className="mt-1">{b.notes}</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-black/5 bg-white p-6">
            <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Гость</div>
            {b.guest ? (
              <div className="mt-2 space-y-1">
                <div className="font-display text-lg font-black">{b.guest.fullName}</div>
                {b.guest.phone && <div className="text-sm">{b.guest.phone}</div>}
                {b.guest.email && <div className="text-sm text-black/60">{b.guest.email}</div>}
              </div>
            ) : (
              <div className="mt-2 text-sm text-black/50">Не указан</div>
            )}
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-6">
            <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Действия</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {b.status === 'new' && (
                <AdminButton onClick={() => changeStatus('confirmed')}>Подтвердить</AdminButton>
              )}
              {b.status === 'confirmed' && (
                <AdminButton onClick={() => changeStatus('checked_in')}>Заселить</AdminButton>
              )}
              {b.status === 'checked_in' && (
                <AdminButton onClick={() => changeStatus('checked_out')}>Выселить</AdminButton>
              )}
              {(b.status === 'new' || b.status === 'confirmed' || b.status === 'checked_in') && (
                <button
                  onClick={() => changeStatus('cancelled')}
                  className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-extrabold text-rose-800 transition hover:bg-rose-100"
                >
                  Отменить
                </button>
              )}
            </div>

            {(b.status === 'confirmed') && (
              <div className="mt-3 space-y-2">
                <input
                  placeholder="Причина (для отмены/неявки)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-reshka-yellow"
                />
                <button
                  onClick={() => changeStatus('no_show')}
                  className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-extrabold hover:bg-black/5"
                >
                  Неявка
                </button>
              </div>
            )}

            {error && <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}
          </div>

          {b.history && b.history.length > 0 && (
            <div className="rounded-3xl border border-black/5 bg-white p-6">
              <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">История</div>
              <ul className="mt-3 space-y-2 text-sm">
                {b.history.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-black/40">{format(parseISO(ev.changedAt), 'd MMM HH:mm')}</span>
                    {ev.fromStatus && (
                      <>
                        <span>{statusLabels[ev.fromStatus as BookingStatus] ?? ev.fromStatus}</span>
                        <span className="text-black/40">→</span>
                      </>
                    )}
                    <span className="font-extrabold">{statusLabels[ev.toStatus as BookingStatus] ?? ev.toStatus}</span>
                    {ev.reason && <span className="text-black/50">· {ev.reason}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">{label}</div>
      <div className="mt-1 text-sm font-extrabold">{value}</div>
    </div>
  );
}
