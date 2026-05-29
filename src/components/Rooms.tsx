import { motion } from 'framer-motion';
import { CheckCircle2, Ruler } from 'lucide-react';
import { rooms } from '../data';

export default function Rooms() {
  return (
    <section id="rooms" className="scroll-mt-28 py-16 sm:py-20">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Номера</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight text-reshka-black sm:text-5xl">
              Четыре формата для поездки любого темпа
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-7 text-black/60">
            Каждый номер держит баланс между строгим дизайном, тишиной и деталями, которые чувствуются утром.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room, index) => (
            <motion.article
              key={room.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-card transition duration-300 hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="relative h-64 overflow-hidden bg-reshka-black">
                <img
                  src={room.image}
                  alt={`Номер ${room.title} в отеле О! Решка`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-reshka-yellow px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-reshka-black">
                  {room.accent}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <h3 className="font-display text-2xl font-black">{room.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-white/80">
                      <Ruler className="h-4 w-4 text-reshka-yellow" />
                      {room.area}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/90 px-3 py-2 text-right text-reshka-black shadow-xl">
                    <div className="text-sm font-black">{room.price}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
                      ночь
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="min-h-16 text-sm font-medium leading-6 text-black/60">{room.description}</p>

                <ul className="mt-5 space-y-3">
                  {room.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2 text-sm font-bold text-reshka-black">
                      <CheckCircle2 className="h-4 w-4 text-reshka-yellow" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
