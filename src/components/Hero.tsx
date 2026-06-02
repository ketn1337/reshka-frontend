import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import heroHome from '../assets/hero-home.png';
import { hotelHighlights } from '../data';
import BookingForm from './BookingForm';

function scrollToSection(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${heroHome})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.36)_54%,rgba(0,0,0,0.68))]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-reshka-black to-transparent" />

      <div className="section-shell relative flex min-h-screen flex-col justify-start pb-8 pt-28 sm:pb-10 lg:pt-32">
        <div className="relative z-20">
          <BookingForm />
        </div>

        <div className="mt-2 grid items-start gap-8 sm:mt-3 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="max-w-5xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
              <Star className="h-4 w-4 fill-reshka-yellow text-reshka-yellow" />
              Хостел в центре города
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              О! Решка
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/80 sm:text-xl">
              Уютное место для короткой остановки и спокойного отдыха в Комсомольске-на-Амуре:
              общая кухня, интернет и удобный заезд.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection('#rooms')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-extrabold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
              >
                Посмотреть номера
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: 'easeOut' }}
            className="glass-panel rounded-[32px] p-5 text-reshka-black"
          >
            <div className="hotel-visual min-h-56 rounded-[26px] p-5">
              <div className="relative z-10 flex h-full min-h-48 flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-reshka-black">
                    hostel stay
                  </span>
                  <span className="rounded-full bg-reshka-yellow px-3 py-2 text-sm font-black text-reshka-black">
                    4.9
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/70">Адрес</p>
                  <div className="mt-2 flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 text-reshka-yellow" />
                    <span className="font-bold">Комсомольск-на-Амуре, центр города</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-reshka-black px-5 py-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                прямое бронирование
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-white/80">
                Даты, гости и тип номера доступны сразу в первом экране.
              </p>
            </div>
          </motion.aside>
        </div>

        <div className="mt-6 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {hotelHighlights.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/80 backdrop-blur"
            >
              <Icon className="h-5 w-5 text-reshka-yellow" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
