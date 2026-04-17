const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  const email = String(value ?? '').trim();
  if (!email) return { ok: false, message: 'Email is required.' };
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email address.' };
  return { ok: true, value: email };
}

export function validatePasswordForLogin(value) {
  const password = String(value ?? '');
  if (!password) return { ok: false, message: 'Password is required.' };
  return { ok: true, value: password };
}

export function validatePasswordForSignup(value) {
  const password = String(value ?? '');
  if (!password) return { ok: false, message: 'Password is required.' };
  if (password.length < 8) return { ok: false, message: 'Use at least 8 characters.' };
  if (password.length > 72) return { ok: false, message: 'Password is too long.' };
  return { ok: true, value: password };
}
