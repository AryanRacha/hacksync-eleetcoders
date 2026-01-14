import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Fixed: Added Link import
import { LayoutDashboard, Map as MapIcon, FileText, Mail, Search, Bell, Plus, Users, AlertTriangle, FileCheck, IndianRupee, Activity, Calendar, FileSearch } from 'lucide-react';
import MapView from '../components/MapView';

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

const StatusBadge = ({ status, riskLevel }) => {
    let colorClass = 'bg-gray-100 text-gray-800';

    // Status coloring
    if (status === 'Verified') colorClass = 'bg-green-100 text-green-800';
    if (status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-800';
    if (status === 'Rejected') colorClass = 'bg-red-100 text-red-800';

    // Risk level indicators (dot)
    let riskColor = 'bg-gray-400';
    if (riskLevel === 'High') riskColor = 'bg-red-500';
    if (riskLevel === 'Medium') riskColor = 'bg-yellow-500';
    if (riskLevel === 'Low') riskColor = 'bg-green-500';

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit ${colorClass}`}>
            <span className={`w-2 h-2 rounded-full ${riskColor}`}></span>
            {status}
        </span>
    );
};

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        // Mock API Call
        const fetchReports = async () => {
            setIsLoading(true);

            // Simulating network delay
            setTimeout(() => {
                const mockData = [
                    { id: 1, type: 'Road Construction', location: [18.5204, 73.8567], status: 'Pending', riskLevel: 'High', date: '2023-10-25' },
                    { id: 2, type: 'Sanitation', location: [19.0760, 72.8777], status: 'Verified', riskLevel: 'Low', date: '2023-10-24' },
                    { id: 3, type: 'Street Light', location: [28.7041, 77.1025], status: 'Rejected', riskLevel: 'Medium', date: '2023-10-23' },
                    { id: 4, type: 'Water Supply', location: [12.9716, 77.5946], status: 'Pending', riskLevel: 'High', date: '2023-10-22' },
                    { id: 5, type: 'Bridge Maintenance', location: [13.0827, 80.2707], status: 'Verified', riskLevel: 'Low', date: '2023-10-21' },
                ];
                setReports(mockData);
                setIsLoading(false);
            }, 1500);
        };

        fetchReports();
    }, []);

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
                    <button
                        onClick={() => navigate('/submit')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Report
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Top Row: Stats (Citizen Focused) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="My Reports Submitted" value="12" icon={FileText} color="bg-blue-500" />
                    <StatCard title="Reports Resolved" value="5" icon={FileCheck} color="bg-green-500" />
                    <StatCard title="Under AI Audit" value="3" icon={Activity} color="bg-purple-500" />
                    <StatCard title="Active Corruption Alerts" value="1" icon={AlertTriangle} color="bg-red-500" />
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
                                    <th className="px-6 py-4">Infrastructure Type</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Risk Level</th>
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
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <FileCheck size={16} />
                                                    </div>
                                                    <span className="font-medium text-slate-700">{report.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {report.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded border ${report.riskLevel === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    report.riskLevel === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        'bg-green-50 text-green-600 border-green-100'
                                                    }`}>
                                                    {report.riskLevel} Risk
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={report.status} riskLevel={report.riskLevel} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/audit/RPT-2023-${report.id}`)}
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
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;