import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import DocumentAnalysis from './pages/DocumentAnalysis';
import AuditDetail from './pages/AuditDetail';
import Sidebar from './components/Sidebar';

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

// Placeholder for Reports List View (reuses Dashboard for now or a simple list)
const ReportsList = () => <div className="p-10 font-bold text-slate-700">Reports List View (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/reports" element={<ReportsList />} />
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
