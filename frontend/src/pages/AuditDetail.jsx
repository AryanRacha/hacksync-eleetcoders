import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Map as MapIcon, FileText, Mail, Search, Bell, Plus,
    ShieldAlert, CheckCircle2, AlertTriangle, FileCheck, ArrowLeft,
    Terminal, Database, ScanLine, Gavel, FileSignature, ThumbsUp, Phone
} from 'lucide-react';

const AuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [auditData, setAuditData] = useState(null);

    useEffect(() => {
        // Mock API Fetch based on ID
        const fetchAuditData = () => {
            setIsLoading(true);
            // Simulate network delay and AI processing
            setTimeout(() => {
                setAuditData({
                    id: id || "RPT-2025-001",
                    date: "2023-10-25",
                    riskLevel: "High",
                    userEvidence: {
                        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
                        description: "The road is completely washed away after one rain. There is no tar left, only gravel.",
                        coordinates: "18.5204° N, 73.8567° E",
                        timestamp: "10:42 AM"
                    },
                    officialRecord: {
                        projectName: "Muncipal Road Resurfacing - Zone 4",
                        budget: "₹1,20,00,000",
                        contractor: "Vardhan Infratech Pvt Ltd.",
                        officialStatus: "Completed & Verified",
                        completionDate: "Dec 2025",
                        authority: "Public Works Department"
                    },
                    aiAnalysis: {
                        steps: [
                            { stage: "Data Retrieval", status: "Success", details: "Fetched Project GOV-123 from Central Database." },
                            { stage: "Visual Validation", status: "Warning", details: "Detected 'major pothole' (92%) and 'loose gravel' (88%). No bitumen layer found." },
                            { stage: "Cross-Check", status: "Conflict", details: "Official status is 'Completed' but visual evidence suggests 'Work Not Started' or 'Failed'." },
                        ],
                        verdict: "High Probability of Financial Discrepancy (98%)"
                    }
                });
                setIsLoading(false);
            }, 2000);
        };

        fetchAuditData();
    }, [id]);

    const RiskBadge = ({ level }) => {
        const colors = {
            High: "bg-red-50 text-red-700 border-red-200",
            Medium: "bg-orange-50 text-orange-700 border-orange-200",
            Low: "bg-green-50 text-green-700 border-green-200"
        };
        const Icons = {
            High: ShieldAlert,
            Medium: AlertTriangle,
            Low: CheckCircle2
        };
        const Icon = Icons[level] || AlertTriangle;

        return (
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${colors[level] || colors.Medium}`}>
                <Icon size={18} />
                <span className="font-bold uppercase tracking-wide text-sm">{level} Risk Verdict</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-50 flex-col gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ScanLine className="text-blue-600 animate-pulse" size={24} />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-slate-700 animate-pulse">Running Autonomous Audit...</h2>
                <p className="text-slate-500">Cross-referencing satellite data with official records.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-800">Audit Details</h1>
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

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Summary Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm mb-1">
                                <span className="font-mono">ID: {auditData.id}</span>
                                <span>•</span>
                                <span>{auditData.date}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Infrastructure Discrepancy Report</h1>
                        </div>
                        <RiskBadge level={auditData.riskLevel} />
                    </div>

                    {/* Comparison Wall */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Citizen Evidence */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                                    <FileCheck size={18} />
                                </div>
                                <h3 className="font-semibold text-slate-800">Citizen Evidence</h3>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                    <img src={auditData.userEvidence.image} alt="Evidence" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <div className="text-white text-xs font-mono">
                                            <p className="flex items-center gap-1"><MapIcon size={12} /> {auditData.userEvidence.coordinates}</p>
                                            <p>{auditData.userEvidence.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">User Description</label>
                                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        "{auditData.userEvidence.description}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Official Record */}
                        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col relative">
                            {/* Watermark */}
                            <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" className="w-64" alt="Seal" />
                            </div>

                            <div className="p-4 border-b border-blue-50 bg-blue-50/50 flex items-center gap-2">
                                <div className="p-1.5 bg-slate-800 text-white rounded-md">
                                    <Database size={18} />
                                </div>
                                <h3 className="font-semibold text-slate-900">Official Government Record</h3>
                            </div>
                            <div className="p-8 space-y-6 relative z-0 flex-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
                                    <p className="text-lg font-bold text-slate-800">{auditData.officialRecord.projectName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Budget</label>
                                        <p className="text-xl font-mono font-semibold text-slate-800">{auditData.officialRecord.budget}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authority</label>
                                        <p className="font-medium text-slate-700">{auditData.officialRecord.authority}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internal Status</label>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                                        <CheckCircle2 size={14} />
                                        {auditData.officialRecord.officialStatus}
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500">
                                        Last Updated: {auditData.officialRecord.completionDate}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100/50">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Contractor</label>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                        <span className="font-medium text-slate-700">{auditData.officialRecord.contractor}</span>
                                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Lic: #C-9822</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Reasoning Engine */}
                    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
                        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <Terminal className="text-green-400" />
                                <h3 className="font-mono text-green-400 font-bold tracking-wider">AI AGENT ANALYSIS_LOG</h3>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <div className="p-6 font-mono text-sm space-y-4">
                            {auditData.aiAnalysis.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <span className="text-slate-500 shrink-0">0{idx + 1}</span>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400 font-bold">[{step.stage}]</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${step.status === 'Success' ? 'bg-green-900/30 text-green-400' :
                                                    step.status === 'Conflict' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                                                }`}>
                                                {step.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 ml-2 border-l-2 border-slate-700 pl-3 group-hover:border-slate-500 transition-colors">
                                            {step.details}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <div className="flex items-center gap-3 text-red-400 animate-pulse">
                                    <Gavel size={20} />
                                    <span className="font-bold text-lg">FINAL VERDICT: {auditData.aiAnalysis.verdict}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 pb-12">
                        <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <Phone size={18} />
                            Contact Authority
                        </button>
                        <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                            <ThumbsUp size={18} />
                            Upvote for Visibility
                        </button>
                        <button className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                            <FileSignature size={18} />
                            Generate RTI Application
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuditDetail;
