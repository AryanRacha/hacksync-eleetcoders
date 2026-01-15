import React, { useEffect, useState } from 'react';
import { getAllIssues } from '../../api/reportApi';
import { updateIssueStatus } from '../../api/adminApi';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, AlertCircle, Loader2, MapPin } from 'lucide-react';

const IssueManagement = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchIssues();
        const interval = setInterval(fetchIssues, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchIssues = async () => {
        try {
            // Optimistically don't set loading on poll to avoid flicker, only on mount
            const response = await getAllIssues();
            setIssues(response.data);
            if (loading) setLoading(false);
        } catch (error) {
            console.error("Error fetching issues:", error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // Optimistic update
        const originalIssues = [...issues];
        setIssues(issues.map(i => i._id === id ? { ...i, status: newStatus } : i));

        try {
            await updateIssueStatus(id, newStatus);
        } catch (error) {
            console.error("Status update failed:", error);
            setIssues(originalIssues); // Revert
            alert("Failed to update status");
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesCategory = filterCategory === 'All' || issue.category === filterCategory;
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getRiskColor = (level) => {
        switch (level) {
            case 'Critical':
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Issue Triage</h1>
                    <p className="text-slate-500">Prioritize and resolve incoming citizen reports.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-300 rounded-lg">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 focus:outline-none"
                        >
                            <option value="All">All Categories</option>
                            <option value="pothole">Pothole</option>
                            <option value="traffic">Traffic</option>
                            <option value="water supply">Water Supply</option>
                            <option value="garbage">Garbage</option>
                            <option value="streetlight">Streetlight</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200">Title</th>
                            <th className="px-6 py-4 border-b border-slate-200">Category</th>
                            <th className="px-6 py-4 border-b border-slate-200">Location</th>
                            <th className="px-6 py-4 border-b border-slate-200">Reported By</th>
                            <th className="px-6 py-4 border-b border-slate-200">AI Risk</th>
                            <th className="px-6 py-4 border-b border-slate-200">Status</th>
                            <th className="px-6 py-4 border-b border-slate-200">Assigned To</th>
                            <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="8" className="p-12 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                    <span>Loading Issues...</span>
                                </div>
                            </td></tr>
                        ) : filteredIssues.length === 0 ? (
                            <tr><td colSpan="8" className="p-8 text-center text-slate-500">No citizen reports found in the database.</td></tr>
                        ) : (
                            filteredIssues.map((issue) => (
                                <tr key={issue._id} className={`hover:bg-slate-50 transition-colors ${issue.status === 'Submitted' ? 'bg-indigo-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {issue.status === 'Submitted' && (
                                                <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded animate-pulse">New</span>
                                            )}
                                            <p className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={issue.title}>{issue.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-600 capitalize px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full font-medium">
                                            {issue.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-slate-500 max-w-[200px]">
                                            <MapPin size={14} className="flex-shrink-0" />
                                            <span className="truncate" title={issue.address || "No location"}>{issue.address || "No location"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 font-medium">
                                            {issue.firstReportedBy?.name || "Anonymous"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border flex items-center gap-1 w-fit ${getRiskColor(issue.auditVerification?.riskLevel || 'Low')}`}>
                                            <AlertCircle size={12} />
                                            {issue.auditVerification?.riskLevel || 'Low'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={issue.status}
                                            onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                                            className={`text-sm font-medium border-0 rounded-md py-1 pl-2 pr-8 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            <option value="Submitted">Submitted</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {issue.assignedTo?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/audit/${issue._id}`)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1"
                                        >
                                            View Details <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IssueManagement;
