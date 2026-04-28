'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminUser } from '@/constant/types';
import { Event } from '@/constant/eventTypes';
import { Order, OrdersResponse } from '@/constant/orderTypes';
import { PaymentStats } from '@/constant/paymentTypes';
import { authService } from '@/services/authService';
import { eventService } from '@/services/eventService';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';

type ActivityType = 'user' | 'event' | 'order';
type CardTone = 'indigo' | 'green' | 'blue' | 'purple';

interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  href: string;
}

interface DashboardOverview {
  totalUsers: number;
  adminUsers: number;
  activeEvents: number;
  upcomingEvents: Event[];
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  completedTransactions: number;
  recentActivities: DashboardActivity[];
  warnings: string[];
  updatedAt: string;
}

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
});
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const toneClasses: Record<CardTone, { accent: string; badge: string; link: string }> = {
  indigo: {
    accent: 'from-indigo-500 to-blue-500',
    badge: 'bg-indigo-50 text-indigo-700',
    link: 'text-indigo-600',
  },
  green: {
    accent: 'from-green-500 to-emerald-500',
    badge: 'bg-green-50 text-green-700',
    link: 'text-green-600',
  },
  blue: {
    accent: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-50 text-blue-700',
    link: 'text-blue-600',
  },
  purple: {
    accent: 'from-purple-500 to-fuchsia-500',
    badge: 'bg-purple-50 text-purple-700',
    link: 'text-purple-600',
  },
};

const activityTypeClasses: Record<ActivityType, string> = {
  user: 'bg-indigo-50 text-indigo-700',
  event: 'bg-green-50 text-green-700',
  order: 'bg-blue-50 text-blue-700',
};

const getTimeValue = (value?: string) => {
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const formatNumber = (value: number) => numberFormatter.format(value);

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatDate = (value?: string) => {
  const time = getTimeValue(value);
  if (!time) return 'Date unavailable';

  return dateFormatter.format(new Date(time));
};

const formatDateTime = (value?: string) => {
  const time = getTimeValue(value);
  if (!time) return 'Unknown time';

  return dateTimeFormatter.format(new Date(time));
};

const unwrapData = <T,>(value: T | { data?: T } | null | undefined): T | undefined => {
  if (!value) return undefined;

  if (typeof value === 'object' && 'data' in value) {
    return value.data ?? undefined;
  }

  return value as T;
};

const parseOrderAmount = (order: Order) => {
  const rawAmount = order.totalAmount;

  if (typeof rawAmount === 'number') {
    return Number.isFinite(rawAmount) ? rawAmount : 0;
  }

  const parsed = parseFloat(rawAmount?.$numberDecimal ?? '0');
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getOrderCustomerName = (order: Order) => {
  if (order.userId && typeof order.userId === 'object' && 'name' in order.userId) {
    return order.userId.name || 'Customer';
  }

  return 'Customer';
};

const formatStatus = (status: string) =>
  status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getEventDateTimeValue = (event: Event) => {
  if (!event.date) return '';
  return event.time ? `${event.date}T${event.time}` : event.date;
};

const buildRecentActivities = (users: AdminUser[], events: Event[], orders: Order[]) => {
  const userActivities: DashboardActivity[] = [...users]
    .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt))
    .slice(0, 4)
    .map((user) => ({
      id: `user-${user.id || user.email}`,
      type: 'user',
      title: `${user.name || 'New user'} registered`,
      description: user.email || 'User account created',
      timestamp: user.createdAt,
      href: '/dashboard/users',
    }));

  const orderActivities: DashboardActivity[] = [...orders]
    .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt))
    .slice(0, 4)
    .map((order) => ({
      id: `order-${order._id}`,
      type: 'order',
      title: `Order #${order._id.slice(-8)} received`,
      description: `${getOrderCustomerName(order)} | ${formatStatus(order.status)}`,
      timestamp: order.createdAt,
      href: '/dashboard/orders',
    }));

  const eventActivities: DashboardActivity[] = [...events]
    .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt))
    .slice(0, 4)
    .map((event) => ({
      id: `event-${event._id}`,
      type: 'event',
      title: `${event.title} scheduled`,
      description: `${event.location} | ${formatDate(event.date)}`,
      timestamp: event.createdAt || getEventDateTimeValue(event),
      href: '/dashboard/events',
    }));

  return [...userActivities, ...orderActivities, ...eventActivities]
    .sort((a, b) => getTimeValue(b.timestamp) - getTimeValue(a.timestamp))
    .slice(0, 6);
};

