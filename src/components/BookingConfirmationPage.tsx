import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  MessageCircle,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import {
  findCatalogRoom,
  formatCurrency,
  formatDateRange,
  formatDeadline,
  getGuestLabel,
  getNightLabel,
  getNights,
  getPrepaymentAmount,
  parseBookingQuery,
} from '../booking';

type BookingConfirmationPageProps = {
  search: string;
};

type SummaryItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
  dark?: boolean;
};

function SummaryItem({ icon, label, value, dark = false }: SummaryItemProps) {
  return (
    <div
      className={
        dark
          ? 'min-w-0 rounded-[18px] border border-white/12 bg-white/8 p-2 text-white sm:p-3'
          : 'min-w-0 rounded-[18px] border border-black/10 bg-[#fbfaf6] p-2 sm:p-3'
      }
    >
      <div
        className={
          dark
            ? 'mb-0.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/48 sm:mb-1 sm:text-xs'
            : 'mb-0.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/42 sm:mb-1 sm:text-xs'
        }
      >
        {icon}
        {label}
      </div>
      <p className={dark ? 'truncate text-sm font-black text-white sm:text-base' : 'truncate text-sm font-black text-reshka-black sm:text-base'}>
        {value}
      </p>
    </div>
  );
}

function StepItem({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-[18px] border border-black/10 bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-reshka-yellow text-reshka-black">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black text-reshka-black">{title}</p>
        <p className="mt-0.5 text-xs font-semibold leading-5 text-black/52">{text}</p>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage({ search }: BookingConfirmationPageProps) {
  const fallbackCreatedAt = useMemo(() => Date.now(), []);
  const query = useMemo(() => parseBookingQuery(search), [search]);
  const room = findCatalogRoom(query.roomTitle);
  const nights = getNights(query.checkIn, query.checkOut);
  const total = room.rate * nights;
  const prepayment = getPrepaymentAmount(total);
  const dateSummary = formatDateRange(query.checkIn, query.checkOut);
  const createdAt = query.createdAt || fallbackCreatedAt;
  const deadlineText = formatDeadline(createdAt + 3_600_000);
  const paymentPurpose = `Предоплата: ${room.title}, ${dateSummary}`;

  return (
    <div className="h-[100svh] overflow-hidden bg-[#fbfaf6] text-reshka-black">
      <main className="section-shell flex h-full min-h-0 flex-col py-3 sm:py-4 lg:py-5">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="shrink-0 rounded-[24px] border border-black/10 bg-white p-3 shadow-card sm:p-4 lg:p-5"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-center">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-reshka-yellow/35 bg-reshka-yellow/18 px-3 py-1.5 text-xs font-black text-reshka-black sm:text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Бронь предварительно создана
              </div>
              <h1 className="font-display text-xl font-black leading-tight text-reshka-black sm:text-4xl lg:text-5xl">
                Бронь создана и закреплена за вами на 1 час
              </h1>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-reshka-yellow/35 bg-reshka-yellow/18 px-3 py-1.5 text-xs font-black text-reshka-black sm:hidden">
                <Clock3 className="h-4 w-4" />
                {deadlineText}
              </div>
              <p className="mt-2 hidden text-xs font-semibold leading-5 text-black/56 sm:block sm:text-sm">
                Отправьте документы в Max и внесите предоплату. После проверки администратор подтвердит бронь.
              </p>
            </div>

            <div className="hidden rounded-[20px] border border-reshka-yellow/35 bg-reshka-yellow/18 p-3 text-reshka-black sm:block sm:p-4">
              <div className="mb-1.5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/56 sm:text-xs">
                <Clock3 className="h-4 w-4" />
                Дедлайн подтверждения
              </div>
              <p className="font-display text-2xl font-black leading-tight sm:text-3xl">{deadlineText}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-black/62">
                До этого времени нужны документы и предоплата.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <SummaryItem
              icon={<ShieldCheck className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
              label="Номер"
              value={room.title}
            />
            <SummaryItem
              icon={<CalendarDays className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
              label="Даты"
              value={dateSummary}
            />
            <SummaryItem
              icon={<Users className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
              label="Гости"
              value={getGuestLabel(query.guests)}
            />
            <SummaryItem
              icon={<CreditCard className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
              label="Сумма"
              value={formatCurrency(total)}
            />
          </div>
        </motion.section>

        <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="hidden min-h-0 rounded-[24px] border border-black/10 bg-white p-3 shadow-card sm:block sm:p-4 lg:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">Следующий шаг</p>
                <h2 className="mt-1 font-display text-xl font-black leading-tight text-reshka-black sm:text-3xl">
                  Подтвердите бронь
                </h2>
              </div>
              <div className="rounded-full bg-reshka-yellow/18 px-3 py-1.5 text-xs font-black text-reshka-black">
                {formatCurrency(prepayment)}
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <StepItem
                icon={<MessageCircle className="h-4 w-4" />}
                title="Документы в Max"
                text="Отправьте администратору документы гостей."
              />
              <StepItem
                icon={<CreditCard className="h-4 w-4" />}
                title="Предоплата"
                text={`Внесите ${formatCurrency(prepayment)} для подтверждения.`}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <SummaryItem
                icon={<Clock3 className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                label="Срок удержания"
                value={deadlineText}
              />
              <SummaryItem
                icon={<ShieldCheck className="h-3.5 w-3.5 text-reshka-yellow sm:h-4 sm:w-4" />}
                label="Итого"
                value={`${formatCurrency(total)} / ${getNightLabel(nights)}`}
              />
            </div>

            <div className="mt-3 flex gap-2 rounded-[18px] border border-black/10 bg-[#fbfaf6] p-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-reshka-yellow" />
              <p className="text-xs font-bold leading-5 text-black/62">
                Если документы и предоплата не поступят в течение часа, бронь автоматически отменится.
              </p>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="shrink-0 rounded-[24px] border border-black/10 bg-white p-3 shadow-card sm:p-4 lg:h-fit lg:p-5"
          >
            <p className="eyebrow text-[10px] tracking-[0.2em] sm:text-xs">Действия</p>
            <h2 className="mt-1 font-display text-lg font-black leading-tight text-reshka-black sm:text-2xl">
              Завершите подтверждение
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-1">
              <a
                href="https://max.ru/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-reshka-yellow px-3 py-2.5 text-xs font-extrabold text-reshka-black shadow-glow transition hover:-translate-y-0.5 hover:bg-reshka-yellowSoft sm:gap-2 sm:px-4 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Написать в Max
              </a>
              <a
                href="#payment-details"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-black/12 px-3 py-2.5 text-xs font-extrabold text-reshka-black transition hover:border-reshka-yellow hover:bg-reshka-yellow/15 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <CreditCard className="h-4 w-4 text-reshka-yellow" />
                Предоплата
              </a>
            </div>

            <div id="payment-details" className="mt-2 rounded-[18px] border border-black/10 bg-[#fbfaf6] p-2.5 sm:mt-3 sm:p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-black/42">Реквизиты</p>
              <div className="mt-1.5 space-y-1 text-xs font-semibold leading-5 text-black/62 sm:mt-2 sm:space-y-1.5">
                <p>
                  <span className="font-black text-reshka-black">Сумма:</span> {formatCurrency(prepayment)}
                </p>
                <p>
                  <span className="font-black text-reshka-black">СБП:</span> +7 999 000-00-00
                </p>
                <p>
                  <span className="font-black text-reshka-black">Получатель:</span> ООО "О! Решка"
                </p>
                <p className="truncate" title={paymentPurpose}>
                  <span className="font-black text-reshka-black">Назначение:</span> {paymentPurpose}
                </p>
              </div>
            </div>

            <div className="mt-2 flex gap-2 rounded-[18px] border border-black/10 bg-[#fbfaf6] p-2.5 sm:hidden">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-reshka-yellow" />
              <p className="text-xs font-bold leading-5 text-black/62">
                Если документы и предоплата не поступят в течение часа, бронь отменится.
              </p>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
