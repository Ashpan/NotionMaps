// Temporary debug endpoint - remove after fixing the issue
export default function handler(req, res) {
  // Only enable in development or for debugging
  if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) {
    return res.status(404).json({ error: 'Not found' });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ? 'SET' : 'MISSING',
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'MISSING',
    AUTH0_SECRET: process.env.AUTH0_SECRET ? 'SET' : 'MISSING',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'NOT_SET',
    AUTH0_SCOPE: process.env.AUTH0_SCOPE || 'NOT_SET',
  };

  return res.json({
    message: 'Auth0 Environment Debug Info',
    environment: envVars,
    timestamp: new Date().toISOString(),
  });
}