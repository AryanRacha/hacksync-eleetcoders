import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import AuditDetail from './pages/AuditDetail';
import Sidebar from './components/Sidebar';
import Reports from './pages/Reports';
import AuthPage from './pages/AuthPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import IssueManagement from './pages/admin/IssueManagement';
import IssueAuditDetail from './pages/admin/IssueAuditDetail';
import ContractVault from './pages/admin/ContractVault';
import DepartmentDashboard from './pages/admin/DepartmentDashboard';

// Layout: Sidebar on Left, Content on Right
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
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

        {/* User Routes (Citizen) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit/:id" element={<AuditDetail />} />
        </Route>

        {/* Admin Routes (Auditor) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="issues" element={<IssueManagement />} />
            <Route path="audit/:id" element={<IssueAuditDetail />} />
            <Route path="contracts" element={<ContractVault />} />
            <Route path="departments" element={<DepartmentDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;