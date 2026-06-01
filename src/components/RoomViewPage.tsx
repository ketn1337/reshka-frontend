import { motion } from 'framer-motion';
import {
  BedDouble,
  Building2,
  CheckCircle2,
  DoorOpen,
  Layers3,
  MapPin,
  MoveDiagonal2,
  Navigation,
  SlidersHorizontal,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import heroHome from '../assets/hero-home.png';
import {
  buildRoomViewPath,
  getAvailableRoomKinds,
  getPropertyById,
  getRoomKindDetail,
  getRoomsByKind,
  parseRoomViewQuery,
  roomKindLabels,
  roomKindOrder,
  roomProperties,
  type PropertyId,
  type PropertyView,
  type RoomKind,
  type RoomUnit,
} from '../roomInventory';

type RoomViewPageProps = {
  search: string;
};

function getRoomCountLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} номер`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} номера`;
  return `${count} номеров`;
}

function getSelectableKind(property: PropertyView, preferredKind: RoomKind) {
  const availableKinds = getAvailableRoomKinds(property);
  return availableKinds.includes(preferredKind) ? preferredKind : availableKinds[0];
}

function getFirstRoomForKind(property: PropertyView, kind: RoomKind) {
  return getRoomsByKind(property, kind)[0] || property.rooms[0];
}

function getInitialSelection(search: string) {
  const query = parseRoomViewQuery(search);
  const property = getPropertyById(query.propertyId);
  const roomKind = getSelectableKind(property, query.roomKind);
  const rooms = getRoomsByKind(property, roomKind);
  const room = rooms.find((item) => item.id === query.roomId) || rooms[0] || property.rooms[0];

  return {
    propertyId: property.id,
    roomKind,
    roomId: room.id,
  };
}

function replaceRoomViewUrl(propertyId: PropertyId, roomKind: RoomKind, roomId: string) {
  window.history.replaceState(null, '', buildRoomViewPath({ propertyId, roomKind, roomId }));
}

