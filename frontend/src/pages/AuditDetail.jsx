import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Terminal, ShieldAlert, CheckCircle2,
    Eye, Map as MapIcon, Play, Loader2, FileSignature, Phone,
    Gavel, Building2, AlertTriangle, Send
} from 'lucide-react';

const AuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Management
    const [viewState, setViewState] = useState('checking'); // checking -> initial -> processing -> complete
    const [logs, setLogs] = useState([]);
    const [auditResult, setAuditResult] = useState(null);
    const [isEscalated, setIsEscalated] = useState(false); // New state for escalation status
    const logsEndRef = useRef(null);

    // 1. ON LOAD: Check if Audit exists in DB
    useEffect(() => {
        const checkAuditStatus = async () => {
            try {
                // Adjust port if your backend runs on 5000 or 3000
                const response = await axios.get(`http://localhost:5000/api/audit/${id}`);
                setAuditResult(response.data);
                // Check if already escalated (in a real app, this would come from the backend response)
                if (response.data.verdict === 'Critical' || response.data.verdict === 'High') {
                     // For demo purposes, we don't persist escalation state in this mock,
                     // but you would check response.data.isEscalated here.
                }
                setViewState('complete');
            } catch (error) {
                setViewState('initial'); // Not found -> Show Start Button
            }
        };
        checkAuditStatus();
    }, [id]);

    // 2. START AGENT: Trigger Workflow
    const handleStartAudit = async () => {
        setViewState('processing');

        const addLog = (msg, type) => {
            setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: msg, type }]);
        };

        try {
            // --- SIMULATED "THINKING" PROCESS ---
            addLog("Initializing IntegrityAI Agent v2.4...", "system");
            await new Promise(r => setTimeout(r, 800));

            addLog(`📡 Connecting to Central Dept Database for ID: ${id}...`, "action");
            await new Promise(r => setTimeout(r, 1200));
            addLog("✔ Official Record Retrieved.", "success");

            addLog("👁️ Engaging Computer Vision on Evidence...", "action");
            await new Promise(r => setTimeout(r, 1500));
            addLog("⚠ VISUAL ANALYSIS: Discrepancy Detected.", "warning");

            addLog("⚖️ Generating Final Verdict...", "system");
            await new Promise(r => setTimeout(r, 1000));

            // --- REAL BACKEND CALL ---
            const response = await axios.post(`http://localhost:5000/api/audit/${id}/analyze`);
            setAuditResult(response.data);

            addLog("✔ Audit Saved & Verified.", "success");
            await new Promise(r => setTimeout(r, 600));

            setViewState('complete');

        } catch (error) {
            console.error("Audit Error:", error);
            setViewState('initial');
            alert("Audit failed. Ensure Backend is running.");
        }
    };

    // 3. HANDLE ESCALATION
    const handleEscalate = async () => {
        if (!auditResult) return;

        // In a real app, you would make a POST request here:
        // await axios.post(`http://localhost:5000/api/audit/${id}/escalate`);

        // Simulate API call
        const confirm = window.confirm("Are you sure you want to escalate this case to the Vigilance Department?");
        if (confirm) {
            setIsEscalated(true);
            alert(`Case #${id} has been escalated to the Vigilance Department. Priority: URGENT.`);
        }
    };

    // Auto-scroll logs
    useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Autonomous Audit
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">v2.4</span>
                    </h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* STATE 1: LOADING */}
                    {viewState === 'checking' && (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                            <p className="text-slate-500 font-medium">Checking Audit History...</p>
                        </div>
                    )}

                    {/* STATE 2: INITIAL (Start Button) */}
                    {viewState === 'initial' && (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <ShieldAlert size={48} className="text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-3">Ready to Audit</h2>
                            <p className="text-slate-500 mb-8 max-w-lg text-lg">
                                This report <strong>({id})</strong> needs verification. Run the AI Agent to cross-reference citizen evidence with official government records.
                            </p>
                            <button
                                onClick={handleStartAudit}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 transition-all transform hover:scale-105 flex items-center gap-3"
                            >
                                <Play size={24} fill="currentColor" /> Start Agentic Audit
                            </button>
                        </div>
                    )}

                    {/* STATE 3: PROCESSING (Terminal) */}
                    {viewState === 'processing' && (
                        <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                            <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-3 border-b border-slate-700">
                                <Terminal size={16} className="text-slate-400" />
                                <span className="text-sm font-mono text-slate-300">integrity_core_agent.exe</span>
                                <div className="ml-auto flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="p-6 h-80 overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-200">
                                        <span className="text-slate-600 shrink-0 select-none">{log.time}</span>
                                        <span className={`${
                                            log.type === 'error' ? 'text-red-400 font-bold' :
                                            log.type === 'success' ? 'text-emerald-400' :
                                            log.type === 'warning' ? 'text-amber-400' :
                                            log.type === 'action' ? 'text-blue-400' :
                                            log.type === 'system' ? 'text-purple-400 font-bold' : 'text-slate-300'
                                        }`}>
                                            {log.type === 'action' && '> '} {log.message}
                                        </span>
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    )}

                    {/* STATE 4: COMPLETE (Results Dashboard) */}
                    {viewState === 'complete' && auditResult && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* LEFT COLUMN: Verdict & Details */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Verdict Banner */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden">
                                    {isEscalated && (
                                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 animate-in slide-in-from-top-2">
                                            <AlertTriangle size={12} fill="currentColor" /> URGENT PRIORITY
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Gavel size={24} className="text-slate-400" />
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                Verdict: <span className={auditResult.verdict === 'Critical' || auditResult.verdict === 'High' ? "text-red-600" : "text-green-600"}>
                                                    {auditResult.verdict} Risk
                                                </span>
                                            </h2>
                                        </div>
                                        <p className="text-slate-600 text-lg leading-relaxed">{auditResult.reasoning}</p>
                                    </div>
                                    <div className="text-center bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 min-w-[120px]">
                                        <div className="text-4xl font-bold text-slate-900">{auditResult.confidence}%</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Confidence</div>
                                    </div>
                                </div>

                                {/* Comparison View */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                                        <Eye size={20} className="text-blue-600" />
                                        <h3 className="font-semibold text-slate-800 text-lg">Evidence vs. Official Reality</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                                        {/* Official Record */}
                                        <div className="p-8 space-y-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Building2 size={18} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Govt Record</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-sm text-slate-500">Project Name</span>
                                                    <p className="font-medium text-slate-900">{auditResult.officialRecord.projectName}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-sm text-slate-500">Status</span>
                                                        <div className="font-bold text-green-600 flex items-center gap-2 mt-1">
                                                            <CheckCircle2 size={16}/> {auditResult.officialRecord.status}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-slate-500">Budget</span>
                                                        <p className="font-mono font-semibold text-slate-700">{auditResult.officialRecord.budget}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-slate-500">Contractor</span>
                                                    <p className="font-medium text-slate-900">{auditResult.officialRecord.contractor}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-slate-500">Department</span>
                                                    <span className="inline-block mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">
                                                        {auditResult.officialRecord.departmentName || "Public Works Dept"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Evidence */}
                                        <div className="p-8 bg-slate-50/30">
                                            <div className="flex items-center gap-2 mb-4">
                                                <MapIcon size={18} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Evidence</span>
                                            </div>

                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm border border-slate-200 group">
                                                <img
                                                    src={auditResult.evidence.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    alt="Evidence"
                                                />
                                                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-mono">
                                                    Source: Verified User
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                                    "{auditResult.evidence.description}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Actions */}
                            <div className="space-y-6">
                                {/* Risk Card */}
                                <div className={`rounded-2xl p-8 text-center border transition-all duration-500 ${
                                    isEscalated ? 'bg-red-100 border-red-200 ring-2 ring-red-400' :
                                    auditResult.verdict === 'Critical' || auditResult.verdict === 'High'
                                    ? 'bg-red-50 border-red-100'
                                    : 'bg-green-50 border-green-100'
                                }`}>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${
                                        auditResult.verdict === 'Critical' || auditResult.verdict === 'High'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-green-100 text-green-600'
                                    }`}>
                                        <ShieldAlert size={32} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${
                                        auditResult.verdict === 'Critical' || auditResult.verdict === 'High' ? 'text-red-900' : 'text-green-900'
                                    }`}>
                                        {auditResult.verdict} Risk Detected
                                    </h3>
                                    <p className={`text-sm mt-2 mb-6 ${
                                        auditResult.verdict === 'Critical' || auditResult.verdict === 'High' ? 'text-red-700' : 'text-green-700'
                                    }`}>
                                        {auditResult.verdict === 'Critical' || auditResult.verdict === 'High'
                                            ? "Flagged for immediate manual review due to high discrepancy probability."
                                            : "No significant discrepancies found. Verification successful."}
                                    </p>

                                    {(auditResult.verdict === 'Critical' || auditResult.verdict === 'High') ? (
                                        <button
                                            onClick={handleEscalate}
                                            disabled={isEscalated}
                                            className={`w-full py-3 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                                                isEscalated
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700 hover:shadow-md'
                                            }`}
                                        >
                                            {isEscalated ? (
                                                <>
                                                    <CheckCircle2 size={18} /> Escalated to Vigilance
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} /> Escalate Case
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-sm transition-colors">
                                            Mark as Resolved
                                        </button>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Actions</h3>

                                    <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200 text-left group">
                                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors"><FileSignature size={18} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Draft RTI Application</p>
                                            <p className="text-xs text-slate-500">Auto-fill with audit data</p>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200 text-left group">
                                        <div className="p-2.5 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors"><Phone size={18} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Contact Contractor</p>
                                            <p className="text-xs text-slate-500">Request formal details</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditDetail;