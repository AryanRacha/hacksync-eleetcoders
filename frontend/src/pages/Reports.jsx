import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Calendar, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching real reports from DB
        setTimeout(() => {
            const mockData = Array(10).fill(null).map((_, i) => ({
                id: `RPT-2023-${i + 1}`, // Unique IDs like RPT-2023-1
                title: [
                    "Road Construction Delay", "Garbage Dump Overflow", "Street Light Malfunction",
                    "Water Pipe Leakage", "Illegal Encroachment", "Public Park Maintenance",
                    "School Building Dilapidation", "Hospital Staff Shortage", "Pothole on Highway", "Drainage Blockage"
                ][i % 10],
                type: ['Infrastructure', 'Sanitation', 'Electricity', 'Water', 'Legal'][i % 5],
                location: `Sector ${i + 4}, New Delhi`,
                status: ['Pending', 'Verified', 'In Progress', 'Resolved', 'Rejected'][i % 5],
                riskLevel: ['High', 'Medium', 'Low'][i % 3],
                date: `2023-10-${25 - i}`
            }));
            setReports(mockData);
            setIsLoading(false);
        }, 800);
    }, []);

    const RiskBadge = ({ level }) => {
        const colors = {
            High: 'text-red-700 bg-red-50 border-red-200',
            Medium: 'text-orange-700 bg-orange-50 border-orange-200',
            Low: 'text-green-700 bg-green-50 border-green-200'
        };
        const Icon = level === 'High' ? ShieldAlert : level === 'Medium' ? AlertTriangle : CheckCircle2;

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold w-fit ${colors[level]}`}>
                <Icon size={14} /> {level} Risk
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-xl font-bold text-slate-800">Citizen Reports</h1>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Search ID, title..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>
            </header>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Report Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">AI Risk Assessment</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-800 text-sm">{report.title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">ID: #{report.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{report.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={14} /> {report.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RiskBadge level={report.riskLevel} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/audit/${report.id}`)} // 👈 Navigates to specific ID
                                            className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                                        >
                                            View Audit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;