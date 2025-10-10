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
  const resetLink = `${
    appDomain || 'http://localhost:3000'
  }/reset-password?token=${token}`;

  // Якщо SMTP не налаштований, логуємо посилання (для розробки)
  if (!transporter || !smtpFrom || !appDomain) {
    console.warn('⚠️  SMTP not configured - DEV MODE');
    console.log('📧 Password reset link:', resetLink);
    console.log('📧 Would send to:', to);
    return; // Success в dev режимі
  }

  const mailOptions = {
    from: smtpFrom,
    to,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
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
    // Спочатку перевіримо з'єднання
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      // Якщо помилка автентифікації, використовуємо fallback
      if (
        verifyError.code === 'EAUTH' ||
        verifyError.message?.includes('Authentication failed')
      ) {
        console.warn('⚠️  SMTP auth failed - using fallback mode');
        console.log('📧 Password reset link:', resetLink);
        console.log(
          '📧 To fix: Create SMTP key at https://app.brevo.com -> SMTP & API -> SMTP'
        );
        return; // Success в fallback режимі
      }
      throw verifyError; // Інші помилки кидаємо далі
    }

    await sendMailWithTimeout(mailOptions);
    console.log('✅ Email sent successfully to:', to);
  } catch (e) {
    console.error('❌ Error sending email:', e?.message || e);
    console.log('📧 Debug - reset link:', resetLink);
    throw new Error('Failed to send email');
  }
};
