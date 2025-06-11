import { Request, Response, NextFunction } from "express";
import { getBearerToken, makeJWT } from "./../security/auth.js";
import {
  getUserFromRefreshToken,
  getRefreshTokenByToken,
} from "./../db/queries/refreshTokens.js";
import { AuthorizationError } from "./../errors.js";
import { config } from "./../config.js";
export async function handlerRefresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = await getRefreshTokenByToken(getBearerToken(req));
    if (!refreshToken) {
      throw new AuthorizationError("Invalid token provided to refresh");
    }
    if (refreshToken.revokedAt !== null) {
      throw new AuthorizationError("Token is revoked");
    } else {
      res.status(200).json({
        token: makeJWT(
          await getUserFromRefreshToken(refreshToken.token),
          3600,
          config.serverApi,
        ),
      });
      res.end();
    }
  } catch (err) {
    next(err);
  }
}
