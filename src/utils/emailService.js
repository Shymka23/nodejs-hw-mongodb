import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: getEnvVar('SMTP_PORT'),
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`;

  const mailOptions = {
    from: getEnvVar('SMTP_FROM'),
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
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
