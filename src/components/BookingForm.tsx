import { motion } from 'framer-motion';
import { CalendarDays, Search, Users } from 'lucide-react';
import { FormEvent } from 'react';

const roomTypes = ['Любой номер', 'Стандарт', 'Комфорт', 'Люкс', 'Семейный номер'];

export default function BookingForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const checkIn = String(formData.get('checkIn') || '');
    const checkOut = String(formData.get('checkOut') || '');
    const guests = String(formData.get('guests') || '2');
    const roomType = String(formData.get('roomType') || '');

    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    if (roomType && roomType !== 'Любой номер') params.set('roomType', roomType);

    const target = `/rooms${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="booking" className="relative z-20 scroll-mt-28">
      <div className="w-full">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[30px] border border-white/70 bg-white/95 p-4 text-reshka-black shadow-card backdrop-blur-xl md:p-5"
        >
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Бронирование</p>
              <h2 className="mt-1 font-display text-3xl font-black text-reshka-black sm:text-4xl">
                Найдите свой номер
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-black/55">
              Проверка доступности в demo-режиме без backend.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr_1fr_auto]">
            <label className="group rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
              <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                <CalendarDays className="h-4 w-4 text-reshka-yellow" />
                Заезд
              </span>
              <input
                type="date"
                name="checkIn"
                required
                className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
              />
            </label>

            <label className="group rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
              <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                <CalendarDays className="h-4 w-4 text-reshka-yellow" />
                Выезд
              </span>
              <input
                type="date"
                name="checkOut"
                required
                className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
              />
            </label>

            <label className="group rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
              <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                <Users className="h-4 w-4 text-reshka-yellow" />
                Гости
              </span>
              <input
                type="number"
                name="guests"
                min="1"
                max="6"
                defaultValue="2"
                className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
              />
            </label>

            <label className="group rounded-[24px] border border-black/10 bg-[#fbfaf6] p-4 transition focus-within:border-reshka-yellow focus-within:bg-white">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">
                Тип номера
              </span>
              <select
                name="roomType"
                className="mt-3 w-full border-0 bg-transparent text-base font-bold text-reshka-black outline-none"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type === 'Любой номер' ? '' : type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <button className="inline-flex min-h-[76px] items-center justify-center gap-2 rounded-[24px] bg-reshka-black px-6 py-4 text-base font-extrabold text-white shadow-xl transition hover:-translate-y-1 hover:bg-black lg:min-w-56">
              <Search className="h-5 w-5 text-reshka-yellow" />
              Проверить доступность
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
