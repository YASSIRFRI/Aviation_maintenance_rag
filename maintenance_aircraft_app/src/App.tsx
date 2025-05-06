import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GetAssistance from './pages/GetAssistance';
import ValidateLogs from './pages/ValidateLogs';
import LogWriting from './pages/LogWriting';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="get-assistance" element={<GetAssistance />} />
          <Route path="validate-logs" element={<ValidateLogs />} />
          <Route path="log-writing" element={<LogWriting />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;