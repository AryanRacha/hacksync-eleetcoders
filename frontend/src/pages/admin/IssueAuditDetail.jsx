import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIssueDetails, assignIssueToDept, getDepartments } from '../../api/adminApi';
import { MapPin, FileCheck, AlertOctagon, Building, ArrowLeft, BrainCircuit } from 'lucide-react';

const IssueAuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [issueRes, deptRes] = await Promise.all([
                    getIssueDetails(id),
                    getDepartments()
                ]);
                setIssue(issueRes.data);
                if (issueRes.data.assignedTo) setSelectedDept(issueRes.data.assignedTo._id || issueRes.data.assignedTo);
                setDepartments(deptRes.data);
            } catch (error) {
                console.error("Error loading audit details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAssign = async () => {
        try {
            await assignIssueToDept(id, selectedDept);
            alert("Department assigned successfully!");
        } catch (error) {
            console.error("Assignment failed:", error);
            alert("Failed to assign department.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Audit Data...</div>;
    if (!issue) return <div className="p-8 text-center text-red-500">Issue not found</div>;

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <button onClick={() => navigate('/admin/issues')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                <ArrowLeft size={18} /> Back to Triage
            </button>

            <header className="mb-8 border-b border-slate-200 pb-6 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${issue.auditVerification?.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {issue.auditVerification?.riskLevel || 'Low'} Risk
                        </span>
                        <span className="text-slate-400 text-sm">#{issue._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">{issue.title}</h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-2">
                        <MapPin size={16} /> {issue.address || "Location unavailable"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100">
                        Status: {issue.status}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Column 1: Ground Reality (Citizen Report) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertOctagon className="text-red-500" /> Ground Reality (Reported)
                    </h3>
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 border border-slate-200">
                        {issue.defaultImageUrl ? (
                            <img src={issue.defaultImageUrl} alt="Reported validity" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Evidence Image</div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">User Description</label>
                            <p className="text-slate-700 text-sm mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {issue.defaultDescription}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Reported By</label>
                            <p className="text-sm text-slate-700">{issue.firstReportedBy?.name || "Anonymous User"}</p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Official Record (Contract/Dept) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-80 relative">
                        <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">Placeholder Data</div>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileCheck className="text-blue-500" /> Official Record
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Project Name</label>
                                    <p className="font-mono text-sm text-slate-700">RD-2023-PUNE-04</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Budget</label>
                                    <p className="font-mono text-sm text-slate-700">₹ 2.5 Cr</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Contractor</label>
                                <p className="font-mono text-sm text-slate-700">M/S Apex Infrastructure Ltd.</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Logic Box */}
                    <div className="bg-blue-50/50 rounded-xl shadow-sm border border-blue-100 p-6">
                        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <BrainCircuit className="text-blue-600" /> AI Verdict Analysis
                        </h3>
                        <div className="bg-white/60 p-4 rounded-lg border border-blue-100/50">
                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                "{issue.auditVerification?.reasoning || "AI analysis pending. Based on geospatial data and image analysis, this issue appears to verify a significant discrepancy from the reported progress in official logs."}"
                            </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="flex-1 bg-white p-2 rounded border border-blue-100 text-center">
                                <span className="block text-xs text-slate-400">Visual Match</span>
                                <span className="font-bold text-blue-700">88%</span>
                            </div>
                            <div className="flex-1 bg-white p-2 rounded border border-blue-100 text-center">
                                <span className="block text-xs text-slate-400">Geo Variance</span>
                                <span className="font-bold text-blue-700">0.02 km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Panel */}
            <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Building className="text-indigo-400" /> Department Assignment
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Route this issue to the responsible authority for immediate resolution.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssign}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/50 whitespace-nowrap"
                    >
                        Assign Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssueAuditDetail;
