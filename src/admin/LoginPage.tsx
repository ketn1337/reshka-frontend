import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { ApiRequestError } from '../api/client';
import { pushPath } from '../lib/route';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Если уже залогинен — редирект на шахматку
  useEffect(() => {
    if (user) pushPath('/admin/chessboard');
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      pushPath('/admin/chessboard');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[login] failed:', err);
      if (err instanceof ApiRequestError) {
        if (err.status === 401) setError('Неверный email или пароль');
        else setError(err.message);
      } else {
        setError(`Не удалось войти: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-reshka-black p-8 text-white lg:p-16">
        <div className="mb-12 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-reshka-yellow font-black text-reshka-black">
            О!
          </div>
          <span className="font-display text-xl font-black">Решка</span>
        </div>
        <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl">
          Добро пожаловать в панель администратора
        </h1>
        <p className="mt-4 max-w-md text-white/60">
          Шахматка бронирований, создание записей, управление номерами и тарифами — всё в одном месте.
        </p>
        <div className="mt-12 grid grid-cols-3 gap-3 text-center text-xs">
          <Stat value="2" label="объекта" />
          <Stat value="27" label="номеров" />
          <Stat value="4.9" label="рейтинг" />
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white p-8 lg:p-16">
        <div className="mx-auto w-full max-w-md">
          <h2 className="font-display text-3xl font-black">Вход</h2>
          <p className="mt-2 text-sm text-black/60">Введите email и пароль, выданные администратором.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/60">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 py-3 text-sm outline-none focus:border-reshka-yellow"
                placeholder="admin@reshka.local"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/60">Пароль</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 py-3 text-sm outline-none focus:border-reshka-yellow"
                placeholder="••••••••"
              />
            </label>
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-reshka-yellow px-5 py-3.5 text-sm font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? 'Входим…' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <div className="font-display text-2xl font-black text-reshka-yellow">{value}</div>
      <div className="mt-1 text-white/60">{label}</div>
    </div>
  );
}
