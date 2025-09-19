const nodemailer = require('nodemailer');

function buildTransport() {
  const rawHost = process.env.EMAIL_HOST || '';
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();
  const portEnv = Number(process.env.EMAIL_PORT || 587);
  const useGmail = (process.env.EMAIL_SERVICE || '').toLowerCase() === 'gmail' || rawHost.includes('gmail');

  if (useGmail) {
    // Prefer explicit SMTP settings for Gmail with App Password
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: rawHost || 'localhost',
    port: portEnv,
    secure: portEnv === 465,
    auth: { user, pass },
  });
}

async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error('sendEmail: missing "to"');
  const from = (process.env.EMAIL_FROM || process.env.EMAIL_USER || '').trim();
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').trim();

  // Guard: ensure credentials present and non-empty
  const hasUser = user.length > 0;
  const hasPass = pass.length > 0;
  if (!hasUser || !hasPass) {
    console.error('Email credentials missing', { hasUser, hasPass });
    throw new Error('Email service not configured: missing credentials');
  }

  const transporter = buildTransport();
  if (process.env.NODE_ENV !== 'production') {
    const redactedUser = user ? user.replace(/(^.).+(@)/, '$1***$2') : '';
    console.log('[sendEmail] Transport ready (gmail:', ((process.env.EMAIL_SERVICE || '').toLowerCase() === 'gmail'), ') as', redactedUser);
  }

  const info = await transporter.sendMail({ from: from || user, to, subject, text, html });
  if (process.env.NODE_ENV !== 'production') {
    console.log('Email sent:', info.messageId);
  }
  return info;
}

module.exports = sendEmail;
