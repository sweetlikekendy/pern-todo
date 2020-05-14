/**
 *
 * @param {*} res - The http response object
 * @param {*} statusCode - The status code of the response
 * @param {*} payload - The payload after response
 *
 * This function is used to send status codes after each http response
 */

export const resStatusPayload = (res, statusCode, payload) => {
  return res.status(statusCode).json(payload);
};
