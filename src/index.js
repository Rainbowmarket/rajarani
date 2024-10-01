import React from 'react';
import ReactDOM from 'react-dom/client';
// import './style/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import RajaRani from './rajarani';
// import OvalTable from './test';
// import HomeScreen from './homepage';
import CreateGroupOrJoinGroup from './screen/creategrouporjoingroup';
import CreateGroup from './screen/creategroup';
import JoinGroup from './screen/joingroup';
import StartGame from './screen/startgame';
import SignIn from './screen/signin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<CreateGroupOrJoinGroup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/joingroup" element={<JoinGroup />} />
        <Route path="/Group/:id/:username" element={<StartGame />} />
        {/* <Route path="/test" element={<OvalTable />} />
        <Route path="/start" element={<HomeScreen />} />
        <Route path="/start/:username" element={<RajaRani />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);
