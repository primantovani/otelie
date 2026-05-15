# Backend OTELIE Studio — Design Spec
**Date:** 2026-05-14  
**Status:** Approved

## Overview

Add a serverless backend to the OTELIE Studio static site to process two forms:
1. **Early access request** — collects name, email, space type, notes; generates an AI spatial design brief via Claude; sends emails to owner and user
2. **Newsletter subscription** — collects email; sends confirmation emails

## Stack

| Layer | Tool |
|---|---|
| Hosting | Vercel (migrating from GitHub Pages) |
| Functions | Vercel Serverless Functions (Node.js) |
| AI | Claude Sonnet 4.6 (Anthropic API) |
| Email | Resend |
| Secrets | Vercel Environment Variables |

## Repository Structure

```
otelie/
├── index.html              (unchanged)
├── api/
│   ├── access.js           POST /api/access — early access form
│   └── newsletter.js       POST /api/newsletter — newsletter signup
├── .env.example            documents required env vars
├── .gitignore              includes .env
└── docs/
    └── superpowers/specs/
        └── 2026-05-14-backend-design.md
```

## Endpoints

### POST /api/access

**Request body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "spaceType": "string (required)",
  "notes": "string (optional)"
}
```

**Logic:**
1. Validate required fields and email format; return 400 with message on failure
2. Call Claude Sonnet 4.6 with a prompt that generates a spatial design brief tailored to `spaceType` and `notes` — covering lighting, materials, acoustics, and layout (~400 words)
3. If Claude fails: set `brief = null`, proceed without it
4. Send two emails via Resend:
   - **To owner** (`studio@otelie.com`): new access request notification with all form data + brief (or fallback note if brief failed)
   - **To user** (`email`): confirmation email with brief preview; if brief is null, inform that brief will be sent within 24h
5. Return `200 { success: true }` on success, `500 { error: "..." }` if Resend fails

**Response:**
```json
{ "success": true }
```

### POST /api/newsletter

**Request body:**
```json
{
  "email": "string (required, valid email)"
}
```

**Logic:**
1. Validate email format; return 400 on failure
2. Send two emails via Resend:
   - **To owner** (`studio@otelie.com`): new newsletter subscriber notification
   - **To user**: subscription confirmation
3. Return `200 { success: true }` on success

## Frontend Changes

The two forms in `index.html` need minimal wiring:

1. **Access form** (`#access` section): on button click, collect field values, POST to `/api/access`, show inline loading state on button, show success/error message below form
2. **Newsletter form** (articles page): on button click, POST to `/api/newsletter`, show success/error message inline
3. **Validation**: check required fields and email format client-side before sending
4. **No page reload** — all feedback is inline

## Environment Variables

```
ANTHROPIC_API_KEY=   # from console.anthropic.com
RESEND_API_KEY=      # from resend.com
OWNER_EMAIL=studio@otelie.com
```

## Error Handling

| Scenario | Behavior |
|---|---|
| Missing required field | 400, inline error message to user |
| Claude API failure | Proceed without brief; note in owner email; user email says "brief in 24h" |
| Resend failure | 500, friendly error message to user |
| Double submit | Button disabled after first click until response |

## Deployment

1. Import repo `primantovani/otelie` into Vercel
2. Set environment variables in Vercel dashboard
3. Vercel auto-deploys on every push to `main`
4. GitHub Pages can be left active or deactivated — Vercel will be the primary URL

## Out of Scope

- Database / submission history
- Admin dashboard
- Authentication
- PDF brief generation (future)
- Webhook integrations
