import { motion } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import heroHome from "../assets/hero-home.png";
import {
  getRoomsByKind,
  roomKindLabels,
  roomKindOrder,
  roomProperties,
  type RoomKind,
} from "../roomInventory";
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
} from "../booking";

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

      <p className="truncate text-sm font-black text-reshka-black sm:text-base">
        {value}
      </p>

      {description && (
        <p className="mt-0.5 hidden truncate text-xs font-semibold text-black/48 sm:block">
          {description}
        </p>
      )}
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-bold leading-5 text-black/52 sm:text-sm">
        {label}
      </span>

      <span className="shrink-0 text-right text-sm font-black text-reshka-black sm:text-base">
        {value}
      </span>
    </div>
  );
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function findRoomKindByTitle(roomTitle: string): RoomKind | undefined {
  const normalizedTitle = normalizeText(roomTitle);

  return roomKindOrder.find((roomKind) => {
    const normalizedLabel = normalizeText(roomKindLabels[roomKind]);

    return (
      normalizedTitle === normalizedLabel ||
      normalizedTitle.includes(normalizedLabel) ||
      normalizedLabel.includes(normalizedTitle)
    );
  });
}

function getBookingRoomImages(roomTitle: string) {
  const normalizedTitle = normalizeText(roomTitle);
  const matchedKind = findRoomKindByTitle(roomTitle);

  if (matchedKind) {
    const roomsByKind = roomProperties.flatMap((property) =>
      getRoomsByKind(property, matchedKind),
    );

    const roomWithImages = roomsByKind.find((room) => room.images.length > 0);

    if (roomWithImages?.images.length) {
      return roomWithImages.images;
    }
  }

  const allRooms = roomProperties.flatMap((property) => property.rooms);

  const matchedRoom = allRooms.find((room) => {
    const normalizedLabel = normalizeText(room.label);
    const normalizedShortLabel = normalizeText(room.shortLabel);

    return (
      normalizedLabel === normalizedTitle ||
      normalizedShortLabel === normalizedTitle ||
      normalizedLabel.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedLabel)
    );
  });

  if (matchedRoom?.images.length) {
    return matchedRoom.images;
  }

  const firstRoomWithImages = allRooms.find((room) => room.images.length > 0);

  return firstRoomWithImages?.images.length
    ? firstRoomWithImages.images
    : [heroHome];
}

export default function BookingPage({ search }: BookingPageProps) {
  const query = useMemo(() => parseBookingQuery(search), [search]);
  const room = findCatalogRoom(query.roomTitle);

  const roomImages = useMemo(
    () => getBookingRoomImages(room.title),
    [room.title],
  );
  const roomCover = roomImages[2] || heroHome;

  const nights = getNights(query.checkIn, query.checkOut);
  const total = room.rate * nights;
  const prepayment = getPrepaymentAmount(total);
  const dateSummary = formatDateRange(query.checkIn, query.checkOut);

  const handleBack = () => {
    const params = new URLSearchParams();

    if (query.checkIn) params.set("checkIn", query.checkIn);
    if (query.checkOut) params.set("checkOut", query.checkOut);
    if (query.guests) params.set("guests", String(query.guests));

    pushAppPath(`/rooms${params.toString() ? `?${params.toString()}` : ""}`);
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
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-reshka-black shadow-sm transition hover:border-reshka-yellow hover:bg-reshka-yellow/12 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 text-reshka-yellow" />К результатам
          </button>
        </div>

        <div className="my-2 grid shrink-0 gap-2 lg:my-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">
              Оформление брони
            </p>

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
            className="grid min-h-0 overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-card lg:grid-rows-[minmax(220px,42%)_minmax(0,1fr)]"
          >
            <div className="relative min-h-[240px] overflow-hidden bg-reshka-black sm:min-h-[320px] lg:min-h-0">
              {/* Размытый фон, чтобы не было пустых чёрных полей */}
              <img
                src={roomCover}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-55 blur-2xl"
              />

              {/* Основная картинка без обрезки */}
              <img
                src={roomCover}
                alt={`Интерьер номера ${room.title} в хостеле О! Решка`}
                className="absolute inset-0 z-0 h-full w-full object-contain"
              />

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/82 via-black/18 to-black/5" />
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-black/12" />

              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex rounded-full bg-reshka-yellow px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-reshka-black sm:text-xs">
                    {room.accent}
                  </div>

                  <h2 className="max-w-[720px] font-display text-3xl font-black leading-none text-white sm:text-5xl">
                    {room.title}
                  </h2>
                </div>

                <div className="shrink-0 rounded-full bg-white/92 px-3 py-1.5 text-xs font-black text-reshka-black shadow-lg backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
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
                  icon={
                    <CalendarDays className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />
                  }
                  label="Даты"
                  value={dateSummary}
                  description={getNightLabel(nights)}
                />

                <DetailItem
                  icon={
                    <Users className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />
                  }
                  label="Гости"
                  value={getGuestLabel(query.guests)}
                  description={`до ${room.capacity} гостей`}
                />

                <DetailItem
                  icon={
                    <BedDouble className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />
                  }
                  label="Размещение"
                  value={room.beds}
                  description={`${room.area}, ${room.floor}`}
                />

                <DetailItem
                  icon={
                    <ShieldCheck className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />
                  }
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
                <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">
                  Бронирование
                </p>

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
                type="button"
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
