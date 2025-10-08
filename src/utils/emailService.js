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
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
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

  try {
    await transporter.sendMail(mailOptions);
  } catch {
    console.error('Error sending email');
    throw new Error('Failed to send email');
  }
};
