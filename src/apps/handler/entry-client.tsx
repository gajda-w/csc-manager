import '../../globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AppView, loader as appLoader } from './client/views/app/app-view.tsx';

const BASENAME = (() => {
  const basename = `${globalThis.env.BASE_PATH ?? ''}/client`;
  const segments = basename.split('/').filter(Boolean);
  return `/${segments.join('/')}`;
})();

const router = createBrowserRouter(
  [
    {
      path: '/app',
      Component: AppView,
      loader: appLoader,
    },
  ],
  /**
   * Must match the path in entry-server.tsx
   */
  /**
   * Must match the path in entry-server.tsx
   */
  { basename: BASENAME }
);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
