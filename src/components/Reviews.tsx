import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { reviews } from '../data';

export default function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-28 bg-[#f5f1e6] py-16 sm:py-20">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Отзывы</p>
            <h2 className="mt-3 font-display text-4xl font-black text-reshka-black sm:text-5xl">
              Гости замечают детали
            </h2>
          </div>
          <div className="rounded-full bg-reshka-black px-5 py-3 text-sm font-extrabold text-white">
            Средняя оценка <span className="text-reshka-yellow">4.9/5</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="rounded-[30px] border border-black/10 bg-white p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <Quote className="h-8 w-8 text-reshka-yellow" />
                <div className="flex items-center gap-1 rounded-full bg-reshka-yellow/20 px-3 py-2 text-sm font-black text-reshka-black">
                  <Star className="h-4 w-4 fill-reshka-yellow text-reshka-yellow" />
                  {review.rating}
                </div>
              </div>
              <p className="mt-7 min-h-28 text-base font-medium leading-7 text-black/60">{review.text}</p>
              <div className="mt-7 border-t border-black/10 pt-5">
                <div className="font-display text-lg font-extrabold text-reshka-black">{review.name}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                  {review.role}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
