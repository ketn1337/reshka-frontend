import { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ChessboardBar } from '../../api/types';

const STATUS_LABEL: Record<string, string> = {
  new: 'Новая',
  confirmed: 'Подтверждена',
  checked_in: 'Заселена',
};

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-amber-100 text-amber-900 ring-amber-300',
  confirmed: 'bg-amber-200 text-amber-900 ring-amber-400',
  checked_in: 'bg-rose-200 text-rose-900 ring-rose-400',
};

const SOURCE_LABEL: Record<string, string> = {
  site: 'Сайт',
  phone: 'Телефон',
  ota: 'OTA',
  max: 'Max',
  direct: 'Напрямую',
};

const rubFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function fmtDateTime(iso: string): string {
  return format(parseISO(iso), 'd MMM, HH:mm', { locale: ru });
}

function pluralNights(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ночь`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ночи`;
  return `${n} ночей`;
}

function pluralAdults(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} взрослый`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} взрослых`;
  return `${n} взрослых`;
}

const SHOW_DELAY_MS = 200;

export default function BookingTooltip({ bar, x, y }: { bar: ChessboardBar; x: number; y: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [armed, setArmed] = useState(false);

  // Сбрасываем состояние при смене бара. x,y в deps не нужны — внутри одного бара
  // таймер не сбрасывается на каждом пикселе, тултип появляется и держится.
  useEffect(() => {
    setPos(null);
    setArmed(false);
  }, [bar.bookingId]);

  // Задержка перед показом: не мерцает на быстром движении мыши.
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [bar.bookingId]);

  // Меряем размер тултипа, когда armed=true. Рендерим ниже всё равно
  // (visibility: hidden), чтобы ref.current был доступен — иначе замер никогда не случится.
  useEffect(() => {
    if (!armed) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = x + 16;
    let top = y + 16;
    if (left + rect.width > vw - 8) left = x - rect.width - 16;
    if (top + rect.height > vh - 8) top = y - rect.height - 16;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    setPos({ left, top });
  }, [x, y, armed, bar.bookingId]);

  if (!armed) return null;

  const status = STATUS_LABEL[bar.status] ?? bar.status;
  const statusColor = STATUS_COLOR[bar.status] ?? 'bg-zinc-100 text-zinc-900 ring-zinc-300';
  const source = SOURCE_LABEL[bar.source] ?? bar.source;

  // До измерения держим элемент за экраном и невидимым — мерцания в (0,0) нет.
  const style: React.CSSProperties = pos
    ? { left: pos.left, top: pos.top, visibility: 'visible' }
    : { left: -9999, top: -9999, visibility: 'hidden' };

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 w-72 rounded-2xl bg-white p-4 text-sm shadow-2xl ring-1 ring-black/10"
      style={style}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="font-display text-base font-black text-reshka-black">{bar.code}</div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ring-1 ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="my-2 h-px bg-black/5" />
      <dl className="space-y-1.5 text-xs">
        <Row label="Заезд" value={fmtDateTime(bar.startISO)} />
        <Row label="Выезд" value={fmtDateTime(bar.endISO)} />
        <Row label="Ночей" value={pluralNights(bar.nights)} />
        <Row label="Гость" value={bar.guestName || '—'} />
        <Row label="Гостей" value={pluralAdults(bar.adults)} />
        <Row label="Источник" value={source} />
        <Row label="Сумма" value={rubFormat.format(bar.totalAmount)} bold />
      </dl>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-black/50">{label}</dt>
      <dd className={bold ? 'font-extrabold text-reshka-black' : 'font-bold text-reshka-black'}>{value}</dd>
    </div>
  );
}
