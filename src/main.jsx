// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import ExplorePage from './Explorepage';
import ThingsToCarryPage from './ThingsToCarryPage';
import BudgetCalculatorPage from './BudgetCalculatorPage';
import ItineraryPlannerPage from './ItineraryPlannerPage';
import GroupList from './components/GoSplit/GroupList';
import GroupDetails from './components/GoSplit/GroupDetails';
import PotteryMeetupEvent from './components/PotteryMeetupEvent'; // ✅ add this
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import TrekkingEvent from './components/TrekkingEvent';
import BeachCleanupEvent from './components/BeachCleanupEvent';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/things-to-carry" element={<ThingsToCarryPage />} />
            <Route path="/budget-calculator" element={<BudgetCalculatorPage />} />
            <Route path="/itinerary-planner" element={<ItineraryPlannerPage />} />
            <Route path="/gosplit" element={<GroupList />} />
            <Route path="/gosplit/group/:groupId" element={<GroupDetails />} />
            <Route path="/pottery-meetup" element={<PotteryMeetupEvent />} /> {/* ✅ works now */}
            <Route path="/event/pottery" element={<Navigate to="/pottery-meetup" replace />} />
            <Route path="/event/trekking" element={<TrekkingEvent />} />
            <Route path="/event/beach-cleanup" element={<BeachCleanupEvent />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
