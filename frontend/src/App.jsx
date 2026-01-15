import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import DocumentAnalysis from './pages/DocumentAnalysis';
import AuditDetail from './pages/AuditDetail';
import Sidebar from './components/Sidebar';
import Reports from './pages/Reports';
import AuthPage from './pages/AuthPage';

// Layout wrapper to ensure Sidebar is present on all pages
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/document-analysis" element={<DocumentAnalysis />} />
          <Route path="/audit/:id" element={<AuditDetail />} />
        </Route>

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


export default App;