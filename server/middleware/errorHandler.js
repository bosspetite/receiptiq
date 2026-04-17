export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : message,
    message,
    ...(process.env.NODE_ENV === 'development' && status >= 500 && { stack: err.stack }),
  });
}
