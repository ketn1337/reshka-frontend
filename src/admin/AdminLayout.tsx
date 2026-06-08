import { useEffect, useState } from 'react';
import {
  BedDouble,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Home,
  Hotel,
  LogOut,
  Settings,
  UserCog,
  Users,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/auth';
import { pushPath } from '../lib/route';

const NAV = [
  { href: '/admin/chessboard', label: 'Шахматка', icon: CalendarRange, exact: true },
  { href: '/admin/bookings', label: 'Бронирования', icon: BedDouble },
  { href: '/admin/rooms', label: 'Номера', icon: Hotel },
  { href: '/admin/guests', label: 'Гости', icon: Users },
  { href: '/admin/rates', label: 'Тарифы', icon: Home },
  { href: '/admin/users', label: 'Сотрудники', icon: UserCog, adminOnly: true },
];

interface AdminLayoutProps {
  pathname: string;
  children: React.ReactNode;
}

export default function AdminLayout({ pathname, children }: AdminLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  // Block access if no user
  useEffect(() => {
    if (!user && !useAuthStore.getState().initialized) {
      useAuthStore.getState().fetchMe();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-reshka-black text-white">
        <div className="rounded-2xl bg-white/5 px-8 py-6 text-sm text-white/60">Загрузка…</div>
      </div>
    );
  }

  const visible = NAV.filter((n) => !n.adminOnly || user.role === 'admin');

  async function handleLogout() {
    await logout();
    pushPath('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#fbfaf6] text-reshka-black">
      <aside
        className={clsx(
          'flex shrink-0 flex-col border-r border-black/5 bg-reshka-black text-white transition-all',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-reshka-yellow text-reshka-black font-black">
                О!
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black">Решка</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">PMS</div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md p-1 hover:bg-white/10"
            aria-label="Свернуть меню"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {visible.map((n) => {
            const active = pathname === n.href || (n.exact ? pathname === n.href : pathname.startsWith(n.href));
            const Icon = n.icon;
            return (
              <button
                key={n.href}
                type="button"
                onClick={() => pushPath(n.href)}
                className={clsx(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition',
                  active
                    ? 'bg-reshka-yellow text-reshka-black'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{n.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <div className={clsx('flex items-center gap-2 rounded-xl px-2 py-2', !collapsed && 'bg-white/5')}>
            <CircleUserRound className="h-8 w-8 text-reshka-yellow" />
            {!collapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-xs font-bold">{user.fullName}</div>
                <div className="truncate text-[10px] uppercase tracking-wider text-white/50">{user.role}</div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto">{children}</main>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/5 bg-white px-8 py-5">
      <div>
        <h1 className="font-display text-2xl font-black leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-black/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminButton({ children, onClick, variant = 'primary', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition',
        variant === 'primary' && 'bg-reshka-yellow text-reshka-black hover:bg-reshka-yellowSoft',
        variant === 'secondary' && 'border border-black/10 bg-white text-reshka-black hover:border-black/20',
        variant === 'ghost' && 'text-reshka-black hover:bg-black/5',
      )}
    >
      {children}
    </button>
  );
}

export function AdminForbidden() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8 text-center">
      <div>
        <Settings className="mx-auto h-12 w-12 text-black/20" />
        <h2 className="mt-4 font-display text-2xl font-black">Недостаточно прав</h2>
        <p className="mt-2 max-w-md text-sm text-black/60">
          Эта страница доступна только администратору. Если вам нужен доступ — обратитесь к руководителю.
        </p>
      </div>
    </div>
  );
}
