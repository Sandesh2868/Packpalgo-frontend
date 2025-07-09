// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ExplorePage from './Explorepage';
import ThingsToCarryPage from './ThingsToCarryPage'; // <-- this was missing!
import BudgetCalculatorPage from './BudgetCalculatorPage';
import ItineraryPlannerPage from './ItineraryPlannerPage';
import { ThemeProvider } from './ThemeContext'; // ✅ ONLY once

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/things-to-carry" element={<ThingsToCarryPage />} />
          <Route path="/budget-calculator" element={<BudgetCalculatorPage />} />
          <Route path="/itinerary-planner" element={<ItineraryPlannerPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
