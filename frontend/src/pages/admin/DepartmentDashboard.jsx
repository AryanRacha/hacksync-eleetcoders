import React, { useEffect, useState } from 'react';
import { getAllIssues } from '../../api/reportApi';
import {
    Building2,
    Droplet,
    Trash2,
    Zap,
    Truck,
    AlertTriangle,
    CheckCircle,
    Activity,
    Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DepartmentDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllIssues();
                setIssues(response.data);
            } catch (error) {
                console.error("Failed to fetch issues distribution", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 1. Aggregation Logic ---
    const getDeptStats = (categories, deptName) => {
        const deptIssues = issues.filter(i => categories.includes(i.category.toLowerCase()));

        const total = deptIssues.length;
        const resolved = deptIssues.filter(i => i.status === 'Resolved').length;
        const highRisk = deptIssues.filter(i =>
            ['High', 'Critical'].includes(i.auditVerification?.riskLevel)
        ).length;
        const progress = total > 0 ? (resolved / total) * 100 : 0;

        return { total, resolved, highRisk, progress, deptName };
    };

    const roads = getDeptStats(['pothole'], 'Roads & Highways');
    const water = getDeptStats(['water supply', 'drainage'], 'Water Supply');
    const waste = getDeptStats(['garbage'], 'Waste Management');
    const safety = getDeptStats(['streetlight', 'traffic'], 'Public Safety & Lighting');

    const chartData = [
        { name: 'Roads', value: roads.total, color: '#3b82f6' }, // Blue
        { name: 'Water', value: water.total, color: '#06b6d4' }, // Cyan
        { name: 'Waste', value: waste.total, color: '#8b5cf6' }, // Violet
        { name: 'Lighting', value: safety.total, color: '#f59e0b' }, // Amber
    ];

    // --- Components ---
    const DeptCard = ({ title, icon: Icon, stats, colorClass }) => (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.replace('bg-', 'text-')}`}>
                <Icon size={80} />
            </div>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-${colorClass.split('-')[1]}-600`}>
                    <Icon size={24} />
                </div>
                {stats.highRisk > 0 && (
                    <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold border border-red-100 animate-pulse">
                        <AlertTriangle size={10} /> {stats.highRisk} Critical
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">{title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
                <span className="text-xs text-slate-400">Reports</span>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Resolution Rate</span>
                    <span className="font-medium">{stats.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${stats.progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-12 text-center text-slate-500">Loading Department Analytics...</div>;

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="text-indigo-600" />
                    Departmental Performance
                </h1>
                <p className="text-slate-500">Resource allocation and accountability heatmap.</p>
            </header>

            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DeptCard title="Roads & Highways" icon={Truck} stats={roads} colorClass="bg-blue-500" />
                <DeptCard title="Water Suppy" icon={Droplet} stats={water} colorClass="bg-cyan-500" />
                <DeptCard title="Waste Management" icon={Trash2} stats={waste} colorClass="bg-violet-500" />
                <DeptCard title="Public Safety" icon={Zap} stats={safety} colorClass="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* 2. Analytics Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Report Distribution
                        </h3>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            Water issues up 12% this week
                        </span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Task Table (Compact) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">Active Task Force</h3>
                        <Users size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-400 font-medium text-xs uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Dept</th>
                                    <th className="px-4 py-3 text-center">Unassigned</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-700">Roads Div.</td>
                                    <td className="px-4 py-3 text-center text-slate-500">{roads.total - roads.resolved}</td>
                                    <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">OVERLOAD</span></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-700">Water Works</td>
                                    <td className="px-4 py-3 text-center text-slate-500">{water.total - water.resolved}</td>
                                    <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-1 rounded-full">CLEAR</span></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-700">Sanitation</td>
                                    <td className="px-4 py-3 text-center text-slate-500">{waste.total - waste.resolved}</td>
                                    <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-1 rounded-full">CLEAR</span></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-700">Power Corp</td>
                                    <td className="px-4 py-3 text-center text-slate-500">{safety.total - safety.resolved}</td>
                                    <td className="px-4 py-3 text-right"><span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-1 rounded-full">BUSY</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDashboard;
