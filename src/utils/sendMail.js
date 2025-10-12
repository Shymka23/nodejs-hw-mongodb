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
  connectionTimeout: 30000, // 30 секунд
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const sendEmail = async options => {
  try {
    // Спробуємо підключитися спочатку
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (verifyError) {
    console.error('❌ SMTP verify failed:', verifyError.message);
    throw verifyError;
  }

  return await transporter.sendMail(options);
};
