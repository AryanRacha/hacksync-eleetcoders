import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, FileText, Calendar, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Simulate fetching data
        setIsLoading(true);
        setTimeout(() => {
            const mockData = Array(10).fill(null).map((_, i) => ({
                id: i + 1,
                title: [
                    "Road Construction Delay", "Garbage Dump Overflow", "Street Light Malfunction",
                    "Water Pipe Leakage", "Illegal Encroachment", "Public Park Maintenance",
                    "School Building Dilapidation", "Hospital Staff Shortage", "Pothole on Highway", "Drainage Blockage"
                ][i % 10],
                type: ['Infrastructure', 'Sanitation', 'Electricity', 'Water', 'Legal'][i % 5],
                location: "Sector " + (i + 4),
                status: ['Pending', 'Verified', 'In Progress', 'Resolved', 'Rejected'][i % 5],
                riskLevel: ['High', 'Medium', 'Low'][i % 3],
                date: `2023-10-${25 - i}`
            }));
            setReports(mockData);
            setIsLoading(false);
        }, 1000);
    }, []);

    const StatusBadge = ({ status }) => {
        const colors = {
            'Verified': 'bg-blue-100 text-blue-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-purple-100 text-purple-800',
            'Resolved': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const RiskBadge = ({ level }) => {
        const icons = {
            High: ShieldAlert,
            Medium: AlertTriangle,
            Low: CheckCircle2
        };
        const Icon = icons[level] || CheckCircle2;
        const colors = {
            High: 'text-red-600 bg-red-50 border-red-100',
            Medium: 'text-orange-600 bg-orange-50 border-orange-100',
            Low: 'text-green-600 bg-green-50 border-green-100'
        };

        return (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-semibold ${colors[level]}`}>
                <Icon size={14} />
                {level}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-xl font-bold text-slate-800">All Reports</h1>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by ID, title or location..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Report Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4">Risk Assessment</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-800 text-sm">{report.title}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">ID: #RPT-2023-{report.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{report.type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Calendar size={14} />
                                                    {report.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <RiskBadge level={report.riskLevel} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={report.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/audit/RPT-2023-${report.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    View Audit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                            <span className="text-sm text-slate-500">Showing 1 to 10 of 42 results</span>
                            <div className="flex gap-2">
                                <button className="p-2 border border-slate-300 rounded hover:bg-white disabled:opacity-50 text-slate-600">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="p-2 border border-slate-300 rounded hover:bg-white text-slate-600">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
