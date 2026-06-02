import { motion } from 'framer-motion';
import { ArrowUpRight, Cable, Dog, KeyRound, Plug, Refrigerator, Tv, WashingMachine } from 'lucide-react';

const details = [
  { label: 'Бесплатный интернет', Icon: Plug },
  { label: 'Можно с питомцем', Icon: Dog },
  { label: 'Индивидуальный заезд', Icon: KeyRound },
];

const roomFeatures = [
  { label: 'Холодильник', Icon: Refrigerator },
  { label: 'Кабельное телевидение', Icon: Cable },
  { label: 'Телевизор', Icon: Tv },
  { label: 'Стиральная машина', Icon: WashingMachine },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[36px] bg-reshka-black p-2 shadow-card"
          >
            <div className="hotel-visual min-h-[520px] rounded-[30px] p-7 text-white">
              <div className="relative z-10 flex min-h-[460px] flex-col justify-between">
                <div className="flex justify-end">
                  <div className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-reshka-black">
                    reshka mood
                  </div>
                </div>
                <div className="max-w-md">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-reshka-yellow">
                    hostel in city center
                  </p>
                  <h3 className="mt-3 font-display text-4xl font-black leading-tight">
                    Кофе у окна, город рядом и всё нужное для поездки
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.55 }}
          >
            <p className="eyebrow">О нас</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight text-reshka-black sm:text-5xl">
              О хостеле
            </h2>
            <p className="mt-6 text-lg font-medium leading-8 text-black/60">
              «Хостел Орёл и Решка» расположен в Комсомольске-на-Амуре. Этот хостел находится в самом центре города.
              Утром можно выпить кофе, наблюдая из окна за жизнью города.
            </p>
            <p className="mt-4 text-base font-medium leading-7 text-black/60">
              Общая кухня оборудована для самостоятельного приготовления пищи. В путешествие можно взять питомца:
              в хостеле возможно бесплатное размещение с домашним любимцем. Гостям доступны индивидуальная
              регистрация заезда и отъезда, стиральная машина и гладильные принадлежности.
            </p>
            <p className="mt-4 text-base font-medium leading-7 text-black/60">
              В номере вас будут ждать телевизор и базовые удобства. Перечисленные услуги есть не во всех номерах.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {details.map(({ label, Icon }) => (
                <div key={label} className="rounded-[24px] border border-black/10 bg-white p-4 shadow-card">
                  <Icon className="h-6 w-6 text-reshka-yellow" />
                  <div className="mt-4 text-sm font-extrabold text-reshka-black">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-black/10 bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow">Факты</p>
                  <h3 className="mt-2 font-display text-2xl font-black text-reshka-black">Тип розетки</h3>
                </div>
                <div className="grid gap-3 text-sm font-bold text-black/60 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fbfaf6] p-4">
                    <p className="text-reshka-black">Европейская</p>
                    <p className="mt-1">220 В / 50 Гц</p>
                  </div>
                  <div className="rounded-2xl bg-[#fbfaf6] p-4">
                    <p className="text-reshka-black">Европейская с заземлением</p>
                    <p className="mt-1">220 В / 50 Гц</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {roomFeatures.map(({ label, Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-card">
                  <Icon className="h-5 w-5 text-reshka-yellow" />
                  <span className="text-sm font-extrabold text-reshka-black">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-reshka-yellow px-6 py-4 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-1 hover:bg-reshka-yellowSoft"
            >
              Связаться с отелем
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
