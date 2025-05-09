import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import CreateGroupOrJoinGroup from './screen/creategrouporjoingroup';
import StartGame from './screen/startgame';
import SignIn from './screen/signin';

const router = createBrowserRouter(
  [
    { path: "/", element: <CreateGroupOrJoinGroup /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/startgame/:id", element: <StartGame /> },
  ]
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
