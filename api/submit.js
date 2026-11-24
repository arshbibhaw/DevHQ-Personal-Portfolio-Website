const https = require('https');

// In-memory sliding window rate limiter (10 min window, max 5 requests per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.RECEIVER_EMAIL;

  if (!resendApiKey || !receiverEmail) {
    return res.status(500).json({
      message: 'Server Configuration Error: Missing RESEND_API_KEY or RECEIVER_EMAIL'
    });
  }

  try {
    const { name, email, message, purpose, _gotcha } = req.body || {};

    // ── 1. Anti-Spam Honeypot Check ──
    if (_gotcha) {
      // Bot filled hidden honeypot; return dummy success without sending email
      return res.status(200).json({ success: true, message: 'Message sent!' });
    }

    // ── 2. In-Memory IP Rate Limiting ──
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const timestamps = (rateLimitMap.get(clientIp) || []).filter(t => now - t < RATE_LIMIT_WINDOW);

    if (timestamps.length >= MAX_REQUESTS) {
      return res.status(429).json({ message: 'Too many requests. Please try again in a few minutes.' });
    }
    timestamps.push(now);
    rateLimitMap.set(clientIp, timestamps);

    // ── 3. Strict Input Validation & Length Bounds ──
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim();
    const cleanPurpose = (purpose || 'General Inquiry').trim();
    const cleanMessage = (message || '').trim();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({ message: 'Invalid or missing name (max 100 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || cleanEmail.length > 100 || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid or missing email address.' });
    }

    if (cleanPurpose.length > 100) {
      return res.status(400).json({ message: 'Purpose exceeds maximum allowed length.' });
    }

    if (!cleanMessage || cleanMessage.length < 5 || cleanMessage.length > 3000) {
      return res.status(400).json({ message: 'Message must be between 5 and 3000 characters.' });
    }

    // ── 4. HTML Entity Sanitization (Prevent Email/HTML Injection) ──
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safePurpose = escapeHtml(cleanPurpose);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br/>');

    const payload = JSON.stringify({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: receiverEmail,
      reply_to: cleanEmail,
      subject: `[${safePurpose}] New Portfolio Message from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="color: #6d28d9; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Purpose:</strong> <span style="background: #ede9fe; color: #6d28d9; padding: 4px 10px; border-radius: 6px; font-weight: 600;">${safePurpose}</span></p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f3f4f6; padding: 12px 16px; border-left: 4px solid #8b5cf6; margin: 0; border-radius: 4px;">
            ${safeMessage}
          </blockquote>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">Sent via Aakarsh DevHQ Portfolio Contact Endpoint</p>
        </div>
      `
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            reject(new Error('Failed to parse response JSON'));
          }
        });
      });

      request.on('error', (e) => reject(e));
      request.write(payload);
      request.end();
    });

    if (data.status === 200 || data.status === 201) {
      return res.status(200).json({ success: true, message: 'Message sent!' });
    } else {
      return res.status(data.status).json(data.data);
    }
  } catch (error) {
    console.error('Error submitting form via Resend:', error);
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};
