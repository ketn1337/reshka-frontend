import { motion } from 'framer-motion';
import { benefits } from '../data';

export default function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-28 bg-reshka-black py-16 text-white sm:py-20">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Преимущества</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
              Всё важное уже включено
            </h2>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white/60">
              Популярные услуги хостела: бесплатный интернет, кондиционер, общая кухня,
              стиральная машина и размещение с домашними животными.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(({ title, description, Icon }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-90px' }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-1 hover:border-reshka-yellow/50 hover:bg-white/[0.09]"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-reshka-yellow text-reshka-black">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-extrabold">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/60">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