const buildOverview = (
  users: AdminUser[],
  events: Event[],
  ordersResponse?: OrdersResponse,
  paymentStats?: PaymentStats,
  warnings: string[] = []
): DashboardOverview => {
  const orders = ordersResponse?.data || [];
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();

  const upcomingEvents = [...events]
    .filter((event) => getTimeValue(event.date) >= startOfTodayMs)
    .sort((a, b) => getTimeValue(a.date) - getTimeValue(b.date))
    .slice(0, 5);

  const activeEventsFromFlags = events.filter((event) => event.isActive).length;
  const activeEvents = activeEventsFromFlags || upcomingEvents.length;
  const paidOrders = orders.filter((order) =>
    ['paid', 'shipped', 'completed'].includes(order.status)
  );
  const fallbackRevenue = paidOrders.reduce((sum, order) => sum + parseOrderAmount(order), 0);

  return {
    totalUsers: users.length,
    adminUsers: users.filter((user) => user.isAdmin).length,
    activeEvents,
    upcomingEvents,
    totalOrders: ordersResponse?.total ?? orders.length,
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
    revenue: paymentStats?.completed.amount ?? fallbackRevenue,
    completedTransactions: paymentStats?.completed.count ?? paidOrders.length,
    recentActivities: buildRecentActivities(users, events, orders),
    warnings,
    updatedAt: new Date().toISOString(),
  };
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    const [usersResult, eventsResult, ordersResult, paymentStatsResult] =
      await Promise.allSettled([
        authService.getAdminUsers(),
        eventService.getEvents(),
        orderService.getOrders(),
        paymentService.getPaymentStats(),
      ]);

    const users = usersResult.status === 'fulfilled' ? usersResult.value : [];
    const events = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
    const ordersResponse = ordersResult.status === 'fulfilled' ? ordersResult.value : undefined;
    const paymentStats =
      paymentStatsResult.status === 'fulfilled'
        ? unwrapData<PaymentStats>(paymentStatsResult.value)
        : undefined;

    const warnings: string[] = [];

    if (usersResult.status === 'rejected') {
      warnings.push('Users could not be loaded.');
    }

    if (eventsResult.status === 'rejected') {
      warnings.push('Events could not be loaded.');
    }

    if (ordersResult.status === 'rejected') {
      warnings.push('Orders could not be loaded.');
    }

    if (paymentStatsResult.status === 'rejected') {
      warnings.push('Revenue is using order data because the payment stats endpoint is unavailable.');
    }

    const hasAnySuccessfulSource = [
      usersResult,
      eventsResult,
      ordersResult,
      paymentStatsResult,
    ].some((result) => result.status === 'fulfilled');

    if (!hasAnySuccessfulSource) {
      setOverview(null);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
      return;
    }

    setOverview(buildOverview(users, events, ordersResponse, paymentStats, warnings));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  const statCards = overview
    ? [
        {
          title: 'Total Users',
          value: formatNumber(overview.totalUsers),
          subtitle: `${formatNumber(overview.adminUsers)} admins`,
          href: '/dashboard/users',
          tone: 'indigo' as const,
        },
        {
          title: 'Active Events',
          value: formatNumber(overview.activeEvents),
          subtitle: `${formatNumber(overview.upcomingEvents.length)} upcoming`,
          href: '/dashboard/events',
          tone: 'green' as const,
        },
        {
          title: 'Total Orders',
          value: formatNumber(overview.totalOrders),
          subtitle: `${formatNumber(overview.pendingOrders)} pending`,
          href: '/dashboard/orders',
          tone: 'blue' as const,
        },
        {
          title: 'Revenue',
          value: formatCurrency(overview.revenue),
          subtitle: `${formatNumber(overview.completedTransactions)} completed transactions`,
          href: '/dashboard/payments',
          tone: 'purple' as const,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
            Admin Overview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Live admin metrics from users, events, orders, and payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {overview && (
            <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
              Updated {formatDateTime(overview.updatedAt)}
            </span>
          )}
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadDashboard}
              className="font-medium text-red-700 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {overview?.warnings.length ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {overview.warnings.join(' ')}
        </div>
      ) : null}

      {loading && !overview ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="h-1 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="mt-6 h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 h-10 w-28 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 4 }).map((__, itemIndex) => (
                    <div key={itemIndex} className="h-16 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {overview ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const tone = toneClasses[card.tone];

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`h-1 w-full rounded-full bg-gradient-to-r ${tone.accent}`} />
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {card.value}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}>
                      Live
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">{card.subtitle}</p>
                    <span className={`text-sm font-medium ${tone.link}`}>Open</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Latest signups, orders, and scheduled events.
                  </p>
                </div>
                <Link href="/dashboard/users" className="text-sm font-medium text-indigo-600">
                  View users
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {overview.recentActivities.length ? (
                  overview.recentActivities.map((activity) => (
                    <Link
                      key={activity.id}
                      href={activity.href}
                      className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-4 py-4 transition hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${activityTypeClasses[activity.type]}`}
                          >
                            {activity.type}
                          </span>
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {activity.title}
                          </p>
                        </div>
                        <p className="mt-2 truncate text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <p className="shrink-0 text-xs font-medium text-gray-500">
                        {formatDateTime(activity.timestamp)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    No recent activity yet.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Next scheduled items from the live events feed.
                  </p>
                </div>
                <Link href="/dashboard/events" className="text-sm font-medium text-indigo-600">
                  View events
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {overview.upcomingEvents.length ? (
                  overview.upcomingEvents.map((event) => (
                    <Link
                      key={event._id}
                      href="/dashboard/events"
                      className="block rounded-xl border border-gray-100 px-4 py-4 transition hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{event.title}</p>
                          <p className="mt-2 text-sm text-gray-600">{event.location}</p>
                        </div>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {event.type}
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                        {formatDateTime(getEventDateTimeValue(event))}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                    No upcoming events found.
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
