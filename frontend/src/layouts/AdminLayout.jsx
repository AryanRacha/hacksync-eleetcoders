import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FileText, Users, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { logout } from '../api/authApi';

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'admin' };

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

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide text-white">INTEGRITY</h1>
                        <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">Control Tower</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Overview</span>
                    </NavLink>

                    <NavLink to="/admin/issues" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <ClipboardList size={20} />
                        <span className="font-medium">Issue Triage</span>
                    </NavLink>

                    <NavLink to="/admin/contracts" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <FileText size={20} />
                        <span className="font-medium">Contract Vault</span>
                    </NavLink>

                    <NavLink to="/admin/departments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Building2 size={20} />
                        <span className="font-medium">Departments</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-4">
                    <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">{user.name}</p>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">AUDITOR MODE</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="flex items-center gap-3 px-2 text-slate-400 hover:text-red-400 transition-colors w-full">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
