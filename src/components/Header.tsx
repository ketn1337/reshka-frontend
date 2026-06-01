import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import reshkaLogo from '../assets/reshka-logo.svg';

const navItems = [
  { label: 'Номера', href: '#rooms' },
  { label: 'План номеров', href: '/room-view' },
  { label: 'Преимущества', href: '#benefits' },
  { label: 'О нас', href: '#about' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
];

function scrollToSection(href: string) {
  if (href.startsWith('/')) {
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const section = document.querySelector(href);

  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const target = href === '#hero' ? '/' : `/${href}`;
  window.history.pushState(null, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));

  window.setTimeout(() => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-reshka-black/90 py-3 shadow-2xl backdrop-blur-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="section-shell flex items-center justify-between gap-5">
        <button
          className="group flex items-center text-left"
          onClick={() => handleNavClick('#hero')}
          aria-label="Перейти в начало страницы"
        >
          <img
            src={reshkaLogo}
            alt="О! Решка"
            className="h-16 w-16 rounded-full object-cover shadow-glow transition-transform group-hover:scale-105"
          />
          <span className="sr-only" aria-hidden="true">
            <span className="block font-display text-lg font-extrabold uppercase">О! Решка</span>
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
              hotel
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-reshka-black/55 px-2 py-2 shadow-xl backdrop-blur-xl md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => handleNavClick('#booking')}
          className="hidden rounded-full bg-reshka-yellow px-5 py-3 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 hover:bg-reshka-yellowSoft lg:inline-flex"
        >
          Найти номер
        </button>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="section-shell mt-3 md:hidden">
          <div className="rounded-[28px] border border-white/10 bg-reshka-black/95 p-3 shadow-2xl backdrop-blur-xl">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#booking')}
              className="mt-2 w-full rounded-2xl bg-reshka-yellow px-4 py-3 text-sm font-extrabold text-reshka-black"
            >
              Найти номер
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
