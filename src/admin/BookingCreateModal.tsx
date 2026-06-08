import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X } from 'lucide-react';
import { adminRoomsApi, bookingsApi, guestsApi } from '../api/bookings';
import { ApiRequestError } from '../api/client';
import type { Guest, Room } from '../api/types';

const schema = z.object({
  roomId: z.number().positive(),
  checkIn: z.string().min(10),
  checkOut: z.string().min(10),
  checkInTime: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM'),
  checkOutTime: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM'),
  adults: z.number().min(1).max(10),
  source: z.enum(['direct', 'site', 'ota', 'phone', 'max']),
  totalAmount: z.number().min(0),
  prepayment: z.number().min(0),
  notes: z.string().optional(),
  guestMode: z.enum(['existing', 'new']),
  guestId: z.number().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  initialRoomId?: number;
  initialDate?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function BookingCreateModal({ initialRoomId, initialDate, onClose, onSaved }: Props) {
  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestQuery, setGuestQuery] = useState('');
  const [newGuest, setNewGuest] = useState({ fullName: '', phone: '', email: '' });

  const today = initialDate ?? new Date().toISOString().slice(0, 10);
  const tomorrow = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      roomId: initialRoomId ?? 0,
      checkIn: today,
      checkOut: tomorrow,
      checkInTime: '14:00',
      checkOutTime: '12:00',
      adults: 1,
      source: 'phone',
      totalAmount: 0,
      prepayment: 0,
      guestMode: 'new',
      notes: '',
    },
  });

  // Все номера обоих объектов
  const roomsQuery = useQuery({
    queryKey: ['adminRooms'],
    queryFn: () => adminRoomsApi.list(),
  });

  useEffect(() => {
    if (!initialRoomId && roomsQuery.data?.items.length && !watch('roomId')) {
      setValue('roomId', roomsQuery.data.items[0].id);
    }
  }, [initialRoomId, roomsQuery.data, watch, setValue]);

  // Поиск гостей
  const guestsQ = useQuery({
    queryKey: ['guests', guestQuery],
    queryFn: () => guestsApi.search(guestQuery, 10),
    enabled: guestQuery.length >= 2,
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError(null);
    try {
      let guestId: number | undefined;
      if (data.guestMode === 'new') {
        if (!newGuest.fullName) {
          setError('Укажите имя гостя');
          setSubmitting(false);
          return;
        }
        const g = await guestsApi.create({
          fullName: newGuest.fullName,
          phone: newGuest.phone || undefined,
          email: newGuest.email || undefined,
        });
        guestId = g.id;
      } else if (data.guestId) {
        guestId = data.guestId;
      } else {
        setError('Выберите гостя');
        setSubmitting(false);
        return;
      }
      const created = await bookingsApi.create({
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        adults: data.adults,
        source: data.source,
        totalAmount: data.totalAmount,
        prepayment: data.prepayment,
        notes: data.notes || undefined,
        guestId,
      });
      qc.invalidateQueries({ queryKey: ['chessboard'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
      alert(`Бронь создана: ${created.code}`);
      onSaved();
    } catch (e) {
      if (e instanceof ApiRequestError) {
        setError(e.status === 409 ? 'Этот номер уже забронирован на эти даты' : e.message);
      } else {
        setError('Не удалось создать бронь');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const nights = (() => {
    const a = new Date(watch('checkIn'));
    const b = new Date(watch('checkOut'));
    return Math.max(1, Math.round((+b - +a) / 86400000));
  })();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/5 bg-reshka-black px-6 py-4 text-white">
          <h3 className="font-display text-xl font-black">Новая бронь</h3>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Номер">
              <select {...register('roomId', { valueAsNumber: true })} className="input">
                {roomsQuery.data?.items.map((r: Room) => (
                  <option key={r.id} value={r.id}>
                    {r.propertyTitle ? `${r.propertyTitle} — ${r.label}` : r.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Источник">
              <select {...register('source')} className="input">
                <option value="phone">Телефон</option>
                <option value="direct">Лично</option>
                <option value="site">Сайт</option>
                <option value="max">Max</option>
                <option value="ota">OTA</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Дата заезда">
                <input type="date" {...register('checkIn')} className="input" />
              </Field>
              <Field label="Время">
                <input type="time" {...register('checkInTime')} className="input" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Дата выезда">
                <input type="date" {...register('checkOut')} className="input" />
              </Field>
              <Field label="Время">
                <input type="time" {...register('checkOutTime')} className="input" />
              </Field>
            </div>
            <Field label="Гостей">
              <input type="number" min={1} max={10} {...register('adults', { valueAsNumber: true })} className="input" />
            </Field>
            <Field label="Сумма, ₽">
              <input type="number" step="100" min={0} {...register('totalAmount', { valueAsNumber: true })} className="input" />
            </Field>
            <Field label="Предоплата, ₽">
              <input type="number" step="100" min={0} {...register('prepayment', { valueAsNumber: true })} className="input" />
            </Field>
            <Field label={`Ночей: ${nights}`}>
              <div className="rounded-2xl border border-black/5 bg-[#fbfaf6] px-3 py-2 text-sm font-extrabold">
                {Math.round((watch('totalAmount') || 0) / Math.max(1, nights))} ₽/ночь
              </div>
            </Field>
          </div>

          <div className="rounded-2xl border border-black/5 bg-[#fbfaf6] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-black/50">
              <label className="flex items-center gap-1">
                <input type="radio" value="new" {...register('guestMode')} /> Новый гость
              </label>
              <label className="ml-4 flex items-center gap-1">
                <input type="radio" value="existing" {...register('guestMode')} /> Из базы
              </label>
            </div>
            {watch('guestMode') === 'new' ? (
              <div className="grid grid-cols-3 gap-2">
                <input className="input" placeholder="Имя*" value={newGuest.fullName} onChange={(e) => setNewGuest({ ...newGuest, fullName: e.target.value })} />
                <input className="input" placeholder="Телефон" value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} />
                <input className="input" placeholder="Email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  className="input"
                  placeholder="Поиск (имя, телефон, email)"
                  value={guestQuery}
                  onChange={(e) => setGuestQuery(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto rounded-xl border border-black/5 bg-white">
                  {guestsQ.data?.items.map((g: Guest) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setValue('guestId', g.id)}
                      className="flex w-full items-center justify-between border-b border-black/5 px-3 py-2 text-left text-sm hover:bg-[#fbfaf6]"
                    >
                      <span className="font-extrabold">{g.fullName}</span>
                      <span className="text-xs text-black/50">{g.phone ?? g.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Field label="Заметки">
            <textarea rows={2} {...register('notes')} className="input" placeholder="Заезд после 22:00, дополнительная кровать и т.п." />
          </Field>

          {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-extrabold">
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-reshka-yellow px-6 py-2.5 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? 'Сохраняем…' : 'Создать бронь'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .input { width: 100%; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: white; padding: 8px 12px; font-size: 14px; outline: none; }
        .input:focus { border-color: #f6c90e; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-wider text-black/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
