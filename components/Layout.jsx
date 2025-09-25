import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import NavBar from './NavBar';

const Layout = ({ children }) => {
  const router = useRouter();
  const isMapPage = router.pathname === '/map';

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" />
        <title>Notion Maps by Ashpan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {isMapPage ? (
        // Full-screen layout for map page
        <div className="map-layout">
          {children}
        </div>
      ) : (
        // Normal layout with navbar for other pages
        <main id="app" className="d-flex flex-column h-100" data-testid="layout">
          <NavBar />
          {children}
        </main>
      )}
    </>
  );
};

export default Layout;
