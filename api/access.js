const { validateAccess } = require('./_lib/validate');
const { generateBrief } = require('./_lib/brief');
const { sendAccessEmails } = require('./_lib/email');

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

  const { valid, error } = validateAccess(body);
  if (!valid) return res.status(400).json({ error });

  const { name, email, spaceType, notes } = body;

  let brief = null;
  try {
    brief = await generateBrief(spaceType, notes || '');
  } catch (err) {
    console.error('Claude error:', err.message);
  }

  try {
    await sendAccessEmails({ name, email, spaceType, notes: notes || '', brief });
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({ error: 'Failed to send confirmation. Please try again.' });
  }

  return res.status(200).json({ success: true });
};
