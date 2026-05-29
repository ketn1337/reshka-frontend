import { motion } from 'framer-motion';
import { Mail, MapPin, Navigation, Phone } from 'lucide-react';

export default function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section-shell">
        <div className="grid overflow-hidden rounded-[38px] bg-reshka-black shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55 }}
            className="p-6 text-white sm:p-9 lg:p-12"
          >
            <p className="eyebrow">Контакты</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
              Мы рядом с городским центром
            </h2>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white/60">
              Напишите нам для уточнения деталей бронирования, раннего заезда или трансфера.
            </p>

            <div className="mt-9 space-y-4">
              <a
                href="https://maps.google.com/?q=Москва, ул. Центральная, 10"
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-reshka-yellow/60"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-reshka-yellow text-reshka-black">
                  <MapPin className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                    Адрес
                  </span>
                  <span className="mt-1 block font-bold">г. Москва, ул. Центральная, 10</span>
                </span>
              </a>

              <a
                href="tel:+79991234567"
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-reshka-yellow/60"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-reshka-yellow text-reshka-black">
                  <Phone className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                    Телефон
                  </span>
                  <span className="mt-1 block font-bold">+7 (999) 123-45-67</span>
                </span>
              </a>

              <a
                href="mailto:booking@reshka-hotel.ru"
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-reshka-yellow/60"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-reshka-yellow text-reshka-black">
                  <Mail className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                    Email
                  </span>
                  <span className="mt-1 block font-bold">booking@reshka-hotel.ru</span>
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55 }}
            className="relative min-h-[420px] overflow-hidden bg-[#f6c90e]"
          >
            <div className="absolute inset-0 opacity-75 [background-image:linear-gradient(90deg,rgba(0,0,0,.16)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,.16)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[38px] border-reshka-black/10" />
            <div className="absolute left-[18%] top-[22%] h-28 w-56 rotate-[-9deg] rounded-full border-8 border-reshka-black/20" />
            <div className="absolute bottom-[18%] right-[12%] h-32 w-72 rotate-[12deg] rounded-full border-8 border-white/40" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-reshka-black text-reshka-yellow shadow-2xl">
                <Navigation className="h-9 w-9 fill-reshka-yellow" />
              </div>
              <div className="mt-5 rounded-3xl bg-white px-6 py-4 text-center shadow-card">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-black/45">map preview</div>
                <div className="mt-1 font-display text-2xl font-black text-reshka-black">О! Решка</div>
                <div className="mt-1 text-sm font-bold text-black/55">Центральная, 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
