import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, FileText, Mail, Search, Bell, Plus, Users, AlertTriangle, FileCheck, IndianRupee, Activity, Calendar, FileSearch } from 'lucide-react';
import MapView from '../components/MapView';
import { getUserReports } from '../api/reportApi';

// Internal Components
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-100 text-gray-800';

    if (status === 'Verified') colorClass = 'bg-green-100 text-green-800';
    if (status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-800';
    if (status === 'Rejected') colorClass = 'bg-red-100 text-red-800';
    if (status === 'Resolved') colorClass = 'bg-blue-100 text-blue-800';

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit ${colorClass}`}>
            {status}
        </span>
    );
};

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { role: 'guest' });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const response = await getUserReports();
                console.log("Fetched reports:", response.data);
                setReports(response.data || []);
            } catch (error) {
                console.error("Error fetching user reports:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Calculate Stats
    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
    const auditPending = reports.filter(r => r.auditVerification?.status === 'Pending').length;
    // Assuming 'Active Corruption Alerts' logic or just hardcode/placeholder if not specified in prompt details
    // For now keeping existing hardcoded value or making it 0 if not calculated
    const corruptionAlerts = 0;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search projects, locations, or Reference IDs..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    {user?.role === 'user' && ( // Only show if role is user
                        <button
                            onClick={() => navigate('/submit')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Report
                        </button>
                    )}
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Top Row: Stats (Citizen Focused) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="My Reports Submitted" value={totalReports} icon={FileText} color="bg-blue-500" />
                    <StatCard title="Reports Resolved" value={resolvedReports} icon={FileCheck} color="bg-green-500" />
                    <StatCard title="Under AI Audit" value={auditPending} icon={Activity} color="bg-purple-500" />
                    <StatCard title="Active Corruption Alerts" value={corruptionAlerts} icon={AlertTriangle} color="bg-red-500" />
                </div>

                {/* Middle Row: Map and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">Geographic Distribution</h2>
                        <div className="flex gap-2">
                            {['All', 'Roads', 'Sanitation', 'Education'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeCategory === cat
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative bg-slate-50">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <MapView reports={reports} />
                        )}
                    </div>
                </div>

                {/* Bottom Row: Recent Reports Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-800">Recent Reports</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date Submitted</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-700 block truncate max-w-xs">{report.title}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-slate-600 capitalize">{report.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={report.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/audit/${report._id}`)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {!isLoading && reports.length === 0 && (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No reports submitted yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};


export default Dashboard;