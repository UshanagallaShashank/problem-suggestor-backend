// backend/utils/apiError.js
module.exports = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
