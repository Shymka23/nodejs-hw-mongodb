import createHttpError from 'http-errors';

// Дозволяє запити з файлом, навіть якщо body порожній (для PATCH з фото)
export const validateBodyOrFile = schema => {
  return (req, res, next) => {
    const hasBodyFields = req.body && Object.keys(req.body).length > 0;
    const hasFile = Boolean(req.file);

    if (!hasBodyFields && hasFile) {
      return next();
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.details[0].message));
    }

    next();
  };
};
