/**
 * Centralized HTTP API client for NexForever public storefront and protected Admin CMS.
 * Every backend response follows ApiResponse<T>:
 * { success: boolean, message: string | null, data: T, errors: Record<string, string> | null, timestamp: string }
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

let cachedCsrfToken = null;
let csrfPromise = null;

export class ApiError extends Error {
  constructor(message, { status = 500, errors = null, code = null } = {}) {
    super(message || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearCsrfCache() {
  cachedCsrfToken = null;
  csrfPromise = null;
}

export async function fetchCsrfToken(forceRefresh = false) {
  if (!forceRefresh && cachedCsrfToken) {
    return cachedCsrfToken;
  }
  const cookieToken = !forceRefresh ? readCookie('XSRF-TOKEN') : null;
  if (cookieToken) {
    cachedCsrfToken = cookieToken;
    return cookieToken;
  }
  if (!forceRefresh && csrfPromise) {
    return csrfPromise;
  }

  csrfPromise = (async () => {
    const response = await fetch(buildUrl('/api/admin/auth/csrf'), {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    const payload = await parseResponse(response);
    const token = payload?.token || readCookie('XSRF-TOKEN') || null;
    cachedCsrfToken = token;
    csrfPromise = null;
    return token;
  })();

  try {
    return await csrfPromise;
  } catch (err) {
    csrfPromise = null;
    throw err;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok || (body && body.success === false)) {
    const message =
      body?.message ||
      (response.status === 401
        ? 'Authentication required. Please sign in.'
        : response.status === 403
          ? 'Access denied or expired security token. Please retry.'
          : response.status === 429
            ? 'Too many requests. Please wait a moment before trying again.'
            : `Request failed with status ${response.status}`);
    throw new ApiError(message, {
      status: response.status,
      errors: body?.errors || null,
    });
  }

  if (body && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data;
  }
  return body;
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body = undefined,
    headers = {},
    credentials = 'same-origin',
    requireCsrf = false,
    signal,
  } = options;

  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  let finalBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
    finalBody = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const upperMethod = method.toUpperCase();
  if (requireCsrf && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      finalHeaders['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  const response = await fetch(buildUrl(path), {
    method: upperMethod,
    headers: finalHeaders,
    body: finalBody,
    credentials,
    signal,
  });

  // If CSRF token was stale on an admin mutation, refresh token once and retry
  if (requireCsrf && response.status === 403) {
    const freshToken = await fetchCsrfToken(true);
    if (freshToken) {
      finalHeaders['X-XSRF-TOKEN'] = freshToken;
      const retryResponse = await fetch(buildUrl(path), {
        method: upperMethod,
        headers: finalHeaders,
        body: finalBody,
        credentials,
        signal,
      });
      return parseResponse(retryResponse);
    }
  }

  return parseResponse(response);
}

/* ========================= PUBLIC ENDPOINTS ========================= */

export function fetchServices({ signal } = {}) {
  return request('/api/services', { signal });
}

export function fetchProjects({ category = 'All', search = '', signal } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') {
    params.set('category', category);
  }
  if (search && search.trim()) {
    params.set('search', search.trim());
  }
  const query = params.toString();
  return request(query ? `/api/projects?${query}` : '/api/projects', { signal });
}

export function fetchProjectByIdOrSlug(idOrSlug, { signal } = {}) {
  return request(`/api/projects/${encodeURIComponent(idOrSlug)}`, { signal });
}

export function fetchTestimonials({ signal } = {}) {
  return request('/api/testimonials', { signal });
}

export function fetchFaqs({ signal } = {}) {
  return request('/api/faqs', { signal });
}

export function fetchPublicSettings({ signal } = {}) {
  return request('/api/settings', { signal });
}

export function submitEnquiry(payload) {
  return request('/api/enquiries', {
    method: 'POST',
    body: payload,
  });
}

export function sendChittiMessage(payload) {
  return request('/api/chitti/chat', {
    method: 'POST',
    body: payload,
  });
}

/* ========================= ADMIN AUTH ========================= */

export async function adminLogin({ email, password }) {
  clearCsrfCache();
  await fetchCsrfToken(true);
  const admin = await request('/api/admin/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: { email, password },
  });
  // Session changes on login -> fetch fresh CSRF token bound to authenticated session
  await fetchCsrfToken(true);
  return admin;
}

export async function adminLogout() {
  try {
    await request('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
      requireCsrf: true,
    });
  } finally {
    clearCsrfCache();
  }
}

export function fetchCurrentAdmin({ signal } = {}) {
  return request('/api/admin/auth/me', {
    credentials: 'include',
    signal,
  });
}

/* ========================= ADMIN DASHBOARD & CRUD ========================= */

export function fetchAdminDashboard({ signal } = {}) {
  return request('/api/admin/dashboard', { credentials: 'include', signal });
}

export function fetchAdminProjects({ signal } = {}) {
  return request('/api/admin/projects', { credentials: 'include', signal });
}

export function createAdminProject(payload) {
  return request('/api/admin/projects', {
    method: 'POST',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function updateAdminProject(id, payload) {
  return request(`/api/admin/projects/${id}`, {
    method: 'PUT',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function updateAdminProjectStatus(id, status) {
  return request(`/api/admin/projects/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    requireCsrf: true,
    body: { status },
  });
}

export function deleteAdminProject(id) {
  return request(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminServices({ signal } = {}) {
  return request('/api/admin/services', { credentials: 'include', signal });
}

export function createAdminService(payload) {
  return request('/api/admin/services', {
    method: 'POST',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function updateAdminService(id, payload) {
  return request(`/api/admin/services/${id}`, {
    method: 'PUT',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function deleteAdminService(id) {
  return request(`/api/admin/services/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminTestimonials({ signal } = {}) {
  return request('/api/admin/testimonials', { credentials: 'include', signal });
}

export function createAdminTestimonial(payload) {
  return request('/api/admin/testimonials', {
    method: 'POST',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function updateAdminTestimonial(id, payload) {
  return request(`/api/admin/testimonials/${id}`, {
    method: 'PUT',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function deleteAdminTestimonial(id) {
  return request(`/api/admin/testimonials/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminFaqs({ signal } = {}) {
  return request('/api/admin/faqs', { credentials: 'include', signal });
}

export function createAdminFaq(payload) {
  return request('/api/admin/faqs', {
    method: 'POST',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function updateAdminFaq(id, payload) {
  return request(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function deleteAdminFaq(id) {
  return request(`/api/admin/faqs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminEnquiries({ status = '', signal } = {}) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/api/admin/enquiries${query}`, { credentials: 'include', signal });
}

export function updateAdminEnquiry(id, payload) {
  return request(`/api/admin/enquiries/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    requireCsrf: true,
    body: payload,
  });
}

export function deleteAdminEnquiry(id) {
  return request(`/api/admin/enquiries/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminMedia({ signal } = {}) {
  return request('/api/admin/media', { credentials: 'include', signal });
}

export function uploadAdminMedia(file, altText = '') {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) {
    formData.append('altText', altText);
  }
  return request('/api/admin/media', {
    method: 'POST',
    credentials: 'include',
    requireCsrf: true,
    body: formData,
  });
}

export function deleteAdminMedia(id) {
  return request(`/api/admin/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    requireCsrf: true,
  });
}

export function fetchAdminSettings({ signal } = {}) {
  return request('/api/admin/settings', { credentials: 'include', signal });
}

export function updateAdminSettings(settingsMap) {
  return request('/api/admin/settings', {
    method: 'PUT',
    credentials: 'include',
    requireCsrf: true,
    body: { settings: settingsMap },
  });
}

