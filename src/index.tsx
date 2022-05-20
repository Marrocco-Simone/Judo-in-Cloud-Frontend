import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MatchTimer from './Pages/MatchTimer/MatchTimer';
import LoginPage from './Pages/Login/LoginPage';
import AthletesPage from './Pages/Athletes/AthletesPage';
import TournamentsPage from './Pages/Tournaments/TournamentsPage';
import CompetitionManagementPage from './Pages/CompetitionManagement/CompetitionManagementPage';
import TournamentPage from './Pages/Tournament/TournamentPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='login' element={<LoginPage />} />
          <Route path='manage' element={<CompetitionManagementPage />} />
          <Route path='athletes' element={<AthletesPage />} />
          <Route path='tournaments' >
            <Route path=':tournamentId' element={<TournamentPage />}></Route>
            <Route path='' element={<TournamentsPage />}></Route>
          </Route>
          <Route path='*' element={
            <div className='text-xl'>Page not found</div>
          } />
        </Route>
        <Route path='/match-timer' element={<MatchTimer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
