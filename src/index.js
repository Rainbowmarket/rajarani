import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreateGroupOrJoinGroup from './screen/creategrouporjoingroup';
import CreateGroup from './screen/creategroup';
import JoinGroup from './screen/joingroup';
import StartGame from './screen/startgame';
import SignIn from './screen/signin';
// import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <GoogleAuthProvider clientId="AIzaSyBBul5TJjMTA3870Sx3_b6S9qSEBxfl6Tc"> */}
    <Router>
      <Routes>
        <Route path="/" element={<CreateGroupOrJoinGroup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/joingroup" element={<JoinGroup />} />
        <Route path="/Group/:id/:username" element={<StartGame />} />
      </Routes>
    </Router>
    {/* </GoogleAuthProvider> */}
  </React.StrictMode>
);
