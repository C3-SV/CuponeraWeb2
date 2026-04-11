import { HttpError } from "./http.js";
import { authenticateRequest } from "../modules/auth/auth.service.js";

export const getBearerToken = (headers = {}) => {
  const authorization = headers.authorization ?? headers.Authorization;
  if (!authorization || typeof authorization !== "string") {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth = async (req, _res, next) => {
  try {
    const accessToken = getBearerToken(req.headers);
    if (!accessToken) {
      throw new HttpError(401, "Debés iniciar sesión.");
    }

    req.auth = await authenticateRequest(accessToken);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (role) => (req, _res, next) => {
  const currentRole = req.auth?.profile?.role ?? null;
  if (currentRole !== role) {
    next(new HttpError(403, "No tenés permisos para acceder a este recurso."));
    return;
  }

  next();
};
