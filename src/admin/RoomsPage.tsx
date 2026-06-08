import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminRoomsApi } from '../api/bookings';
import { propertiesApi } from '../api/properties';
import { AdminPageHeader } from './AdminLayout';
import type { Room, Property } from '../api/types';

export default function RoomsPage() {
  const [property, setProperty] = useState('');
  const props = useQuery({ queryKey: ['properties'], queryFn: () => propertiesApi.list() });
  const rooms = useQuery({
    queryKey: ['adminRooms', property],
    queryFn: () => adminRoomsApi.list({ property: property || undefined }),
  });
  const [editing, setEditing] = useState<Room | null>(null);

  return (
    <div>
      <AdminPageHeader title="Номера" subtitle="Редактирование, фото, активность" />
      <div className="flex flex-wrap items-center gap-3 border-b border-black/5 bg-white px-8 py-3">
        <label className="text-xs">
          <span className="font-extrabold uppercase tracking-wider text-black/50">Объект</span>
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="ml-2 rounded-md border border-black/10 bg-white px-2 py-1.5 text-xs font-bold"
          >
            <option value="">Все</option>
            {(props.data?.items ?? []).map((p: Property) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.data?.items.map((r) => (
          <button
            key={r.id}
            onClick={() => setEditing(r)}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white text-left transition hover:shadow-card"
          >
            <div className="aspect-[4/3] w-full bg-[#fbfaf6]">
              {r.photos[0] ? (
                <img src={r.photos[0].url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs text-black/40">нет фото</div>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-black">{r.label}</div>
                <div className="text-[10px] uppercase tracking-wider text-black/50">#{r.shortLabel} · эт. {r.floor}</div>
              </div>
              <div className="mt-1 text-xs text-black/50">
                {r.photos.length} фото
              </div>
            </div>
          </button>
        ))}
        {rooms.isLoading && <div className="col-span-full p-8 text-sm text-black/50">Загрузка…</div>}
      </div>

      {editing && <RoomEditDrawer room={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function RoomEditDrawer({ room, onClose }: { room: Room; onClose: () => void }) {
  const qc = useQueryClient();
  const [label, setLabel] = useState(room.label);
  const [shortLabel, setShortLabel] = useState(room.shortLabel);
  const [floor, setFloor] = useState(room.floor);

  const update = useMutation({
    mutationFn: () =>
      adminRoomsApi.update(room.id, { label, shortLabel, floor }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminRooms'] });
    },
  });

  const upload = useMutation({
    mutationFn: async (files: File[]) => adminRoomsApi.uploadPhotos(room.id, files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminRooms'] }),
  });

  const del = useMutation({
    mutationFn: (photoId: number) => adminRoomsApi.deletePhoto(room.id, photoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminRooms'] }),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
      >
        <h3 className="font-display text-2xl font-black">{room.label}</h3>
        <p className="mt-1 text-sm text-black/50">Редактирование номера #{room.shortLabel}</p>

        <div className="mt-6 space-y-3">
          <Field label="Название">
            <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <Field label="Короткий ID">
            <input className="input" value={shortLabel} onChange={(e) => setShortLabel(e.target.value)} />
          </Field>
          <Field label="Этаж">
            <input type="number" className="input" value={floor} onChange={(e) => setFloor(Number(e.target.value))} />
          </Field>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" defaultChecked />
            Активен
          </label>
          <button
            onClick={() => update.mutate()}
            disabled={update.isPending}
            className="w-full rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black"
          >
            {update.isPending ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>

        <hr className="my-6 border-black/5" />
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-black/50">Фото</h4>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {room.photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-[#fbfaf6]">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => del.mutate(p.id)}
                className="absolute right-1 top-1 hidden rounded-md bg-rose-600/90 px-2 py-0.5 text-[10px] font-extrabold text-white group-hover:block"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-black/10 bg-[#fbfaf6] px-5 py-3 text-sm font-extrabold text-black/60 hover:border-reshka-yellow hover:text-reshka-black">
          Загрузить фото
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) upload.mutate(files);
            }}
          />
        </label>
        <style>{`.input { width: 100%; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; font-size: 14px; outline: none; }`}</style>
      </aside>
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
