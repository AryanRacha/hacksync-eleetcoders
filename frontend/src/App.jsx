import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import DocumentAnalysis from './pages/DocumentAnalysis';
import AuditDetail from './pages/AuditDetail';
import Sidebar from './components/Sidebar';
import Reports from './pages/Reports';
import AuthPage from './pages/AuthPage';

// Layout: Sidebar on Left, Content on Right
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main content area scrolls independently */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;