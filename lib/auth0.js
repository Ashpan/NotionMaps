import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  // Environment variables are automatically picked up by the SDK
  // But we need to explicitly configure session settings for iframe embedding
  session: {
    cookie: {
      sameSite: 'none',
      secure: true, // MUST be true when sameSite is 'none'
      httpOnly: true,
      // domain should match your application domain for production
      // For localhost development, this can be omitted
    }
  },
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
    postLogoutRedirect: '/'
  }
});