import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Calendar, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getUserReports } from '../api/reportApi';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Fetch real reports from DB
        const fetchReports = async () => {
            try {
                // Using getUserReports or axiosInstance directly
                // Assuming we want ALL public reports for now or just user reports? 
                // The prompt says "fetch reports from my db". Usually /reports/user or all issues.
                // Given the context of "Community Reports", let's fetch issues.
                const response = await axiosInstance.get('/issues'); // Fetching all public issues

                const dbReports = response.data.map(issue => ({
                    id: issue._id,
                    title: issue.title,
                    type: issue.category,
                    location: issue.address || 'Unknown Location',
                    status: issue.status,
                    riskLevel: issue.auditVerification?.riskLevel || 'Low',
                    date: new Date(issue.createdAt).toISOString().split('T')[0]
                }));
                setReports(dbReports);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const RiskBadge = ({ level }) => {
        const colors = {
            High: 'text-red-700 bg-red-50 border-red-200',
            Critical: 'text-red-800 bg-red-100 border-red-300',
            Medium: 'text-orange-700 bg-orange-50 border-orange-200',
            Low: 'text-green-700 bg-green-50 border-green-200'
        };
        const Icon = (level === 'High' || level === 'Critical') ? ShieldAlert : level === 'Medium' ? AlertTriangle : CheckCircle2;
        const colorClass = colors[level] || colors.Low;

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold w-fit ${colorClass}`}>
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
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading reports...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No reports found.</td></tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-800 text-sm line-clamp-1">{report.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">ID: #{report.id.slice(-6)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded capitalize">{report.type}</span>
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
                                                onClick={() => navigate(`/audit/${report.id}`)}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                                            >
                                                View Audit
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
    );
};

export default Reports;