import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Page Imports
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { AnomalyMapPage } from './pages/AnomalyMapPage';
import { AnalysisHistoryPage } from './pages/AnalysisHistoryPage';
import { ReportsPage } from './pages/ReportsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Operational App Layout with Persistent Sidebar & Header */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<AnalysisHistoryPage />} />
            <Route path="/results/:id" element={<AnalysisResultsPage />} />
            <Route path="/map" element={<AnomalyMapPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
