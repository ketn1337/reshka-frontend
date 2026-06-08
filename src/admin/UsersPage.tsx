import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/bookings';
import { AdminPageHeader } from './AdminLayout';
import { useAuthStore } from '../store/auth';
import { AdminForbidden } from './AdminLayout';

export default function UsersPage() {
  const me = useAuthStore((s) => s.user);
  if (me?.role !== 'admin') return <AdminForbidden />;

  return <UsersContent />;
}

function UsersContent() {
  const list = useQuery({ queryKey: ['users'], queryFn: () => usersApi.list() });
  const [show, setShow] = useState(false);

  return (
    <div>
      <AdminPageHeader
        title="Сотрудники"
        subtitle="Управление учётками админки"
        actions={
          <button onClick={() => setShow(true)} className="rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black">
            + Добавить
          </button>
        }
      />
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#fbfaf6] text-left text-xs font-extrabold uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Роль</th>
            </tr>
          </thead>
          <tbody>
            {list.data?.items.map((u) => (
              <tr key={u.id} className="border-t border-black/5">
                <td className="px-4 py-3 font-extrabold">{u.fullName}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-reshka-yellow/20 px-2 py-0.5 text-[11px] font-extrabold uppercase">{u.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show && <CreateUserModal onClose={() => setShow(false)} />}
    </div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'receptionist' as 'admin' | 'manager' | 'receptionist' });
  const create = useMutation({
    mutationFn: () => usersApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-xl font-black">Новый сотрудник</h3>
        <div className="mt-4 space-y-3">
          <input className="input" placeholder="ФИО*" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="input" placeholder="Email*" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Пароль*" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'manager' | 'receptionist' })}>
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="receptionist">receptionist</option>
          </select>
        </div>
        {create.error && <div className="mt-3 text-sm text-rose-700">{String(create.error)}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-extrabold">Отмена</button>
          <button
            onClick={() => create.mutate()}
            disabled={create.isPending || !form.fullName || !form.email || form.password.length < 6}
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
