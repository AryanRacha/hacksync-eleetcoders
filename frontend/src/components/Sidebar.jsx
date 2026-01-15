import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, FileSearch, LogOut, ShieldAlert } from 'lucide-react';
// Ensure this path is correct for your project structure
import { logout } from '../api/authApi';

const Sidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest', role: 'viewer' };

    const handleLogout = async () => {
        try {
            if (typeof logout === 'function') await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/auth');
        }
    };

    // Helper for active link styles
    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`;

    return (
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider text-blue-400">INTEGRITY</h1>
                <p className="text-xs text-slate-400 mt-1">Public Oversight Platform</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavLink to="/" className={getLinkClass}>
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Overview</span>
                </NavLink>

                <NavLink to="/submit" className={getLinkClass}>
                    <Plus size={20} />
                    <span className="font-medium">Submit Report</span>
                </NavLink>

                <NavLink to="/report" className={getLinkClass}>
                    <FileText size={20} />
                    <span className="font-medium">Reports</span>
                </NavLink>

                <NavLink to="/document-analysis" className={getLinkClass}>
                    <FileSearch size={20} />
                    <span className="font-medium">Doc Intelligence</span>
                </NavLink>

                {/* ✅ NEW: Direct Link to the Agentic Audit Feature */}
                <NavLink to="/audit/RPT-DEMO-AI" className={getLinkClass}>
                    <ShieldAlert size={20} className="text-red-400" />
                    <span className="font-medium text-red-100">AI Audit Agent</span>
                </NavLink>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 capitalize truncate">{user.role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-2 text-slate-400 hover:text-red-400 transition-colors w-full"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;