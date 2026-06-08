import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guestsApi } from '../api/bookings';
import { AdminPageHeader } from './AdminLayout';
import { format, parseISO } from 'date-fns';

export default function GuestsPage() {
  const [q, setQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const list = useQuery({
    queryKey: ['guests', q],
    queryFn: () => guestsApi.search(q, 50),
  });
  return (
    <div>
      <AdminPageHeader
        title="Гости"
        subtitle="База клиентов — быстрый поиск и добавление"
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black"
          >
            + Новый гость
          </button>
        }
      />
      <div className="flex items-center gap-2 border-b border-black/5 bg-white px-8 py-3">
        <input
          placeholder="Поиск (имя, телефон, email)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-md rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm outline-none focus:border-reshka-yellow"
        />
      </div>
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#fbfaf6] text-left text-xs font-extrabold uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Документ</th>
              <th className="px-4 py-3">Создан</th>
            </tr>
          </thead>
          <tbody>
            {list.data?.items.map((g) => (
              <tr key={g.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-extrabold">{g.fullName}</td>
                <td className="px-4 py-3">{g.phone ?? '—'}</td>
                <td className="px-4 py-3">{g.email ?? '—'}</td>
                <td className="px-4 py-3">
                  {g.docType ? `${g.docType}${g.docNumber ? ' · ' + g.docNumber : ''}` : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-black/50">{format(parseISO(g.createdAt), 'd MMM yyyy')}</td>
              </tr>
            ))}
            {list.data?.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-black/50">
                  Гостей не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showCreate && <CreateGuestModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function CreateGuestModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });
  const create = useMutation({
    mutationFn: () => guestsApi.create({ fullName: form.fullName, phone: form.phone || undefined, email: form.email || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guests'] });
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-xl font-black">Новый гость</h3>
        <div className="mt-4 space-y-3">
          <input className="input" placeholder="ФИО*" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="input" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-extrabold">Отмена</button>
          <button
            onClick={() => create.mutate()}
            disabled={!form.fullName || create.isPending}
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
