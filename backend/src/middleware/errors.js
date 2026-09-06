export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(' ') });
  if (err.code === 11000) return res.status(409).json({ message: 'That record already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource identifier.' });
  res.status(err.status || 500).json({ message: err.message || 'Unexpected server error.' });
}
