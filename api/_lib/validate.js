function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAccess(body) {
  const { name, email, spaceType, notes } = body || {};
  if (!name || !name.trim()) return { valid: false, error: 'Name is required' };
  if (name.trim().length > 200) return { valid: false, error: 'Name too long' };
  if (!isValidEmail(email)) return { valid: false, error: 'Valid email is required' };
  if (!spaceType || !spaceType.trim()) return { valid: false, error: 'Space type is required' };
  if (spaceType.trim().length > 100) return { valid: false, error: 'Space type too long' };
  if (notes && notes.trim().length > 2000) return { valid: false, error: 'Notes too long' };
  return { valid: true };
}

function validateNewsletter(body) {
  const { email } = body || {};
  if (!isValidEmail(email)) return { valid: false, error: 'Valid email is required' };
  return { valid: true };
}

module.exports = { isValidEmail, validateAccess, validateNewsletter };
