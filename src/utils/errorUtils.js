const createError = (errorTemplate) => {
  const error = new Error(errorTemplate.message);
  error.status = errorTemplate.status;
  return error;
};

module.exports = { createError };
