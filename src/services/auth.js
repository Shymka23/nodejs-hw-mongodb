import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendResetPasswordEmail } from '../utils/emailService.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const registerUser = async payload => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  // Повертаємо без пароля
  const { password: _password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const loginUser = async payload => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  // Видаляємо стару сесію
  await SessionsCollection.deleteOne({ userId: user._id });

  // Створюємо токени
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, session };
};

export const refreshUserSession = async refreshToken => {
  const session = await SessionsCollection.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  // Видаляємо стару сесію
  await SessionsCollection.deleteOne({ _id: session._id });

  // Створюємо нові токени
  const accessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  const newSession = await SessionsCollection.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken: newRefreshToken, session: newSession };
};

export const logoutUser = async sessionId => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const sendPasswordResetEmail = async email => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, getEnvVar('JWT_SECRET'), {
    expiresIn: '5m',
  });

  try {
    await sendResetPasswordEmail(email, token);
  } catch (_error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await UsersCollection.findOne({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UsersCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    await SessionsCollection.deleteMany({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};
