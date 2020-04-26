export const resError = (res, statusCode, message) => {
  res.status(statusCode);
  res.json({ message });
};
