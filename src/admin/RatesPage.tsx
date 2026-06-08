import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratesApi } from '../api/bookings';
import { propertiesApi } from '../api/properties';
import { AdminPageHeader } from './AdminLayout';

export default function RatesPage() {
  const [propertySlug, setPropertySlug] = useState('');
  const [kindSlug, setKindSlug] = useState('standard');
  const propsQ = useQuery({ queryKey: ['properties'], queryFn: () => propertiesApi.list() });
  const propDetail = useQuery({
    queryKey: ['property', propertySlug],
    queryFn: () => propertiesApi.detail(propertySlug),
    enabled: !!propertySlug,
  });
  const ratesQ = useQuery({
    queryKey: ['rates', propertySlug, kindSlug],
    queryFn: () => ratesApi.list({ property: propertySlug, kind: kindSlug }),
    enabled: !!propertySlug && !!kindSlug,
  });

  return (
    <div>
      <AdminPageHeader title="Тарифы" subtitle="Периоды и ставки по дням недели" />
      <div className="flex flex-wrap items-center gap-3 border-b border-black/5 bg-white px-8 py-3">
        <label className="text-xs">
          <span className="font-extrabold uppercase tracking-wider text-black/50">Объект</span>
          <select
            value={propertySlug}
            onChange={(e) => setPropertySlug(e.target.value)}
            className="ml-2 rounded-md border border-black/10 bg-white px-2 py-1.5 text-xs font-bold"
          >
            <option value="">Выберите…</option>
            {propsQ.data?.items.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="font-extrabold uppercase tracking-wider text-black/50">Тип</span>
          <select
            value={kindSlug}
            onChange={(e) => setKindSlug(e.target.value)}
            className="ml-2 rounded-md border border-black/10 bg-white px-2 py-1.5 text-xs font-bold"
          >
            {propDetail.data?.kinds.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {propertySlug && kindSlug && (
        <RatesList rates={ratesQ.data?.items ?? []} kindId={propDetail.data?.kinds.find((k) => k.slug === kindSlug)?.id} />
      )}
    </div>
  );
}

function RatesList({ rates, kindId }: { rates: { id: number; kindId: number; dateFrom: string; dateTo: string; weekdayRate: number; weekendRate: number }[]; kindId?: number }) {
  const qc = useQueryClient();
  const [show, setShow] = useState(false);
  const remove = useMutation({
    mutationFn: (id: number) => ratesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rates'] }),
  });
  return (
    <div className="p-6">
      <button
        onClick={() => setShow(true)}
        className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black"
      >
        + Добавить период
      </button>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#fbfaf6] text-left text-xs font-extrabold uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-4 py-3">С</th>
              <th className="px-4 py-3">По</th>
              <th className="px-4 py-3">Будни</th>
              <th className="px-4 py-3">Выходные</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="px-4 py-3">{r.dateFrom}</td>
                <td className="px-4 py-3">{r.dateTo}</td>
                <td className="px-4 py-3 font-extrabold">{r.weekdayRate} ₽</td>
                <td className="px-4 py-3 font-extrabold">{r.weekendRate} ₽</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove.mutate(r.id)}
                    className="text-xs font-extrabold text-rose-700 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {rates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-black/50">
                  Нет периодов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {show && kindId && <CreateRateModal kindId={kindId} onClose={() => setShow(false)} />}
    </div>
  );
}

function CreateRateModal({ kindId, onClose }: { kindId: number; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', weekdayRate: 0, weekendRate: 0 });
  const create = useMutation({
    mutationFn: () =>
      ratesApi.create({ kindId, ...form }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rates'] });
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-xl font-black">Новый период</h3>
        <div className="mt-4 space-y-3">
          <input type="date" className="input" value={form.dateFrom} onChange={(e) => setForm({ ...form, dateFrom: e.target.value })} />
          <input type="date" className="input" value={form.dateTo} onChange={(e) => setForm({ ...form, dateTo: e.target.value })} />
          <input type="number" className="input" placeholder="Будни" value={form.weekdayRate} onChange={(e) => setForm({ ...form, weekdayRate: Number(e.target.value) })} />
          <input type="number" className="input" placeholder="Выходные" value={form.weekendRate} onChange={(e) => setForm({ ...form, weekendRate: Number(e.target.value) })} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-extrabold">Отмена</button>
          <button
            onClick={() => create.mutate()}
            disabled={create.isPending || !form.dateFrom || !form.dateTo}
            className="rounded-full bg-reshka-yellow px-5 py-2 text-sm font-extrabold text-reshka-black"
          >
            {create.isPending ? 'Создаём…' : 'Создать'}
          </button>
        </div>
        <style>{`.input { width: 100%; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; font-size: 14px; outline: none; }`}</style>
      </div>
    </div>
  );
}
