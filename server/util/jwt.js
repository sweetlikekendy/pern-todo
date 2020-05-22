import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { resStatusPayload } from "./resStatusPayload";

dotenv.config({ path: `../.env` });
const tokenSecret = process.env.JWT_SECRET_KEY;

/**
 *
 * @param {*} req - The http req object
 * @param {*} res - The http response object
 * @param {*} next - Next function used in express to call the next middleware
 *
 * This function is to verify the jwt token in the req header object
 * To ensure authorization, JWT user id must match user id in API's URI
 */

const authorizeJwt = (req, res, next) => {
  const { user_id } = req.params;
  const intUserId = parseInt(user_id);

  // find Authorize key in request header
  const accessToken = req.header("Authorization");

  // if no access token return status 401
  if (!accessToken)
    return resStatusPayload(res, "401", {
      tokenAvailable: false,
      message: "Access Denied",
    });

  try {
    // Verify incoming accessToken
    const verified = jwt.verify(accessToken, tokenSecret);

    // Check JWT for user id and see if it matches the API's user id
    const isMatchingId = verified.id === intUserId;

    if (!isMatchingId)
      return resStatusPayload(res, "401", { message: "Access Denied" });

    if (isMatchingId) {
      next();
    }
  } catch (err) {
    resStatusPayload(res, "400", {
      verifyToken: false,
      message: err.message,
    });
  }
};

/**
 *
 * @param {*} user - The user that has been requested in an object
 *
 * This function issues a jwt to a user that is signing in
 */

const issueJwt = (user) => {
  const { id, first_name, last_name } = user;
  const expiresIn = "1w";

  const payload = {
    id,
    first_name,
    last_name,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, tokenSecret, { expiresIn });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
};

export { authorizeJwt, issueJwt };
