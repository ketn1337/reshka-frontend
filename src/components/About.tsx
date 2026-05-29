import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Moon, Soup } from 'lucide-react';

const details = [
  { label: 'Тихая атмосфера', Icon: Moon },
  { label: 'Городской ритм', Icon: Building2 },
  { label: 'Завтрак каждый день', Icon: Soup },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
                    quiet luxury
                  </p>
                  <h3 className="mt-3 font-display text-4xl font-black leading-tight">
                    Чёрный, жёлтый, свет и ощущение точного выбора
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
              Отель, который держит фокус на вашем комфорте
            </h2>
            <p className="mt-6 text-lg font-medium leading-8 text-black/60">
              «О! Решка» — современный городской отель с комфортными номерами, уютной атмосферой
              и удобным расположением. Мы проектируем пребывание так, чтобы гостю было легко:
              быстро заселиться, выспаться, вкусно позавтракать и спокойно вернуться к своим делам.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {details.map(({ label, Icon }) => (
                <div key={label} className="rounded-[24px] border border-black/10 bg-white p-4 shadow-card">
                  <Icon className="h-6 w-6 text-reshka-yellow" />
                  <div className="mt-4 text-sm font-extrabold text-reshka-black">{label}</div>
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
