import nodemailer from 'nodemailer';

import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: Number(getEnvVar('SMTP_PORT')) === 465, // true для 465, false для 587
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export const sendEmail = async options => {
  return await transporter.sendMail(options);
};
