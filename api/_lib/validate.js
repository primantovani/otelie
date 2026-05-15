function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAccess(body) {
  const { name, email, spaceType } = body || {};
  if (!name || !name.trim()) return { valid: false, error: 'Name is required' };
  if (!isValidEmail(email)) return { valid: false, error: 'Valid email is required' };
  if (!spaceType || !spaceType.trim()) return { valid: false, error: 'Space type is required' };
  return { valid: true };
}

function validateNewsletter(body) {
  const { email } = body || {};
  if (!isValidEmail(email)) return { valid: false, error: 'Valid email is required' };
  return { valid: true };
}

module.exports = { isValidEmail, validateAccess, validateNewsletter };
