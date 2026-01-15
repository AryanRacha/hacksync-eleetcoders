import React, { useState } from 'react';
import { Upload, Cpu, CheckCircle, FileText, Search, Bell, Plus, ShieldCheck, Calendar, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentAnalysis = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [data, setData] = useState(null);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };
    const handleFileSelect = (e) => { if(e.target.files[0]) processFile(e.target.files[0]); };

    const processFile = async (uploadedFile) => {
        setFile(uploadedFile);
        setIsScanning(true);
        setData(null);

        // Simulate AI Processing Delay
        setTimeout(() => {
            setIsScanning(false);
            // RICH DUMMY DATA (Realistic, No Money)
            setData({
                meta: { confidence: 99.2, type: "Service Level Agreement (SLA)" },
                project: {
                    name: "Sector 4 Road Resurfacing & Maintenance",
                    id: "CTR-PWD-2023-882",
                    department: "Public Works Dept.",
                    contractor: "Vardhan Infratech Pvt Ltd."
                },
                compliance: {
                    technicalSpecs: "Bitumen Grade VG-30, 40mm Layer Thickness",
                    warrantyPeriod: "3 Years Defect Liability",
                    status: "Active Contract"
                },
                timeline: {
                    start: "01 Nov 2023",
                    end: "15 May 2024",
                    milestones: [
                        { stage: "Survey", status: "Done" },
                        { stage: "Material Procurement", status: "Done" },
                        { stage: "Laying Surface", status: "Pending" }
                    ]
                },
                risks: [
                    { level: "High", text: "Penalty clause for delay is missing in Section 4.2." },
                    { level: "Medium", text: "Force Majeure definition is ambiguous." }
                ]
            });
        }, 2500);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
             {/* Header */}
             <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Search contracts..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button onClick={() => navigate('/submit')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                        <Plus className="w-4 h-4" /> Add Report
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {!data && !isScanning && (
                        <div
                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                            onClick={() => document.getElementById('doc-upload').click()}
                            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                        >
                            <input type="file" id="doc-upload" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileSelect} />
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Upload className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Upload Contract Document</h3>
                            <p className="text-slate-500 mt-2">AI extracts Technical Specs, Deadlines & Compliance Clauses.</p>
                        </div>
                    )}

                    {isScanning && (
                        <div className="rounded-2xl bg-white border border-slate-200 p-24 text-center relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full animate-scan"></div>
                            <Cpu className="w-16 h-16 text-blue-600 mx-auto animate-pulse mb-6" />
                            <h3 className="text-2xl font-bold text-slate-800">Analyzing Document Structure...</h3>
                            <p className="text-slate-500 mt-2">Cross-referencing with Department Standards</p>
                        </div>
                    )}

                    {data && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{data.project.name}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><FileText size={14}/> {data.project.id}</span>
                                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{data.project.department}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-green-600 flex items-center gap-2 justify-end"><CheckCircle size={20}/> {data.meta.confidence}% Match</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Confidence</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Col: Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Compliance Data</h3>
                                        <div className="grid grid-cols-2 gap-6 text-sm">
                                            <div><label className="text-xs text-slate-400 font-bold uppercase">Contractor</label><p className="font-medium text-lg">{data.project.contractor}</p></div>
                                            <div><label className="text-xs text-slate-400 font-bold uppercase">Tech Specs</label><p className="font-medium">{data.compliance.technicalSpecs}</p></div>
                                            <div><label className="text-xs text-slate-400 font-bold uppercase">Warranty</label><p className="font-medium">{data.compliance.warrantyPeriod}</p></div>
                                            <div><label className="text-xs text-slate-400 font-bold uppercase">Contract Status</label><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{data.compliance.status}</span></div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2"><Calendar size={18}/> Execution Timeline</h3>
                                        <div className="space-y-4">
                                            {data.timeline.milestones.map((m, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <span className="font-medium text-slate-800">{m.stage}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: AI Risks */}
                                <div className="space-y-6">
                                    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                                        <h3 className="font-bold border-b border-slate-700 pb-3 mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-400"/> AI Risk Scan</h3>
                                        <div className="space-y-4">
                                            {data.risks.map((risk, i) => (
                                                <div key={i} className="bg-slate-800 p-3 rounded border-l-4 border-red-500">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-red-400 uppercase flex items-center gap-1"><AlertTriangle size={12}/> {risk.level} Risk</span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-tight">{risk.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } } .animate-scan { animation: scan 2s linear infinite; }`}</style>
        </div>
    );
};

export default DocumentAnalysis;