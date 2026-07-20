import { contactRateLimit } from '../src/lib/rate-limit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || 'unknown';

  const { success } = await contactRateLimit.limit(ip);

  if (!success) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a minute before trying again.',
    });
  }

  try {
    const formspreeRes = await fetch('https://formspree.io/f/mvzeakgr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (formspreeRes.ok) {
      return res.status(200).json({ success: true });
    }

    const errorText = await formspreeRes.text();
    return res.status(formspreeRes.status).json({
      error: 'Form submission failed',
      details: errorText,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
