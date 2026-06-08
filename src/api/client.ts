// HTTP-клиент. Все запросы с credentials: include, чтобы ходил httpOnly-cookie.
//
// В dev-режиме Vite проксирует /api и /photos на бэкенд (см. vite.config.ts),
// поэтому API_BASE = '' → запросы идут на тот же origin (http://localhost:5173),
// preflight не нужен. В проде статика и API живут на одном origin либо за reverse-proxy.

import type { ApiError } from './types';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export class ApiRequestError extends Error {
  status: number;
  code: string;
  constructor(status: number, body: ApiError | string) {
    const message = typeof body === 'string' ? body : body.message;
    super(message);
    this.status = status;
    this.code = typeof body === 'string' ? 'http_error' : body.code;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  // если true — НЕ шлём body и content-type (используется для FormData)
  formData?: FormData;
  // query
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  // Если API_BASE абсолютный (http://...) — используем его; иначе берём текущий origin
  // (Vite проксирует /api и /photos в dev, в проде обычно тоже same-origin).
  const base = API_BASE || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(path, base);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v == null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: opts.method ?? 'GET',
    credentials: 'include',
    signal: opts.signal,
  };
  if (opts.formData) {
    init.body = opts.formData;
  } else if (opts.body != null) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(opts.body);
  }
  const res = await fetch(buildUrl(path, opts.query), init);
  if (res.status === 204) return null as T;
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const err = (data as { error?: ApiError })?.error ?? { code: 'http_error', message: String(data) };
    throw new ApiRequestError(res.status, err);
  }
  return data as T;
}

export { API_BASE };