export default function RoomViewPage({ search }: RoomViewPageProps) {
  const initialSelection = getInitialSelection(search);
  const [activePropertyId, setActivePropertyId] = useState<PropertyId>(initialSelection.propertyId);
  const [activeRoomKind, setActiveRoomKind] = useState<RoomKind>(initialSelection.roomKind);
  const [activeRoomId, setActiveRoomId] = useState(initialSelection.roomId);

  const activeProperty = useMemo(() => getPropertyById(activePropertyId), [activePropertyId]);
  const availableKinds = useMemo(() => getAvailableRoomKinds(activeProperty), [activeProperty]);
  const resolvedRoomKind = availableKinds.includes(activeRoomKind) ? activeRoomKind : availableKinds[0];
  const activeKindDetail = getRoomKindDetail(resolvedRoomKind);

  const filteredRooms = useMemo(
    () => getRoomsByKind(activeProperty, resolvedRoomKind),
    [activeProperty, resolvedRoomKind],
  );

  const activeRoom = useMemo(
    () => filteredRooms.find((room) => room.id === activeRoomId) || filteredRooms[0] || activeProperty.rooms[0],
    [activeProperty.rooms, activeRoomId, filteredRooms],
  );

  const activeRoomIndex = filteredRooms.findIndex((room) => room.id === activeRoom.id);

  const selectProperty = (property: PropertyView) => {
    const nextKind = getSelectableKind(property, resolvedRoomKind);
    const nextRoom = getFirstRoomForKind(property, nextKind);

    setActivePropertyId(property.id);
    setActiveRoomKind(nextKind);
    setActiveRoomId(nextRoom.id);
    replaceRoomViewUrl(property.id, nextKind, nextRoom.id);
  };

  const selectRoomKind = (roomKind: RoomKind) => {
    if (!availableKinds.includes(roomKind)) return;

    const nextRoom = getFirstRoomForKind(activeProperty, roomKind);

    setActiveRoomKind(roomKind);
    setActiveRoomId(nextRoom.id);
    replaceRoomViewUrl(activeProperty.id, roomKind, nextRoom.id);
  };

  const selectRoom = (room: RoomUnit) => {
    setActiveRoomId(room.id);
    replaceRoomViewUrl(activeProperty.id, resolvedRoomKind, room.id);
  };

  return (
    <main className="bg-[#fbfaf6] pb-16 pt-28 text-reshka-black sm:pb-20 sm:pt-32">
      <div className="section-shell">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-end">
          <div>
            <p className="eyebrow">Просмотр номеров</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight sm:text-6xl">
              План по адресу и типу
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-black/62">
              Выберите корпус и тип номера. Комфорт доступен только в номерах Аллея Труда 21 - 3 и 13.
            </p>
          </div>

          <div className="space-y-3">
            <div
              role="tablist"
              aria-label="Адреса"
              className="grid gap-2 rounded-[26px] border border-black/10 bg-white p-2 shadow-sm sm:grid-cols-2"
            >
              {roomProperties.map((property) => {
                const isActive = property.id === activeProperty.id;

                return (
                  <button
                    key={property.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectProperty(property)}
                    className={`flex min-h-20 items-center gap-3 rounded-[20px] px-4 py-3 text-left transition ${
                      isActive
                        ? 'bg-reshka-black text-white shadow-xl'
                        : 'bg-[#fbfaf6] text-reshka-black hover:bg-reshka-yellow/18'
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                        isActive ? 'bg-reshka-yellow text-reshka-black' : 'bg-white text-reshka-black'
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-black">{property.title}</span>
                      <span className={`mt-1 block text-sm font-bold ${isActive ? 'text-white/58' : 'text-black/45'}`}>
                        {property.accent}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              role="tablist"
              aria-label="Тип номера"
              className="grid gap-2 rounded-[26px] border border-black/10 bg-white p-2 shadow-sm sm:grid-cols-2"
            >
              {roomKindOrder.map((roomKind) => {
                const isActive = roomKind === resolvedRoomKind;
                const isAvailable = availableKinds.includes(roomKind);
                const roomsByKind = getRoomsByKind(activeProperty, roomKind);

                return (
                  <button
                    key={roomKind}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    disabled={!isAvailable}
                    onClick={() => selectRoomKind(roomKind)}
                    className={`flex min-h-16 items-center gap-3 rounded-[20px] px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                      isActive
                        ? 'bg-reshka-yellow text-reshka-black shadow-glow'
                        : 'bg-[#fbfaf6] text-reshka-black hover:bg-reshka-yellow/18'
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                        isActive ? 'bg-reshka-black text-white' : 'bg-white text-reshka-black'
                      }`}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{roomKindLabels[roomKind]}</span>
                      <span className="mt-1 block text-xs font-bold text-black/45">
                        {isAvailable ? getRoomCountLabel(roomsByKind.length) : 'нет на этом адресе'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <motion.section
            key={`${activeProperty.id}-${resolvedRoomKind}-${activeRoom.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-card"
          >
            <div className="relative min-h-[280px] overflow-hidden bg-reshka-black sm:min-h-[360px]">
              <img src={heroHome} alt="Интерьер номера О! Решка" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.28)_54%,rgba(0,0,0,0.64))]" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-black text-reshka-black">
                  <MapPin className="h-4 w-4 text-reshka-yellow" />
                  {activeProperty.title}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-reshka-yellow px-4 py-2 text-sm font-black text-reshka-black">
                  <SlidersHorizontal className="h-4 w-4" />
                  {roomKindLabels[resolvedRoomKind]}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-black text-reshka-black">
                  <DoorOpen className="h-4 w-4 text-reshka-yellow" />
                  {activeRoom.label}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="max-w-xl">
                  <p className="text-sm font-bold text-white/70">{activeProperty.description}</p>
                  <h2 className="mt-2 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
                    {activeRoom.label}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:p-6 xl:grid-cols-[minmax(0,1fr)_250px]">
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-black/48">Визуал корпуса</p>
                    <h3 className="mt-1 font-display text-2xl font-black">План выбранного типа</h3>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-reshka-yellow/18 px-4 py-2 text-sm font-black">
                    <Layers3 className="h-4 w-4 text-reshka-yellow" />
                    {roomKindLabels[resolvedRoomKind]}: {getRoomCountLabel(filteredRooms.length)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                  {filteredRooms.map((room, index) => {
                    const isActive = room.id === activeRoom.id;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => selectRoom(room)}
                        className={`relative grid min-h-16 place-items-center rounded-[18px] border text-sm font-black transition ${
                          isActive
                            ? 'border-reshka-yellow bg-reshka-yellow text-reshka-black shadow-glow'
                            : 'border-black/10 bg-[#fbfaf6] text-black/64 hover:border-reshka-yellow hover:bg-reshka-yellow/14'
                        }`}
                        aria-label={room.label}
                      >
                        <span>{room.shortLabel}</span>
                        {index === activeRoomIndex && (
                          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-reshka-black" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-black text-black/38">
                  <span className="h-px bg-black/10" />
                  <span className="rounded-full border border-black/10 px-3 py-1.5">коридор</span>
                  <span className="h-px bg-black/10" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] bg-reshka-black p-4 text-white">
                  <p className="text-sm font-bold text-white/56">Выбранный номер</p>
                  <p className="mt-2 text-2xl font-black">{activeRoom.shortLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-white/62">
                    {roomKindLabels[resolvedRoomKind]} / {activeProperty.shortTitle}
                  </p>
                </div>

                {[
                  { label: 'Площадь', value: activeRoom.area, icon: MoveDiagonal2 },
                  { label: 'Тип', value: roomKindLabels[resolvedRoomKind], icon: SlidersHorizontal },
                  { label: 'Положение', value: activeRoom.side, icon: Navigation },
                  { label: 'Кровать', value: activeKindDetail.beds, icon: BedDouble },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 rounded-[18px] border border-black/10 px-4 py-3">
                    <Icon className="h-4 w-4 shrink-0 text-reshka-yellow" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black/40">{label}</p>
                      <p className="truncate text-sm font-black text-reshka-black">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="h-fit rounded-[30px] border border-black/10 bg-white p-5 shadow-card lg:sticky lg:top-28"
          >
            <div className="mb-5">
              <p className="eyebrow">Выбор номера</p>
              <h2 className="mt-2 font-display text-3xl font-black">{activeProperty.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-black/52">
                Показан тип {roomKindLabels[resolvedRoomKind].toLowerCase()}: {activeKindDetail.description}
              </p>
            </div>

            <div role="tablist" aria-label={`Номера ${activeProperty.title}`} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {filteredRooms.map((room) => {
                const isActive = room.id === activeRoom.id;

                return (
                  <button
                    key={room.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectRoom(room)}
                    className={`flex min-h-14 items-center justify-between gap-3 rounded-[18px] border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-reshka-yellow bg-reshka-yellow text-reshka-black shadow-glow'
                        : 'border-black/10 bg-[#fbfaf6] text-reshka-black hover:border-reshka-yellow hover:bg-reshka-yellow/14'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{room.label}</span>
                      <span className={`mt-1 block text-xs font-bold ${isActive ? 'text-black/58' : 'text-black/42'}`}>
                        {room.floor}, {room.area}
                      </span>
                    </span>
                    {isActive && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
