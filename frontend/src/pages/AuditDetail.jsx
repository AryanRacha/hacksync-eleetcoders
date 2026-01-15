import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Terminal, ShieldAlert, CheckCircle2,
    AlertTriangle, Eye, Phone, FileSignature, Map as MapIcon
} from 'lucide-react';

const AuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Workflow State
    const [workflowStage, setWorkflowStage] = useState('initializing');
    const [logs, setLogs] = useState([]);
    const [auditResult, setAuditResult] = useState(null);
    const logsEndRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // --- AGENTIC WORKFLOW SIMULATION ---
    useEffect(() => {
        let isMounted = true;

        const addLog = (message, type = 'info') => {
            if (isMounted) {
                setLogs(prev => [...prev, {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                    message,
                    type
                }]);
            }
        };

        const runAgenticWorkflow = async () => {
            // STAGE 1: INITIALIZATION
            addLog("Initializing IntegrityAI Agent v2.4...", "system");
            await new Promise(r => setTimeout(r, 800));

            // STAGE 2: RETRIEVAL
            setWorkflowStage('retrieval');
            addLog(`Received Audit Request for Report ID: ${id || 'RPT-GEN-001'}`, "info");
            await new Promise(r => setTimeout(r, 1000));

            addLog("📡 Connecting to MoRTH Central Database...", "action");
            await new Promise(r => setTimeout(r, 1500));

            addLog("✔ Access Granted. Retrieving Contract #NHAI-882...", "success");
            addLog(`  > Project: Chandani Chowk Flyover Expansion`, "data");
            addLog(`  > Status: 'Completed'`, "data");

            // STAGE 3: AUDIT
            setWorkflowStage('auditing');
            await new Promise(r => setTimeout(r, 1200));

            addLog("👁️ Engaging Computer Vision Module...", "action");
            addLog("   > Analyzing Evidence vs. Specifications...", "info");
            await new Promise(r => setTimeout(r, 2000));

            addLog("⚠ DETECTION: Severe Surface Erosion (94%)", "warning");
            addLog("❌ DISCREPANCY: Official Record 'Completed' vs Visual Evidence.", "error");

            // STAGE 4: VERDICT
            setWorkflowStage('verdict');
            await new Promise(r => setTimeout(r, 1000));
            addLog("⚖️ Calculating Integrity Score...", "system");
            await new Promise(r => setTimeout(r, 1000));

            addLog("✔ FINAL VERDICT: HIGH RISK", "success");

            setAuditResult({
                riskLevel: "High",
                reasoning: "Critical discrepancy between official status and actual site condition. Evidence suggests material failure.",
                official: {
                    status: "Completed",
                    contractor: "Dilip Buildcon Ltd.",
                    budget: "₹85,50,00,000"
                },
                evidence: {
                    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
                    description: "Road surface has completely eroded. Large potholes visible despite 'Completed' status.",
                    location: "18.5204° N, 73.8567° E"
                }
            });

            await new Promise(r => setTimeout(r, 800));
            setWorkflowStage('complete');
        };

        runAgenticWorkflow();

        return () => { isMounted = false; };
    }, [id]);

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 relative">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Autonomous Audit
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">v2.4</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${workflowStage === 'complete' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                    <span className="text-xs font-medium text-slate-500 uppercase">
                        {workflowStage === 'complete' ? 'Audit Complete' : 'Agent Active'}
                    </span>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* 1. AGENT TERMINAL (Always Visible) */}
                    <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-xl border border-slate-700">
                        <div className="bg-[#1e293b] px-4 py-2 flex items-center justify-between border-b border-slate-700">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-slate-400" />
                                <span className="text-xs font-mono text-slate-300">integrity_core.exe</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        <div className="p-4 h-64 overflow-y-auto font-mono text-sm space-y-1.5">
                            {logs.map((log, index) => (
                                <div key={index} className="flex gap-3">
                                    <span className="text-slate-600 shrink-0">{log.time}</span>
                                    <span className={`${
                                        log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-emerald-400' :
                                        log.type === 'warning' ? 'text-amber-400' :
                                        log.type === 'action' ? 'text-blue-400' :
                                        log.type === 'data' ? 'text-slate-400 ml-4' :
                                        log.type === 'system' ? 'text-purple-400 font-bold' : 'text-slate-300'
                                    }`}>
                                        {log.type === 'action' && '> '}
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                    {/* 2. RESULTS DASHBOARD (Reveals when complete) */}
                    {workflowStage === 'complete' && auditResult && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            {/* Left: Verdict */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                            Verdict: <span className="text-red-600">Discrepancy Confirmed</span>
                                        </h2>
                                        <p className="text-slate-600 mt-2">{auditResult.reasoning}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-slate-900">98.2%</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Confidence</div>
                                    </div>
                                </div>

                                {/* Comparison */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                                        <Eye size={18} className="text-blue-600" />
                                        <h3 className="font-semibold text-slate-800">Evidence vs. Record</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2">
                                        <div className="p-6 border-r border-slate-100">
                                            <img src={auditResult.evidence.image} className="w-full rounded-lg mb-4 h-48 object-cover" alt="Evidence" />
                                            <span className="text-xs font-bold text-slate-400 uppercase">Citizen Evidence</span>
                                            <p className="text-sm text-slate-700 mt-1">{auditResult.evidence.description}</p>
                                        </div>
                                        <div className="p-6 flex flex-col justify-center space-y-4">
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Official Status</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <CheckCircle2 size={18} className="text-green-600" />
                                                    <span className="font-bold text-slate-800">{auditResult.official.status}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Contractor</span>
                                                <p className="font-medium text-slate-800">{auditResult.official.contractor}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Budget</span>
                                                <p className="font-mono text-lg font-semibold text-slate-700">{auditResult.official.budget}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="space-y-6">
                                <div className="bg-red-50 rounded-xl p-6 border border-red-100 text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-red-900">High Risk Detected</h3>
                                    <p className="text-sm text-red-700 mt-2 mb-6">Flagged for immediate manual review.</p>
                                    <button className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm">Escalate</button>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Actions</h3>
                                    <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-left">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileSignature size={18} /></div>
                                        <div><p className="text-sm font-medium">Draft RTI</p><p className="text-xs text-slate-500">Auto-fill data</p></div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-left">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Phone size={18} /></div>
                                        <div><p className="text-sm font-medium">Contact Contractor</p><p className="text-xs text-slate-500">Request details</p></div>
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