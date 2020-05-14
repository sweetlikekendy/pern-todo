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
 */
const authorizeJwt = (req, res, next) => {
  // find auth-token key in request header
  const accessToken = req.header("Authorization");

  // if no access token return status 401
  if (!accessToken)
    return resStatusPayload(res, "401", {
      tokenAvailable: false,
      message: "Access Denied",
    });

  try {
    const verified = jwt.verify(accessToken, accessTokenSecret);
    req.user = verified;
    next();
  } catch (err) {
    resStatusPayload(res, "400", {
      verifyToken: false,
      message: "Invalid Token",
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
  const _id = user.id;

  const expiresIn = "1w";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  console.log(tokenSecret);
  const signedToken = jwt.sign(payload, tokenSecret, { expiresIn });

  return {
    token: signedToken,
    expires: expiresIn,
  };
};

export { authorizeJwt, issueJwt };
