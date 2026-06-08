import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { X } from 'lucide-react';
import { bookingsApi } from '../api/bookings';
import { ApiRequestError } from '../api/client';
import type { Booking, BookingStatus } from '../api/types';
import { statusColors, statusLabels } from './status';

interface BookingDetailDrawerProps {
  bookingId: number;
  onClose: () => void;
  onChanged?: () => void;
}

export default function BookingDetailDrawer({ bookingId, onClose, onChanged }: BookingDetailDrawerProps) {
  const qc = useQueryClient();
  const detail = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.detail(bookingId),
  });
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReason('');
    setError(null);
  }, [bookingId]);

  // Esc закрывает drawer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const changeStatus = useMutation({
    mutationFn: ({ to, why }: { to: BookingStatus; why?: string }) =>
      bookingsApi.changeStatus(bookingId, to, why),
    onSuccess: () => {
      setReason('');
      setError(null);
      qc.invalidateQueries({ queryKey: ['booking', bookingId] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['chessboard'] });
      onChanged?.();
    },
    onError: (e) => setError(e instanceof ApiRequestError ? e.message : 'Ошибка'),
  });

  const update = useMutation({
    mutationFn: (patch: Parameters<typeof bookingsApi.update>[1]) =>
      bookingsApi.update(bookingId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['booking', bookingId] });
      qc.invalidateQueries({ queryKey: ['chessboard'] });
      onChanged?.();
    },
    onError: (e) => setError(e instanceof ApiRequestError ? e.message : 'Ошибка'),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
      >
        <Header
          booking={detail.data}
          loading={detail.isLoading}
          onClose={onClose}
        />

        {!detail.data && detail.isLoading && (
          <div className="p-6 text-sm text-black/50">Загрузка…</div>
        )}
        {!detail.data && detail.error && (
          <div className="p-6 text-sm text-rose-700">Ошибка: {String(detail.error)}</div>
        )}

        {detail.data && (
          <div className="flex-1 overflow-y-auto p-6">
            <Overview booking={detail.data} />
            <hr className="my-6 border-black/5" />
            <GuestCard booking={detail.data} />
            <hr className="my-6 border-black/5" />
            <EditForm
              booking={detail.data}
              onSave={(patch) => update.mutate(patch)}
              saving={update.isPending}
            />
            <hr className="my-6 border-black/5" />
            <Actions
              booking={detail.data}
              reason={reason}
              onReason={setReason}
              error={error}
              busy={changeStatus.isPending}
              onAction={(to, why) => changeStatus.mutate({ to, why })}
            />
            {detail.data.history && detail.data.history.length > 0 && (
              <>
                <hr className="my-6 border-black/5" />
                <History history={detail.data.history} />
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

function Header({ booking, loading, onClose }: { booking: Booking | undefined; loading: boolean; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-black/5 bg-white px-6 py-4">
      <div className="min-w-0">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-black/40">Бронь</div>
        {loading ? (
          <div className="mt-1 h-6 w-32 animate-pulse rounded bg-black/5" />
        ) : booking ? (
          <>
            <div className="font-display text-2xl font-black leading-tight">{booking.code}</div>
            <div className="mt-0.5 text-xs text-black/50">
              Создана {format(parseISO(booking.createdAt), 'd MMM yyyy, HH:mm')}
            </div>
          </>
        ) : (
          <div className="mt-1 font-display text-2xl font-black">—</div>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-reshka-black"
        aria-label="Закрыть"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Overview({ booking }: { booking: Booking }) {
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Номер</div>
          <div className="mt-1 truncate font-display text-xl font-black">
            {booking.roomLabel ?? `#${booking.roomId}`}
          </div>
          {booking.propertyTitle && (
            <div className="truncate text-sm text-black/60">{booking.propertyTitle}</div>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Заезд" value={format(parseISO(booking.checkIn), 'd MMM yyyy')} />
        <Stat label="Выезд" value={format(parseISO(booking.checkOut), 'd MMM yyyy')} />
        <Stat label="Гостей" value={String(booking.adults)} />
        <Stat label="Источник" value={booking.source} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Stat label="Сумма" value={`${booking.totalAmount.toLocaleString('ru-RU')} ₽`} />
        <Stat label="Предоплата" value={`${booking.prepayment.toLocaleString('ru-RU')} ₽`} />
      </div>

      {booking.notes && (
        <div className="mt-5 rounded-2xl bg-[#fbfaf6] p-4 text-sm">
          <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Заметки</div>
          <div className="mt-1 whitespace-pre-wrap">{booking.notes}</div>
        </div>
      )}
    </section>
  );
}

function GuestCard({ booking }: { booking: Booking }) {
  return (
    <section>
      <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Гость</div>
      {booking.guest ? (
        <div className="mt-2 space-y-1">
          <div className="font-display text-lg font-black">{booking.guest.fullName}</div>
          {booking.guest.phone && <div className="text-sm">{booking.guest.phone}</div>}
          {booking.guest.email && <div className="text-sm text-black/60">{booking.guest.email}</div>}
        </div>
      ) : (
        <div className="mt-2 text-sm text-black/50">Не указан</div>
      )}
    </section>
  );
}

function EditForm({
  booking,
  onSave,
  saving,
}: {
  booking: Booking;
  onSave: (patch: { checkIn?: string; checkOut?: string; adults?: number; notes?: string; totalAmount?: number; prepayment?: number }) => void;
  saving: boolean;
}) {
  const [checkIn, setCheckIn] = useState(booking.checkIn.slice(0, 10));
  const [checkOut, setCheckOut] = useState(booking.checkOut.slice(0, 10));
  const [adults, setAdults] = useState<number>(booking.adults);
  const [total, setTotal] = useState<string>(String(booking.totalAmount));
  const [prepay, setPrepay] = useState<string>(String(booking.prepayment));
  const [notes, setNotes] = useState<string>(booking.notes ?? '');

  // Сбрасываем форму при смене брони
  useEffect(() => {
    setCheckIn(booking.checkIn.slice(0, 10));
    setCheckOut(booking.checkOut.slice(0, 10));
    setAdults(booking.adults);
    setTotal(String(booking.totalAmount));
    setPrepay(String(booking.prepayment));
    setNotes(booking.notes ?? '');
  }, [booking.id]);

  function submit() {
    onSave({
      checkIn,
      checkOut,
      adults,
      totalAmount: Number(total) || 0,
      prepayment: Number(prepay) || 0,
      notes,
    });
  }

  return (
    <section>
      <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Редактирование</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Заезд">
          <input type="date" className="ed-input" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </Field>
        <Field label="Выезд">
          <input type="date" className="ed-input" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </Field>
        <Field label="Гостей">
          <input type="number" min={1} className="ed-input" value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
        </Field>
        <Field label="Источник">
          <input className="ed-input bg-black/5 text-black/50" value={booking.source} disabled />
        </Field>
        <Field label="Сумма, ₽">
          <input type="number" min={0} className="ed-input" value={total} onChange={(e) => setTotal(e.target.value)} />
        </Field>
        <Field label="Предоплата, ₽">
          <input type="number" min={0} className="ed-input" value={prepay} onChange={(e) => setPrepay(e.target.value)} />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Заметки">
          <textarea
            rows={3}
            className="ed-input resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="mt-4 w-full rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black transition hover:bg-reshka-yellowSoft disabled:opacity-50"
      >
        {saving ? 'Сохраняем…' : 'Сохранить изменения'}
      </button>
      <style>{`.ed-input { width: 100%; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; font-size: 14px; outline: none; background: #fff; } .ed-input:focus { border-color: #f5b400; }`}</style>
    </section>
  );
}

function Actions({
  booking,
  reason,
  onReason,
  error,
  busy,
  onAction,
}: {
  booking: Booking;
  reason: string;
  onReason: (v: string) => void;
  error: string | null;
  busy: boolean;
  onAction: (to: BookingStatus, why?: string) => void;
}) {
  const showReason = booking.status === 'confirmed' || booking.status === 'new';
  return (
    <section>
      <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">Действия</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {booking.status === 'new' && (
          <button
            type="button"
            onClick={() => onAction('confirmed')}
            disabled={busy}
            className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black transition hover:bg-reshka-yellowSoft disabled:opacity-50"
          >
            Подтвердить
          </button>
        )}
        {booking.status === 'confirmed' && (
          <button
            type="button"
            onClick={() => onAction('checked_in')}
            disabled={busy}
            className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black transition hover:bg-reshka-yellowSoft disabled:opacity-50"
          >
            Заселить
          </button>
        )}
        {booking.status === 'checked_in' && (
          <button
            type="button"
            onClick={() => onAction('checked_out')}
            disabled={busy}
            className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black transition hover:bg-reshka-yellowSoft disabled:opacity-50"
          >
            Выселить
          </button>
        )}
        {(booking.status === 'new' || booking.status === 'confirmed' || booking.status === 'checked_in') && (
          <button
            type="button"
            onClick={() => onAction('cancelled', reason || undefined)}
            disabled={busy}
            className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-extrabold text-rose-800 transition hover:bg-rose-100 disabled:opacity-50"
          >
            Отменить
          </button>
        )}
      </div>

      {showReason && (
        <div className="mt-3 space-y-2">
          <input
            placeholder="Причина (для отмены/неявки)"
            value={reason}
            onChange={(e) => onReason(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-reshka-yellow"
          />
          {(booking.status === 'confirmed' || booking.status === 'new') && (
            <button
              type="button"
              onClick={() => onAction('no_show', reason || undefined)}
              disabled={busy}
              className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-extrabold hover:bg-black/5 disabled:opacity-50"
            >
              Неявка
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}
    </section>
  );
}

function History({ history }: { history: NonNullable<Booking['history']> }) {
  return (
    <section>
      <div className="text-xs font-extrabold uppercase tracking-wider text-black/50">История</div>
      <ul className="mt-3 space-y-2 text-sm">
        {history.map((ev, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-black/40">{format(parseISO(ev.changedAt), 'd MMM HH:mm')}</span>
            {ev.fromStatus && (
              <>
                <span>{statusLabels[ev.fromStatus as BookingStatus] ?? ev.fromStatus}</span>
                <span className="text-black/40">→</span>
              </>
            )}
            <span className="font-extrabold">
              {statusLabels[ev.toStatus as BookingStatus] ?? ev.toStatus}
            </span>
            {ev.reason && <span className="text-black/50">· {ev.reason}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-black/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
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
