import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Building2,
  CalendarDays,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  buildBookingParams,
  type CatalogRoom,
  formatCurrency,
  formatDate,
  getGuestLabel,
  getNightLabel,
  getNights,
  parseResultsQuery,
  pushAppPath,
  roomTypes,
  type ResultsQuery,
} from '../booking';
import {
  buildRoomViewPath,
  getAvailableRoomKinds,
  getRoomKindDetail,
  getRoomsByKind,
  roomKindLabels,
  roomProperties,
  type PropertyView,
  type RoomKind,
  type RoomUnit,
} from '../roomInventory';

type SearchResultsPageProps = {
  search: string;
};

type SortMode = 'recommended' | 'priceAsc' | 'priceDesc';

type SearchOffer = {
  id: string;
  property: PropertyView;
  roomKind: RoomKind;
  room: CatalogRoom;
  units: RoomUnit[];
  available: number;
};

const searchOffers: SearchOffer[] = roomProperties.flatMap((property) =>
  getAvailableRoomKinds(property).map((roomKind) => {
    const units = getRoomsByKind(property, roomKind);

    return {
      id: `${property.id}-${roomKind}`,
      property,
      roomKind,
      room: getRoomKindDetail(roomKind),
      units,
      available: units.length,
    };
  }),
);

const featureFilters = [
  {
    label: 'Бесплатная отмена',
    matcher: (room: CatalogRoom) => room.perks.some((perk) => perk.includes('отмена')),
  },
  {
    label: 'Рабочее место',
    matcher: (room: CatalogRoom) =>
      room.amenities.includes('Рабочий стол') || room.tags.includes('Рабочее место'),
  },
  {
    label: 'Кофе-станция',
    matcher: (room: CatalogRoom) =>
      room.amenities.includes('Кофе-станция') || room.tags.includes('Кофе-станция'),
  },
  {
    label: 'Blackout шторы',
    matcher: (room: CatalogRoom) =>
      room.amenities.includes('Blackout шторы') || room.tags.includes('Blackout шторы'),
  },
];

