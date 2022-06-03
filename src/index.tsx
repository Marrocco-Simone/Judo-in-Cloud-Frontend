import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MatchTimer from './Pages/MatchTimer/MatchTimer';
import LoginPage from './Pages/Login/LoginPage';
import AthletesPage from './Pages/Athletes/AthletesPage';
import CompetitionManagementPage from './Pages/CompetitionManagement/CompetitionManagementPage';
import Tournament from './Pages/Tournament/Tournament';
import MainLayout from './Components/Layout/MainLayout';
import TournamentPage from './Pages/Tournament/TournamentPage';
import PublicTournament from './Pages/Public/PublicTournaments';
import PublicShell from './Pages/Public/PublicShell';

/* TODO set as tailwind */
import './Css/match.css';
import './Css/modal.css';
import './Css/tournament.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route element={<MainLayout />} >
            <Route index element={<></>}></Route>
            <Route path='login' element={<LoginPage />} />
            <Route path='manage' element={<CompetitionManagementPage />} />
            <Route path='athletes' element={<AthletesPage />} />
            <Route path='tournament'>
              <Route path='' element={<Tournament />} />
              <Route path=':tournamentId' element={<TournamentPage />} />
            </Route>
            <Route path='*' element={
              <div className='text-xl'>Page not found</div>
            } />
            <Route path=':slug' element={<PublicShell />} >
              <Route index element={<PublicTournament />} />
            </Route>

          </Route>
          <Route path='/match-timer' element={<MatchTimer />}>
            <Route path=':matchId' element={<MatchTimer />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
