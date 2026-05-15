const { validateNewsletter } = require('./_lib/validate');
const { sendNewsletterEmails } = require('./_lib/email');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { valid, error } = validateNewsletter(body);
  if (!valid) return res.status(400).json({ error });

  try {
    await sendNewsletterEmails({ email: body.email });
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }

  return res.status(200).json({ success: true });
};
