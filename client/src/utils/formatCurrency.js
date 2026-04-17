export function formatCurrency(amount, currency = 'USD') {
  const n = typeof amount === 'string' ? parseFloat(amount, 10) : amount;
  if (Number.isNaN(n)) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
