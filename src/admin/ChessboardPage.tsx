import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, parseISO, startOfDay, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { chessboardApi } from '../api/bookings';
import type { ChessboardBar, Room } from '../api/types';
import { AdminButton, AdminPageHeader } from './AdminLayout';
import BookingCreateModal from './BookingCreateModal';
import BookingTooltip from './components/BookingTooltip';
import BookingDetailDrawer from './BookingDetailDrawer';

const DAYS_WINDOW = 40; // длина видимого окна
const START_OFFSET_DAYS = 3; // первый день = сегодня − 3
const STEP_DAYS = 30; // шаг стрелок «назад/вперёд»

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

// Цвет по статусу брони. Терминальные статусы (checked_out/cancelled/no_show)
// не рендерятся — бронь отфильтрована в barsByRoom.
function barColor(status: ChessboardBar['status']): string {
  switch (status) {
    case 'new':
      return 'bg-emerald-300 text-reshka-black';
    case 'confirmed':
      return 'bg-amber-300 text-reshka-black';
    case 'checked_in':
      return 'bg-sky-300 text-reshka-black';
    default:
      return 'bg-zinc-300 text-zinc-600';
  }
}

export default function ChessboardPage() {
  const today = startOfDay(new Date());
  const [windowStart, setWindowStart] = useState(() =>
    format(subDays(today, START_OFFSET_DAYS), 'yyyy-MM-dd'),
  );
  const [modal, setModal] = useState<{ roomId: number; date: string } | null>(null);
  const [openBookingId, setOpenBookingId] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<ChessboardBar | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const chessQuery = useQuery({
    queryKey: ['chessboard', windowStart, DAYS_WINDOW],
    queryFn: () => chessboardApi.get({ from: windowStart, days: DAYS_WINDOW }),
  });

  // Группируем бары по room для быстрого рендера. Терминальные брони
  // (выселен / отменён / неявка) тоже рисуем — для истории.
  const barsByRoom = useMemo(() => {
    const m = new Map<number, ChessboardBar[]>();
    if (!chessQuery.data) return m;
    for (const b of chessQuery.data.bookings) {
      if (!m.has(b.roomId)) m.set(b.roomId, []);
      m.get(b.roomId)!.push(b);
    }
    return m;
  }, [chessQuery.data]);

  function shiftWindow(days: number) {
    setWindowStart((prev) => format(addDays(parseISO(prev), days), 'yyyy-MM-dd'));
  }
  function jumpToDefault() {
    setWindowStart(format(subDays(startOfDay(new Date()), START_OFFSET_DAYS), 'yyyy-MM-dd'));
  }

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
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftWindow(-STEP_DAYS)}
            className="rounded-md p-2 hover:bg-black/5"
            title="Назад"
            aria-label="Назад"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={jumpToDefault}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold hover:border-black/20"
          >
            Сегодня
          </button>
          <button
            type="button"
            onClick={() => shiftWindow(STEP_DAYS)}
            className="rounded-md p-2 hover:bg-black/5"
            title="Вперёд"
            aria-label="Вперёд"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-black/50">
          {format(parseISO(windowStart), 'd MMM')} —{' '}
          {format(addDays(parseISO(windowStart), DAYS_WINDOW - 1), 'd MMM yyyy')}
        </span>
      </div>

      {chessQuery.isLoading && <div className="p-8 text-sm text-black/50">Загрузка…</div>}
      {chessQuery.error && <div className="p-8 text-sm text-rose-700">Ошибка: {String(chessQuery.error)}</div>}

      {chessQuery.data && (
        <div className="bg-white p-6">
          <ChessboardGrid
            rooms={chessQuery.data.rooms}
            days={chessQuery.data.days}
            barsByRoom={barsByRoom}
            windowStartISO={windowStart}
            onCellClick={(roomId, date) => setModal({ roomId, date })}
            onBarClick={(bar) => setOpenBookingId(bar.bookingId)}
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

      {openBookingId !== null && (
        <BookingDetailDrawer
          bookingId={openBookingId}
          onClose={() => setOpenBookingId(null)}
          onChanged={() => chessQuery.refetch()}
        />
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-black/60">
      <LegendDot className="bg-emerald-50 ring-1 ring-emerald-200/60" label="Свободно" />
      <LegendDot className="bg-emerald-300" label="Новая" />
      <LegendDot className="bg-amber-300" label="Подтверждена" />
      <LegendDot className="bg-sky-300" label="Заселена" />
      <LegendDot className="bg-zinc-300" label="Выехал" />
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
    <div className="relative">
      <div className="grid w-full" style={{ gridTemplateColumns: `260px repeat(${days.length}, minmax(0, 1fr))` }}>
        {/* Заголовок: левый столбец пустой, далее дни */}
        <div className="bg-white" />
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

      <NowMarker windowStartISO={windowStartISO} daysLength={days.length} />
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

  // Поиск бара под курсором через data-атрибут. Один обработчик на строку вместо N на бары.
  const barsById = useMemo(() => {
    const m = new Map<number, ChessboardBar>();
    for (const b of bars) m.set(b.bookingId, b);
    return m;
  }, [bars]);

  // Множество дат (yyyy-MM-dd), занятых активными бронями этого номера.
  // Терминальные статусы (выселен/отменён/неявка) не учитываем — комната снова свободна.
  // При этом сами бары продолжают отображаться (для истории).
  const occupiedDates = useMemo(() => {
    const s = new Set<string>();
    for (const b of bars) {
      if (b.status === 'checked_out' || b.status === 'cancelled' || b.status === 'no_show') continue;
      const start = startOfDay(parseISO(b.startISO));
      const end = startOfDay(parseISO(b.endISO));
      for (let d = start; d.getTime() < end.getTime(); d = addDays(d, 1)) {
        s.add(format(d, 'yyyy-MM-dd'));
      }
    }
    return s;
  }, [bars]);

  function handleRowMove(e: React.MouseEvent) {
    const target = e.target as HTMLElement | null;
    const idAttr = target?.closest('[data-booking-id]')?.getAttribute('data-booking-id');
    if (!idAttr) {
      onBarLeave();
      return;
    }
    const bar = barsById.get(Number(idAttr));
    if (bar) onBarHover(bar, e);
    else onBarLeave();
  }

  return (
    <>
      {/* метка номера (без sticky: overflow-x-auto у родителя убран) */}
      <div className="flex items-center border-b border-black/5 bg-white px-3 py-2">
        <div className="min-w-0 leading-tight">
          <div className="truncate text-sm font-extrabold">
            {room.propertyTitle ? `${room.propertyTitle} - ${room.shortLabel}` : room.shortLabel}
          </div>
        </div>
      </div>

      {/* строка номера: занимает все дневные колонки */}
      <div
        className="relative"
        style={{ gridColumn: `2 / ${days.length + 2}`, height: 56 }}
        onMouseMove={handleRowMove}
        onMouseLeave={onBarLeave}
      >
        {/* фон: дневные ячейки */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        >
          {days.map((d) => {
            const past = pastSet.has(d);
            const weekend = isWeekend(d);
            const occupied = occupiedDates.has(d);
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
                title={past ? 'Прошло' : occupied ? 'Занято' : 'Свободно'}
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
              data-booking-id={b.bookingId}
              onClick={(e) => {
                e.stopPropagation();
                onBarClick(b);
              }}
              className={clsx(
                'absolute top-1/2 z-20 -translate-y-1/2 overflow-hidden rounded-md px-2 text-left text-[10px] font-extrabold shadow-sm transition hover:z-30 hover:shadow-md',
                barColor(b.status),
              )}
              style={{ left: `${leftPct}%`, width: `${widthPct}%`, height: 32 }}
            >
              <span className="block truncate">
                {b.guestName || '—'}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// =========================
// NowMarker — красная вертикаль «сейчас», плавно ползёт по rAF
// =========================
function NowMarker({ windowStartISO, daysLength }: { windowStartISO: string; daysLength: number }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = parseISO(windowStartISO).getTime();
    const dayMs = 86400000;
    let raf = 0;

    function tick() {
      const el = lineRef.current;
      if (el) {
        const offsetDays = (Date.now() - start) / dayMs;
        if (offsetDays < 0 || offsetDays > daysLength) {
          el.style.opacity = '0';
        } else {
          el.style.opacity = '1';
          el.style.left = `${(offsetDays / daysLength) * 100}%`;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(raf);
  }, [windowStartISO, daysLength]);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 z-30"
      style={{ left: '260px', right: 0 }}
    >
      <div
        ref={lineRef}
        className="absolute bottom-0 w-px bg-rose-500"
        style={{ top: '60px' }}
      >
        <div className="absolute -top-1 -left-[3px] h-2 w-2 rounded-full bg-rose-500" />
      </div>
    </div>
  );
}
