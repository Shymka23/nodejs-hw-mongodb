import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  pool: true, // використовувати connection pool
  maxConnections: 1,
  maxMessages: 3,
});

export const sendEmail = async options => {
  // Логуємо для діагностики на Render
  console.log('📧 Attempting to send email to:', options.to);
  console.log('📧 SMTP Host:', getEnvVar(SMTP.SMTP_HOST));
  console.log('📧 SMTP Port:', getEnvVar(SMTP.SMTP_PORT));
  
  try {
    const info = await transporter.sendMail(options);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    console.error('❌ Error code:', error.code);
    throw error;
  }
};
