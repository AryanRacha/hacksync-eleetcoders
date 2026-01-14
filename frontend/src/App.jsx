import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import DocumentAnalysis from './pages/DocumentAnalysis';

// Placeholders for other routes to prevent errors until they are created
const AuditDetail = () => <div className="p-10">Audit Detail Page (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<SubmitReport />} />
        <Route path="/analysis" element={<DocumentAnalysis />} />
        <Route path="/audit/:id" element={<AuditDetail />} />
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;