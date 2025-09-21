// Express error middleware має містити точно 4 параметри
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;

  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};

export { errorHandler };
