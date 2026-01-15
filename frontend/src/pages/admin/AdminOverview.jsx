import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { Activity, AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';

const KPICard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
                <p className="text-xs text-slate-400 mt-1">{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        highRisk: 0,
        resolutionRate: 0,
        pendingAudits: 0,
        recentIssues: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to load admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Poll every 10 seconds for live updates
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Control Tower</h1>
                <p className="text-slate-500">Real-time oversight of infrastructure projects and integrity reports.</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Total Reports"
                    value={stats.totalReports}
                    subtext="All time submissions"
                    icon={Activity}
                    color="bg-blue-600"
                />
                <KPICard
                    title="High-Risk Flags"
                    value={stats.highRisk}
                    subtext="Critical anomalies detected"
                    icon={AlertTriangle}
                    color="bg-red-600"
                />
                <KPICard
                    title="Resolution Rate"
                    value={`${stats.resolutionRate}%`}
                    subtext="Issues closed vs open"
                    icon={CheckCircle}
                    color="bg-emerald-600"
                />
                <KPICard
                    title="Pending Audits"
                    value={stats.pendingAudits}
                    subtext="Require immediate attention"
                    icon={Clock}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder for now) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Report Trends</h3>
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        Chart Visualization Component
                    </div>
                </div>

                {/* Live Alert Feed */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-500" />
                            Live Alert Feed
                        </h3>
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">Live</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {stats.recentIssues.map((issue) => (
                            <div key={issue._id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border-l-4 border-indigo-500">
                                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{issue.category}</p>
                                <h4 className="text-sm font-medium text-slate-800 line-clamp-2">{issue.title}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-500">{new Date(issue.createdAt).toLocaleTimeString()}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">{issue.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
