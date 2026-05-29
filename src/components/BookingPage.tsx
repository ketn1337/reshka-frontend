import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import {
  buildBookingParams,
  findCatalogRoom,
  formatCurrency,
  formatDateRange,
  getGuestLabel,
  getNightLabel,
  getNights,
  getPrepaymentAmount,
  parseBookingQuery,
  pushAppPath,
} from '../booking';

type BookingPageProps = {
  search: string;
};

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description?: string;
};

function DetailItem({ icon, label, value, description }: DetailItemProps) {
  return (
    <div className="min-h-0 rounded-[18px] border border-black/10 bg-[#fbfaf6] p-2 sm:p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/42 sm:mb-1.5 sm:text-xs">
        {icon}
        {label}
      </div>
      <p className="truncate text-sm font-black text-reshka-black sm:text-base">{value}</p>
      {description && <p className="mt-0.5 hidden truncate text-xs font-semibold text-black/48 sm:block">{description}</p>}
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-bold leading-5 text-black/52 sm:text-sm">{label}</span>
      <span className="shrink-0 text-right text-sm font-black text-reshka-black sm:text-base">{value}</span>
    </div>
  );
}

export default function BookingPage({ search }: BookingPageProps) {
  const query = useMemo(() => parseBookingQuery(search), [search]);
  const room = findCatalogRoom(query.roomTitle);
  const nights = getNights(query.checkIn, query.checkOut);
  const total = room.rate * nights;
  const prepayment = getPrepaymentAmount(total);
  const dateSummary = formatDateRange(query.checkIn, query.checkOut);

  const handleBack = () => {
    const params = new URLSearchParams();
    if (query.checkIn) params.set('checkIn', query.checkIn);
    if (query.checkOut) params.set('checkOut', query.checkOut);
    if (query.guests) params.set('guests', String(query.guests));

    pushAppPath(`/rooms${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleReserve = () => {
    const params = buildBookingParams({
      roomTitle: room.title,
      checkIn: query.checkIn,
      checkOut: query.checkOut,
      guests: query.guests,
      createdAt: Date.now(),
    });

    pushAppPath(`/booking/confirmation?${params.toString()}`);
  };

  return (
    <div className="h-[100svh] overflow-hidden bg-[#fbfaf6] text-reshka-black">
      <main className="section-shell flex h-full min-h-0 flex-col py-3 sm:py-4 lg:py-5">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-reshka-black shadow-sm transition hover:border-reshka-yellow hover:bg-reshka-yellow/12 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 text-reshka-yellow" />
            К результатам
          </button>

        </div>

        <div className="my-2 grid shrink-0 gap-2 lg:my-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">Оформление брони</p>
            <h1 className="mt-1 font-display text-xl font-black leading-tight text-reshka-black sm:text-4xl lg:text-5xl">
              Проверьте детали проживания
            </h1>
            <p className="mt-1 hidden text-xs font-semibold leading-5 text-black/55 sm:block sm:text-sm">
              После клика номер будет закреплён за вами на 1 час.
            </p>
          </div>

        </div>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid min-h-0 overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-card lg:grid-rows-[minmax(180px,42%)_minmax(0,1fr)]"
          >
            <div className="relative h-24 min-h-0 overflow-hidden bg-reshka-black sm:h-40 lg:h-auto">
              <img
                src={room.image}
                alt={`Номер ${room.title} в отеле О! Решка`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/14 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <div className="mb-1.5 inline-flex rounded-full bg-reshka-yellow px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-reshka-black sm:text-xs">
                    {room.accent}
                  </div>
                  <h2 className="font-display text-2xl font-black leading-none text-white sm:text-4xl">
                    {room.title}
                  </h2>
                </div>
                <div className="rounded-full bg-white/92 px-3 py-1.5 text-xs font-black text-reshka-black">
                  {formatCurrency(room.rate)} / ночь
                </div>
              </div>
            </div>

            <div className="min-h-0 p-3 sm:p-4 lg:p-5">
              <p className="hidden max-w-3xl text-sm font-medium leading-6 text-black/60 sm:block">
                {room.description}
              </p>

              <div className="grid grid-cols-2 gap-2 sm:mt-3 lg:mt-4">
                <DetailItem
                  icon={<CalendarDays className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                  label="Даты"
                  value={dateSummary}
                  description={getNightLabel(nights)}
                />
                <DetailItem
                  icon={<Users className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                  label="Гости"
                  value={getGuestLabel(query.guests)}
                  description={`до ${room.capacity} гостей`}
                />
                <DetailItem
                  icon={<BedDouble className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                  label="Размещение"
                  value={room.beds}
                  description={`${room.area}, ${room.floor}`}
                />
                <DetailItem
                  icon={<ShieldCheck className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                  label="Включено"
                  value={room.perks[0]}
                  description={room.perks[1]}
                />
              </div>
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex h-full min-h-0 shrink-0 flex-col rounded-[24px] border border-black/10 bg-white p-3 shadow-card sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between gap-3 lg:block">
              <div>
                <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">Бронирование</p>
                <h2 className="mt-1 font-display text-lg font-black leading-tight text-reshka-black sm:text-2xl">
                  Подтвердите выбор
                </h2>
              </div>
              <div className="rounded-full bg-reshka-yellow/18 px-3 py-1.5 text-xs font-black text-reshka-black lg:hidden">
                удержание 1 час
              </div>
            </div>

            <div className="mt-2 space-y-1.5 border-y border-black/10 py-2.5 lg:mt-3 lg:space-y-3 lg:py-4">
              <PriceRow label="Проживание" value={formatCurrency(total)} />
              <PriceRow label="Предоплата" value={formatCurrency(prepayment)} />
              <PriceRow label="Срок удержания" value="1 час" />
            </div>

            <div className="mt-2 flex gap-2 rounded-[18px] border border-reshka-yellow/35 bg-reshka-yellow/14 p-2.5 lg:mt-3 lg:p-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-reshka-black" />
              <p className="text-xs font-bold leading-5 text-reshka-black">
                Для подтверждения нужны документы и предоплата.
              </p>
            </div>

            <div className="mt-auto pt-2 sm:pt-3">
              <button
                onClick={handleReserve}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-reshka-yellow px-5 py-2.5 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 hover:bg-reshka-yellowSoft sm:min-h-11 sm:py-3 sm:text-base"
              >
                <CheckCircle2 className="h-5 w-5" />
                Забронировать
              </button>

              <div className="mt-2 hidden items-center gap-2 text-xs font-semibold leading-5 text-black/46 sm:flex">
                <WalletCards className="h-4 w-4 text-reshka-yellow" />
                Оплата и документы запрашиваются после закрепления номера.
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