function navigateToResults(form: HTMLFormElement) {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  const checkIn = String(formData.get('checkIn') || '');
  const checkOut = String(formData.get('checkOut') || '');
  const guests = String(formData.get('guests') || '2');
  const roomType = String(formData.get('roomType') || '');

  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  if (guests) params.set('guests', guests);
  if (roomType && roomType !== 'Любой номер') params.set('roomType', roomType);

  window.history.pushState(null, '', `/rooms${params.toString() ? `?${params.toString()}` : ''}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToRoomView(offer: SearchOffer, query: ResultsQuery) {
  pushAppPath(buildRoomViewPath({
    propertyId: offer.property.id,
    roomKind: offer.roomKind,
    roomId: offer.units[0]?.id,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    guests: query.guests,
  }));
}

function navigateToBooking(offer: SearchOffer, query: ResultsQuery) {
  const params = buildBookingParams({
    roomTitle: offer.room.title,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    guests: query.guests,
  });

  pushAppPath(`/booking?${params.toString()}`);
}

function getRoomCountLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} номер`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} номера`;
  return `${count} номеров`;
}

export default function SearchResultsPage({ search }: SearchResultsPageProps) {
  const [sortMode, setSortMode] = useState<SortMode>('recommended');
  const [maxPrice, setMaxPrice] = useState(16000);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const query = useMemo(() => parseResultsQuery(search), [search]);

  const nights = getNights(query.checkIn, query.checkOut);
  const dateSummary =
    query.checkIn && query.checkOut
      ? `${formatDate(query.checkIn)} - ${formatDate(query.checkOut)}`
      : 'любые даты';

  const filteredOffers = useMemo(() => {
    const selectedMatchers = featureFilters.filter((filter) => selectedFeatures.includes(filter.label));

    const results = searchOffers.filter((offer) => {
      const room = offer.room;
      const matchesType = !query.roomType || room.title === query.roomType;
      const matchesGuests = room.capacity >= query.guests;
      const matchesPrice = room.rate <= maxPrice;
      const matchesFeatures = selectedMatchers.every((filter) => filter.matcher(room));

      return matchesType && matchesGuests && matchesPrice && matchesFeatures;
    });

    return [...results].sort((a, b) => {
      if (sortMode === 'priceAsc') return a.room.rate - b.room.rate;
      if (sortMode === 'priceDesc') return b.room.rate - a.room.rate;
      return Number(b.room.rating) - Number(a.room.rating) || a.room.rate - b.room.rate;
    });
  }, [maxPrice, query.guests, query.roomType, selectedFeatures, sortMode]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToResults(event.currentTarget);
  };

  const toggleFeature = (label: string) => {
    setSelectedFeatures((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  };

  const clearFilters = () => {
    setMaxPrice(16000);
    setSelectedFeatures([]);
    setSortMode('recommended');
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <section id="booking" className="relative overflow-hidden bg-reshka-black pb-8 pt-10 text-white sm:pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,201,14,0.18),transparent_34%,rgba(255,255,255,0.06))]" />
        <div className="section-shell relative">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Результаты поиска</p>
              <h1 className="mt-3 font-display text-4xl font-black leading-tight text-white sm:text-6xl">
                Доступные номера
              </h1>
            </div>
            <p className="max-w-xl text-base font-medium leading-7 text-white/68">
              Подобрали варианты по датам, числу гостей и типу номера. Цены указаны за ночь и пересчитаны для всего проживания.
            </p>
          </div>

          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[30px] border border-white/15 bg-white p-4 text-reshka-black shadow-card md:p-5"
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr_1fr_auto]">
              <label className="rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                  <CalendarDays className="h-4 w-4 text-reshka-yellow" />
                  Заезд
                </span>
                <input
                  type="date"
                  name="checkIn"
                  defaultValue={query.checkIn}
                  required
                  className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
                />
              </label>

              <label className="rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                  <CalendarDays className="h-4 w-4 text-reshka-yellow" />
                  Выезд
                </span>
                <input
                  type="date"
                  name="checkOut"
                  defaultValue={query.checkOut}
                  required
                  className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
                />
              </label>

              <label className="rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                  <Users className="h-4 w-4 text-reshka-yellow" />
                  Гости
                </span>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="6"
                  defaultValue={query.guests}
                  className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
                />
              </label>

              <label className="rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                  Тип номера
                </span>
                <select
                  name="roomType"
                  defaultValue={query.roomType}
                  className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type === 'Любой номер' ? '' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <button className="inline-flex min-h-[76px] items-center justify-center gap-2 rounded-[24px] bg-reshka-black px-6 py-4 text-base font-extrabold text-white shadow-xl transition hover:-translate-y-1 hover:bg-black lg:min-w-48">
                <Search className="h-5 w-5 text-reshka-yellow" />
                Найти
              </button>
            </div>
          </motion.form>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-white/82">
            <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2">{dateSummary}</span>
            <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2">
              {getNightLabel(nights)}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2">
              {getGuestLabel(query.guests)}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2">
              {query.roomType || 'все типы'}
            </span>
          </div>
        </div>
      </section>

      <main className="section-shell py-8 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Номера</p>
            <h2 className="mt-2 font-display text-3xl font-black text-reshka-black sm:text-4xl">
              {filteredOffers.length > 0
                ? `Найдено ${filteredOffers.length} ${filteredOffers.length === 1 ? 'предложение' : 'предложения'}`
                : 'Нет подходящих номеров'}
            </h2>
          </div>

          <label className="flex min-h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-reshka-yellow" />
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="border-0 bg-transparent text-sm font-extrabold text-reshka-black outline-none"
            >
              <option value="recommended">Сначала рекомендованные</option>
              <option value="priceAsc">Сначала дешевле</option>
              <option value="priceDesc">Сначала дороже</option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[28px] border border-black/10 bg-white p-5 shadow-card lg:sticky lg:top-28">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-reshka-yellow" />
                <h3 className="font-display text-xl font-black">Фильтры</h3>
              </div>
              <Filter className="h-5 w-5 text-black/30" />
            </div>

            <div className="border-t border-black/10 py-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold text-reshka-black">Цена за ночь</p>
                <span className="text-sm font-black text-black/55">до {formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="7000"
                max="16000"
                step="500"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-reshka-yellow"
              />
            </div>

            <div className="border-t border-black/10 py-5">
              <p className="mb-3 text-sm font-extrabold text-reshka-black">Опции</p>
              <div className="space-y-3">
                {featureFilters.map((filter) => (
                  <label key={filter.label} className="flex items-center gap-3 text-sm font-bold text-black/70">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(filter.label)}
                      onChange={() => toggleFeature(filter.label)}
                      className="h-4 w-4 accent-reshka-yellow"
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm font-extrabold text-reshka-black transition hover:border-reshka-yellow hover:bg-reshka-yellow/15"
            >
              <X className="h-4 w-4" />
              Сбросить
            </button>
          </aside>

          <div id="rooms" className="space-y-5 scroll-mt-28">
            {filteredOffers.map((offer, index) => {
              const room = offer.room;
              const total = room.rate * nights;
              const unitPreview = offer.units
                .slice(0, 6)
                .map((unit) => unit.shortLabel)
                .join(', ');
              const hiddenUnits = offer.units.length > 6 ? ` + ещё ${offer.units.length - 6}` : '';

              return (
                <motion.article
                  key={offer.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow xl:grid xl:grid-cols-[300px_minmax(0,1fr)_230px]"
                >
                  <div className="relative h-64 overflow-hidden bg-reshka-black xl:h-72">
                    <img
                      src={room.image}
                      alt={`${room.title} на ${offer.property.title} в отеле О! Решка`}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-reshka-yellow px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-reshka-black">
                      {room.accent}
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-sm font-black text-reshka-black">
                      <Star className="h-4 w-4 fill-reshka-yellow text-reshka-yellow" />
                      {room.rating}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black/42">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-reshka-yellow" />
                        {offer.property.title}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-black/20" />
                      <span>{roomKindLabels[offer.roomKind]}</span>
                      <span className="h-1 w-1 rounded-full bg-black/20" />
                      <span>{room.area}</span>
                    </div>

                    <h3 className="font-display text-3xl font-black text-reshka-black">
                      <button
                        type="button"
                        onClick={() => navigateToRoomView(offer, query)}
                        className="text-left transition hover:text-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reshka-yellow"
                      >
                        {offer.property.title}: {room.title}
                      </button>
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-black/60">
                      {room.description}
                    </p>

                    <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-[#fbfaf6] px-3 py-2 text-xs font-extrabold text-black/58">
                      <Building2 className="h-4 w-4 shrink-0 text-reshka-yellow" />
                      <span className="truncate">Номера: {unitPreview}{hiddenUnits}</span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm font-bold text-reshka-black sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-reshka-yellow" />
                        {room.beds}
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-reshka-yellow" />
                        {room.perks[0]}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {room.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-[#fbfaf6] px-3 py-2 text-xs font-extrabold text-black/58"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 border-t border-black/10 p-5 sm:p-6 xl:border-l xl:border-t-0">
                    <div>
                      <p className="text-sm font-bold text-black/50">Свободно {getRoomCountLabel(offer.available)}</p>
                      <div className="mt-3">
                        <p className="font-display text-3xl font-black text-reshka-black">
                          {formatCurrency(room.rate)}
                        </p>
                        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.16em] text-black/42">
                          за ночь
                        </p>
                      </div>
                      <div className="mt-5 border-t border-black/10 pt-4">
                        <p className="text-sm font-bold text-black/50">Итого за {getNightLabel(nights)}</p>
                        <p className="mt-1 text-xl font-black text-reshka-black">{formatCurrency(total)}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold leading-5 text-black/45">
                      Фильтры: {offer.property.title}, {roomKindLabels[offer.roomKind]}.
                    </p>

                    <button
                      onClick={() => navigateToBooking(offer, query)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-reshka-yellow px-5 py-3 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 hover:bg-reshka-yellowSoft"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Выбрать номер
                    </button>
                  </div>
                </motion.article>
              );
            })}

            {filteredOffers.length === 0 && (
              <div className="rounded-[30px] border border-black/10 bg-white p-8 text-center shadow-card">
                <h3 className="font-display text-3xl font-black text-reshka-black">Свободных номеров не найдено</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-6 text-black/60">
                  Попробуйте расширить бюджет, убрать дополнительные опции или выбрать другой тип номера.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-reshka-black px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <X className="h-4 w-4 text-reshka-yellow" />
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
