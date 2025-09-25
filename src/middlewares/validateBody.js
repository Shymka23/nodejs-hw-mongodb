import createHttpError from 'http-errors';

const validateBody = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(createHttpError(400, error.details[0].message));
      return;
    }

    next();
  };
};

export { validateBody };
