import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, parseISO, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { chessboardApi } from '../api/bookings';
import type { ChessboardBar, Room } from '../api/types';
import { AdminButton, AdminPageHeader } from './AdminLayout';
import BookingCreateModal from './BookingCreateModal';
import BookingTooltip from './components/BookingTooltip';
import { pushPath } from '../lib/route';

const DAY_OPTIONS = [7, 14, 30];

function fmtDay(iso: string): { d: string; w: string; m: string; date: Date } {
  const date = parseISO(iso);
  return { d: format(date, 'd'), w: format(date, 'EEE'), m: format(date, 'MMM'), date };
}

function isWeekend(iso: string): boolean {
  const wd = format(parseISO(iso), 'EEE');
  return wd === 'сб' || wd === 'вс';
}

// Возвращает смещение в долях дня от windowStart.
function barLeft(bar: ChessboardBar, windowStartISO: string): number {
  const start = parseISO(bar.startISO);
  const win = startOfDay(parseISO(windowStartISO));
  const diffMs = start.getTime() - win.getTime();
  return diffMs / (24 * 60 * 60 * 1000);
}

// Длина бара в днях.
function barSpan(bar: ChessboardBar): number {
  const start = parseISO(bar.startISO);
  const end = parseISO(bar.endISO);
  return (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
}

// Цвет по статусу (только активные: new/confirmed/checked_in).
function barColor(status: ChessboardBar['status']): string {
  switch (status) {
    case 'checked_in':
      return 'bg-rose-500 text-white';
    case 'confirmed':
    case 'new':
    default:
      return 'bg-amber-400 text-reshka-black';
  }
}

export default function ChessboardPage() {
  const [days, setDays] = useState(14);
  const today = startOfDay(new Date());
  const [from, setFrom] = useState(format(today, 'yyyy-MM-dd'));
  const [modal, setModal] = useState<{ roomId: number; date: string } | null>(null);
  const [hoveredBar, setHoveredBar] = useState<ChessboardBar | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const chessQuery = useQuery({
    queryKey: ['chessboard', from, days],
    queryFn: () => chessboardApi.get({ from, days }),
  });

  function shiftDays(n: number) {
    setFrom((f) => format(addDays(parseISO(f), n), 'yyyy-MM-dd'));
  }
  function jumpToday() {
    setFrom(format(today, 'yyyy-MM-dd'));
  }

  // Группируем бары по room для быстрого рендера.
  const barsByRoom = useMemo(() => {
    const m = new Map<number, ChessboardBar[]>();
    if (!chessQuery.data) return m;
    for (const b of chessQuery.data.bookings) {
      if (!m.has(b.roomId)) m.set(b.roomId, []);
      m.get(b.roomId)!.push(b);
    }
    return m;
  }, [chessQuery.data]);

  return (
    <div>
      <AdminPageHeader
        title="Шахматка бронирований"
        subtitle={`все номера · ${chessQuery.data?.rooms.length ?? 0} шт. · клик по ячейке — создать бронь, по полосе — открыть`}
        actions={
          <AdminButton onClick={() => setModal({ roomId: 0, date: format(today, 'yyyy-MM-dd') })}>
            <Plus className="h-4 w-4" /> Новая бронь
          </AdminButton>
        }
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-black/5 bg-white px-8 py-3">
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => shiftDays(-days)} className="rounded-md p-2 hover:bg-black/5" title="Назад">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={jumpToday}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold hover:border-black/20"
          >
            Сегодня
          </button>
          <button type="button" onClick={() => shiftDays(days)} className="rounded-md p-2 hover:bg-black/5" title="Вперёд">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex overflow-hidden rounded-md border border-black/10">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={clsx(
                'px-3 py-1.5 text-xs font-extrabold',
                days === d ? 'bg-reshka-yellow text-reshka-black' : 'bg-white text-black/60 hover:bg-black/5',
              )}
            >
              {d}д
            </button>
          ))}
        </div>
        <span className="text-xs text-black/50">
          {format(parseISO(from), 'd MMM yyyy')} — {format(addDays(parseISO(from), days - 1), 'd MMM yyyy')}
        </span>
      </div>

      {chessQuery.isLoading && <div className="p-8 text-sm text-black/50">Загрузка…</div>}
      {chessQuery.error && <div className="p-8 text-sm text-rose-700">Ошибка: {String(chessQuery.error)}</div>}

      {chessQuery.data && (
        <div className="overflow-x-auto bg-white p-6">
          <ChessboardGrid
            rooms={chessQuery.data.rooms}
            days={chessQuery.data.days}
            barsByRoom={barsByRoom}
            windowStartISO={from}
            onCellClick={(roomId, date) => setModal({ roomId, date })}
            onBarClick={(bar) => pushPath(`/admin/bookings/${bar.bookingId}`)}
            onBarHover={(bar, e) => {
              setHoveredBar(bar);
              setHoverPos({ x: e.clientX, y: e.clientY });
            }}
            onBarLeave={() => {
              setHoveredBar(null);
              setHoverPos(null);
            }}
          />
          <Legend />
        </div>
      )}

      {hoveredBar && hoverPos && (
        <BookingTooltip bar={hoveredBar} x={hoverPos.x} y={hoverPos.y} />
      )}

      {modal && (
        <BookingCreateModal
          initialRoomId={modal.roomId || undefined}
          initialDate={modal.date}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            chessQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-black/60">
      <LegendDot className="bg-emerald-50 ring-1 ring-emerald-200/60" label="Свободно" />
      <LegendDot className="bg-amber-400" label="Забронировано" />
      <LegendDot className="bg-rose-500" label="Заселено" />
      <LegendDot className="bg-rose-100" label="Выходной (сб/вс)" />
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={clsx('inline-block h-3 w-6 rounded', className)} />
      {label}
    </span>
  );
}

