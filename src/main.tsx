import ReactDOM from 'react-dom/client';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import CandidateSearch from './pages/CandidateSearch.tsx';
import SavedCandidates from './pages/SavedCandidates.tsx';
import ErrorPage from './pages/ErrorPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CandidateSearch />,
      },
      {
        path: '/shortlist',
        element: (
          <SavedCandidates
            storageKey='shortlistedCandidates'
            eyebrow='Your shortlist'
            title='Candidates worth a closer look.'
            description='Profiles you starred while searching stay here on this device.'
            emptyTitle='Your shortlist is empty.'
          />
        ),
      },
      {
        path: '/saved',
        element: (
          <SavedCandidates
            storageKey='storedCandidates'
            eyebrow='Saved profiles'
            title='Your saved candidates.'
            description='Bookmarked GitHub profiles you want to keep handy.'
            emptyTitle='You have no saved candidates.'
          />
        ),
      },
      {
        path: '/SavedCandidates',
        element: <Navigate to='/saved' replace />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
