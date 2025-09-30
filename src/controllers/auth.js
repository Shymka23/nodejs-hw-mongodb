import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../services/auth.js';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken, refreshToken: newRefreshToken } =
    await refreshUserSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