// =========================
// ChessboardGrid — фоны (дни) + бары (брони) поверх
// =========================
interface GridProps {
  rooms: Room[];
  days: string[];
  barsByRoom: Map<number, ChessboardBar[]>;
  windowStartISO: string;
  onCellClick: (roomId: number, date: string) => void;
  onBarClick: (bar: ChessboardBar) => void;
  onBarHover: (bar: ChessboardBar, e: React.MouseEvent) => void;
  onBarLeave: () => void;
}

function ChessboardGrid({ rooms, days, barsByRoom, windowStartISO, onCellClick, onBarClick, onBarHover, onBarLeave }: GridProps) {
  return (
    <div className="inline-grid min-w-full" style={{ gridTemplateColumns: `260px repeat(${days.length}, minmax(56px, 1fr))` }}>
      {/* Заголовок: левый столбец пустой, далее дни */}
      <div className="sticky left-0 z-10 bg-white" />
      {days.map((d) => {
        const { d: day, w: wd, m: month } = fmtDay(d);
        const weekend = isWeekend(d);
        return (
          <div
            key={d}
            className={clsx(
              'border-b border-l border-black/5 px-2 py-2 text-center text-[10px] font-extrabold',
              weekend && 'bg-rose-50/50',
            )}
          >
            <div className="text-black/40">{wd}</div>
            <div className="text-sm font-black text-reshka-black">{day}</div>
            <div className="text-[9px] uppercase text-black/40">{month}</div>
          </div>
        );
      })}

      {rooms.map((r) => (
        <RoomRow
          key={r.id}
          room={r}
          days={days}
          bars={barsByRoom.get(r.id) ?? []}
          windowStartISO={windowStartISO}
          onCellClick={onCellClick}
          onBarClick={onBarClick}
          onBarHover={onBarHover}
          onBarLeave={onBarLeave}
        />
      ))}
    </div>
  );
}

function RoomRow({
  room,
  days,
  bars,
  windowStartISO,
  onCellClick,
  onBarClick,
  onBarHover,
  onBarLeave,
}: {
  room: Room;
  days: string[];
  bars: ChessboardBar[];
  windowStartISO: string;
  onCellClick: (roomId: number, date: string) => void;
  onBarClick: (bar: ChessboardBar) => void;
  onBarHover: (bar: ChessboardBar, e: React.MouseEvent) => void;
  onBarLeave: () => void;
}) {
  const todayISO = format(new Date(), 'yyyy-MM-dd');
  // Помощник: какие из видимых дней «в прошлом»
  const pastSet = useMemo(() => {
    const s = new Set<string>();
    for (const d of days) if (d < todayISO) s.add(d);
    return s;
  }, [days, todayISO]);

  return (
    <>
      {/* sticky left: метка номера */}
      <div className="sticky left-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white px-3 py-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-reshka-yellow/15 text-xs font-black text-reshka-black">
          {room.shortLabel}
        </span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-extrabold">
            {room.propertyTitle ? `${room.propertyTitle} — ${room.label}` : room.label}
          </div>
          <div className="truncate text-[10px] uppercase tracking-wider text-black/50">
            {room.kindTitle ?? ''} · этаж {room.floor}
          </div>
        </div>
      </div>

      {/* строка номера: занимает все дневные колонки */}
      <div
        className="relative"
        style={{ gridColumn: `2 / ${days.length + 2}`, height: 56 }}
      >
        {/* фон: дневные ячейки */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(56px, 1fr))` }}
        >
          {days.map((d) => {
            const past = pastSet.has(d);
            const weekend = isWeekend(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => onCellClick(room.id, d)}
                className={clsx(
                  'h-full border-b border-l border-black/5 transition hover:ring-2 hover:ring-inset hover:ring-reshka-yellow/40',
                  past ? 'bg-zinc-100' : 'bg-emerald-50/40 hover:bg-emerald-100',
                  weekend && !past && 'bg-rose-50/60',
                )}
                title={past ? 'Прошло' : 'Свободно'}
              />
            );
          })}
        </div>

        {/* бары броней поверх */}
        {bars.map((b) => {
          const startDayOffset = barLeft(b, windowStartISO);
          const span = barSpan(b);
          // Клипим за пределы окна
          const leftPct = Math.max(0, startDayOffset / days.length) * 100;
          const rightPct = Math.min(days.length, startDayOffset + span) / days.length * 100;
          const widthPct = Math.max(0, rightPct - leftPct);
          if (widthPct <= 0) return null;
          return (
            <button
              key={b.bookingId}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBarClick(b);
              }}
              onMouseEnter={(e) => onBarHover(b, e)}
              onMouseMove={(e) => onBarHover(b, e)}
              onMouseLeave={onBarLeave}
              className={clsx(
                'absolute top-1/2 z-20 -translate-y-1/2 overflow-hidden rounded-md px-2 text-left text-[10px] font-extrabold shadow-sm transition hover:z-30 hover:shadow-md',
                barColor(b.status),
              )}
              style={{ left: `${leftPct}%`, width: `${widthPct}%`, height: 32 }}
            >
              <span className="block truncate">
                {b.code.slice(-6)} · {b.guestName || '—'} · {b.nights}н
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
