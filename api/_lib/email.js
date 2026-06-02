const { Resend } = require('resend');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendAccessEmails({ name, email, spaceType, notes, brief }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const owner = process.env.OWNER_EMAIL || 'studio@otelie.com';

  const ownerBriefHtml = brief
    ? `<h3 style="margin-top:24px">Generated Brief</h3><pre style="background:#f3f4f6;padding:16px;border-radius:6px;white-space:pre-wrap;font-size:13px">${brief}</pre>`
    : `<p style="color:#ef4444"><em>Brief generation failed — send manually within 24h.</em></p>`;

  const { error: ownerErr } = await resend.emails.send({
    from: 'OTELIE Studio <studio@otelie.design>',
    to: owner,
    subject: `New access request — ${esc(name)}`,
    html: `<h2>New access request</h2>
<table style="border-collapse:collapse">
  <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Name</td><td><strong>${esc(name)}</strong></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Email</td><td><strong>${esc(email)}</strong></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Space type</td><td><strong>${esc(spaceType)}</strong></td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Notes</td><td>${esc(notes) || '—'}</td></tr>
</table>
${ownerBriefHtml}`,
  });
  if (ownerErr) { console.error('Resend owner error:', JSON.stringify(ownerErr)); throw new Error(ownerErr.message); }

  const userBriefHtml = brief
    ? `<p>Here's the spatial design brief we've prepared for your ${esc(spaceType)}:</p>
<div style="background:#f8f9fb;padding:24px;border-radius:8px;margin:24px 0;font-family:monospace;font-size:13px;white-space:pre-wrap;line-height:1.6">${brief}</div>`
    : `<p>Your custom spatial design brief will be sent to you within 24 hours.</p>`;

  const { error: userErr } = await resend.emails.send({
    from: 'OTELIE Studio <studio@otelie.design>',
    to: email,
    subject: 'OTELIE Studio — Access request received',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151">
<h2 style="font-weight:500">Thanks, ${esc(name)}.</h2>
<p>We've received your early access request for OTELIE Studio.</p>
${userBriefHtml}
<p>We'll be in touch within 48 hours.</p>
<p style="color:#9ca3af;margin-top:32px">— OTELIE Studio</p>
</div>`,
  });
  if (userErr) console.error('Resend user email error (domain not verified):', userErr.message);
}

async function sendNewsletterEmails({ email }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const owner = process.env.OWNER_EMAIL || 'studio@otelie.com';

  const { error: ownerErr } = await resend.emails.send({
    from: 'OTELIE Studio <studio@otelie.design>',
    to: owner,
    subject: 'New newsletter subscriber',
    html: `<p>New subscriber: <strong>${email}</strong></p>`,
  });
  if (ownerErr) { console.error('Resend newsletter owner error:', JSON.stringify(ownerErr)); throw new Error(ownerErr.message); }

  const { error: userErr } = await resend.emails.send({
    from: 'OTELIE Studio <studio@otelie.design>',
    to: email,
    subject: "OTELIE Studio — You're subscribed",
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151">
<h2 style="font-weight:500">You're in.</h2>
<p>One article per month — spatial design, acoustics, lighting, and AI tools for commercial interiors. No marketing.</p>
<p style="color:#9ca3af;margin-top:32px">— OTELIE Studio</p>
</div>`,
  });
  if (userErr) console.error('Resend newsletter user email error (domain not verified):', userErr.message);
}

module.exports = { sendAccessEmails, sendNewsletterEmails };
