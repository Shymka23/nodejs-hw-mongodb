import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }

  next();
};

export { isValidId };
