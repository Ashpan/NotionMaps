# Auth0 Next.js SDK Sample Application

This sample demonstrates the integration of [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0) into a Next.js application created using [create-next-app](https://nextjs.org/docs/api-reference/create-next-app). The sample is a companion to the [Auth0 Next.js SDK Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs).

This sample demonstrates the following use cases:

- [Login](https://github.com/auth0-samples/auth0-nextjs-samples/blob/main/Sample-01/components/NavBar.jsx#L61-L67)
- [Logout](https://github.com/auth0-samples/auth0-nextjs-samples/blob/main/Sample-01/components/NavBar.jsx#L93-L95)
- [Showing the user profile](https://github.com/auth0-samples/auth0-nextjs-samples/blob/main/Sample-01/pages/profile.jsx)
- [Protecting client-side rendered pages](https://github.com/auth0-samples/auth0-nextjs-samples/blob/main/Sample-01/pages/profile.jsx#L43-L46)
- [Calling APIs](https://github.com/auth0-samples/auth0-nextjs-samples/blob/main/Sample-01/pages/external.jsx)

## Project setup

Use `npm` to install the project dependencies:

```bash
npm install
```

## Configuration

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure the following services:**

#### Auth0 Setup
1. Create an Auth0 application at [Auth0 Dashboard](https://manage.auth0.com/)
2. Set up allowed callback URLs: `http://localhost:3000/api/auth/callback`
3. Set up allowed logout URLs: `http://localhost:3000`
4. Copy your Domain, Client ID, and Client Secret to `.env.local`
5. Generate a secret: `openssl rand -hex 32`

#### Notion Integration Setup
1. Create a Notion integration at [Notion Developers](https://developers.notion.com/)
2. Copy your OAuth Client ID and Client Secret to `.env.local`
3. Set up your OAuth redirect URI to match your domain

#### Google Maps Setup
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create an API key and add it to `.env.local`
4. Restrict the key to your domain for security

#### Supabase Setup
1. Create a project at [Supabase](https://supabase.com/)
2. Copy your project URL and anon key to `.env.local`
3. Set up your database schema (see database section below)

### Optional API Configuration

For the **External API** page to work, you will need to [create an API](https://auth0.com/docs/authorization/apis) using the [management dashboard](https://manage.auth0.com/#/apis). This will give you an API Identifier that you can use in the `AUTH0_AUDIENCE` environment variable. Then you will need to [add a permission](https://auth0.com/docs/get-started/dashboard/add-api-permissions) named `read:shows` to your API.

If you do not wish to use an API, you can omit the `AUTH0_AUDIENCE` and `AUTH0_SCOPE` values.

## Run the sample

### Compile and hot-reload for development

This compiles and serves the Next.js app and starts the API server on port 3001.

```bash
npm run dev
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Docker build

To build and run the Docker image, run `exec.sh`, or `exec.ps1` on Windows.

### Run the unit tests

```bash
npm run test
```

### Run the integration tests

```bash
npm run test:integration
```

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple sources](https://auth0.com/docs/identityproviders), either social identity providers such as **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce** (amongst others), or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS, or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://auth0.com/docs/connections/database/custom-db)**.
* Add support for **[linking different user accounts](https://auth0.com/docs/users/user-account-linking)** with the same user.
* Support for generating signed [JSON Web Tokens](https://auth0.com/docs/tokens/json-web-tokens) to call your APIs and **flow the user identity** securely.
* Analytics of how, when, and where users are logging in.
* Pull data from other sources and add it to the user profile through [JavaScript rules](https://auth0.com/docs/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click **Sign Up**.
2. Use Google, GitHub, or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/responsible-disclosure-policy) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
