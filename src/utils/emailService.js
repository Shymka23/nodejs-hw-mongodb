import nodemailer from 'nodemailer';

// Перевіряємо чи є всі SMTP креденшили
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM;
const appDomain = process.env.APP_DOMAIN;

let transporter = null;

if (smtpHost && smtpPort && smtpUser && smtpPassword) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for 587/others
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000, // 10s
    socketTimeout: 10000, // 10s
    tls: { rejectUnauthorized: false },
  });
  console.log('SMTP transporter configured successfully');
} else {
  console.log('SMTP not configured - missing credentials');
}

export const sendResetPasswordEmail = async (to, token) => {
  // Якщо SMTP не налаштований, кидаємо помилку
  if (!transporter || !smtpFrom || !appDomain) {
    console.warn('SMTP not configured, cannot send email');
    throw new Error('Email service not configured');
  }

  const resetLink = `${appDomain}/reset-password?token=${token}`;

  const mailOptions = {
    from: smtpFrom,
    to,
    subject: 'Reset Your Password',
    html: `
      &lt;h1&gt;Password Reset Request&lt;/h1&gt;
      &lt;p&gt;You have requested to reset your password. Click the link below to reset it:&lt;/p&gt;
      &lt;a href="${resetLink}"&gt;Reset Password&lt;/a&gt;
      &lt;p&gt;This link will expire in 5 minutes.&lt;/p&gt;
      &lt;p&gt;If you didn't request this, please ignore this email.&lt;/p&gt;
    `,
  };

  // fail-fast захист на випадок зависань SMTP
  const sendMailWithTimeout = async options => {
    return await Promise.race([
      transporter.sendMail(options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP timeout')), 12000)
      ),
    ]);
  };

  try {
    await sendMailWithTimeout(mailOptions);
  } catch (e) {
    console.error('Error sending email', e?.message || e);
    throw new Error('Failed to send email');
  }
};
