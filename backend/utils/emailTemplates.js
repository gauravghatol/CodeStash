function baseEmailTemplate({ title = 'Notification', preheader = '', bodyHtml = '' }) {
  // Dark-friendly, Gmail-safe template using tables and inline styles
  // Avoids relying on body background; wraps content in a colored table container
  const bg = '#0b1020';
  const card = '#0f172a';
  const border = '#1f2942';
  const text = '#e5e7eb';
  const accent = '#7c3aed';

  const hiddenPreheader = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#0b1020;opacity:0;">
         ${preheader}
       </div>`
    : '';

  return `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${title}</title>
      <style>
        /* Some clients honor these */
        @media (prefers-color-scheme: dark) {
          .card { background: ${card} !important; }
          .text { color: ${text} !important; }
        }
        a { color: ${accent}; text-decoration: none; }
      </style>
    </head>
    <body style="margin:0;padding:0;background:${bg};">
      ${hiddenPreheader}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${bg};padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:${card};border:1px solid ${border};border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:20px 20px 12px 20px;">
                  <div class="text" style="font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${text};font-size:20px;font-weight:700;">${title}</div>
                </td>
              </tr>
              <tr>
                <td class="card" style="padding:0 20px 20px 20px;color:${text};font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                  ${bodyHtml}
                  <div style="height:8px"></div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;border-top:1px solid ${border};color:#9ca3af;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;">
                  <div>
                    © ${new Date().getFullYear()} CodeStash · This is an automated message.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function otpEmailTemplate({ username = 'there', otp, purpose = 'signup', appUrl = '' }) {
  const title = purpose === 'password_reset' ? 'Reset your password' : 'Verify your email';
  const preheader = purpose === 'password_reset'
    ? 'Your CodeStash password reset code'
    : 'Your CodeStash email verification code';
  const bodyHtml = `
    <p class="text" style="margin:0 0 10px 0;">Hi ${escapeHtml(username)},</p>
    <p class="text" style="margin:0 0 10px 0;">Your ${purpose === 'password_reset' ? 'password reset' : 'verification'} code is:</p>
    <div style="margin:10px 0 14px 0;">
      <div style="display:inline-block;padding:10px 14px;border:1px solid #1f2942;border-radius:8px;font-size:24px;font-weight:700;letter-spacing:4px;color:#e5e7eb;background:#0b1020;">
        ${escapeHtml(otp)}
      </div>
    </div>
    <p class="text" style="margin:0 0 14px 0;">This code will expire in 10 minutes.</p>
    ${appUrl ? `<p class="text" style="margin:0;">You can return to the app here: <a href="${appUrl}" style="color:#7c3aed;">${appUrl}</a></p>` : ''}
  `;
  const html = baseEmailTemplate({ title, preheader, bodyHtml });
  const text = `${title}\n\nCode: ${otp}\nThis code will expire in 10 minutes.${appUrl ? `\nOpen app: ${appUrl}` : ''}`;
  const subject = purpose === 'password_reset' ? 'Your CodeStash password reset code' : 'Your CodeStash verification code';
  return { subject, html, text };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { baseEmailTemplate, otpEmailTemplate };
