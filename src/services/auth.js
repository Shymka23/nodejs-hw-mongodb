import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'crypto';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

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
  const { password, ...userWithoutPassword } = user.toObject();
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
