import { Instagram, Send, Twitter } from 'lucide-react';

const footerNav = [
  { label: 'Номера', href: '#rooms' },
  { label: 'Бронирование', href: '#booking' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
];

export default function Footer() {
  return (
    <footer className="bg-reshka-black text-white">
      <div className="section-shell py-10">
        <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-[1fr_auto_auto] md:items-start">
          <div>
            <button
              onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 text-left"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-reshka-yellow text-xl font-black text-reshka-black">
                Р
              </span>
              <span>
                <span className="block font-display text-2xl font-black uppercase">О! Решка</span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                  modern hotel
                </span>
              </span>
            </button>
            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-white/55">
              Современный городской отель для тех, кто ценит тишину, точный сервис и выразительный стиль.
            </p>
          </div>

          <nav className="grid gap-3 text-sm font-bold text-white/70 sm:grid-cols-2 md:grid-cols-1">
            {footerNav.map((item) => (
              <button
                key={item.href}
                onClick={() => document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-left transition hover:text-reshka-yellow"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-4">
            <div className="text-sm font-bold text-white/70">+7 (999) 123-45-67</div>
            <div className="text-sm font-bold text-white/70">booking@reshka-hotel.ru</div>
            <div className="flex gap-3">
              {[Instagram, Send, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#hero"
                  aria-label="Социальная сеть отеля О! Решка"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-reshka-yellow hover:text-reshka-yellow"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 О! Решка. Demo hotel website.</span>
          <span>Design reference prototype</span>
        </div>
      </div>
    </footer>
  );
}
