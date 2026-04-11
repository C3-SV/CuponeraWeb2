export class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const notFoundHandler = (_req, _res, next) => {
  next(new HttpError(404, "Recurso no encontrado."));
};

export const errorHandler = (error, _req, res, _next) => {
  const status = error instanceof HttpError ? error.status : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : "Ocurrió un error inesperado en el servidor.";

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    ok: false,
    message,
    details: error instanceof HttpError ? error.details : null,
  });
};
