/**
 * Safe link parsing, validation, and normalization for contact & social channels.
 * Prevents unsafe URL schemes (e.g., javascript:, data:) and formats WhatsApp & Instagram links cleanly.
 */

export function isConfiguredValue(val) {
  return Boolean(val && typeof val === 'string' && val.trim() && !val.trim().startsWith('['));
}

export function sanitizeExternalUrl(url) {
  if (!isConfiguredValue(url)) return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // If user entered e.g. "instagram.com/nexforever" without protocol
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return `https://${trimmed}`;
    }
  }
  return null;
}

export function formatInstagramUrl(val) {
  if (!isConfiguredValue(val)) return null;
  const trimmed = val.trim();
  if (trimmed.startsWith('@')) {
    const handle = trimmed.slice(1).replace(/[^a-zA-Z0-9._]/g, '');
    return handle ? `https://instagram.com/${handle}` : null;
  }
  if (!trimmed.includes('/') && !trimmed.includes('.')) {
    const handle = trimmed.replace(/[^a-zA-Z0-9._]/g, '');
    return handle ? `https://instagram.com/${handle}` : null;
  }
  return sanitizeExternalUrl(trimmed);
}

export function formatWhatsAppUrl(phone, defaultText = '') {
  if (!isConfiguredValue(phone)) return null;
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 7) return null;
  const query = defaultText ? `?text=${encodeURIComponent(defaultText)}` : '';
  return `https://wa.me/${digits}${query}`;
}

export function formatEmailHref(email) {
  if (!isConfiguredValue(email)) return null;
  const trimmed = email.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }
  return null;
}

