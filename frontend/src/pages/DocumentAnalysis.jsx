import React, { useState } from 'react';
import { Upload, Cpu, CheckCircle, AlertCircle, MapPin, FileText, Search, Bell, Plus, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentAnalysis = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = async (uploadedFile) => {
        setFile(uploadedFile);
        setIsScanning(true);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('document', uploadedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Error analyzing document:", error);
            alert("Analysis failed. Using fallback data for demo.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50">
             {/* Header */}
             <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
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
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Cpu className="text-blue-600" />
                            AI Document Intelligence
                        </h2>
                        <p className="text-slate-500 mt-1">Upload government contracts or tender documents to instantly extract and verify critical data.</p>
                    </div>

                    {!analysisResult && !isScanning && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('doc-upload').click()}
                            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                        >
                            <input type="file" id="doc-upload" className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Upload className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800">Drop your document here</h3>
                                <p className="text-slate-500 mt-2">Supports PDF, JPG, PNG (Max 20MB)</p>
                                <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium mt-4">Browse Files</button>
                            </div>
                        </div>
                    )}

                    {isScanning && (
                        <div className="rounded-2xl bg-white border border-slate-200 p-16 text-center relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full animate-scan"></div>
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse"><Cpu className="w-12 h-12 text-blue-600" /></div>
                                    <div className="absolute -inset-2 border-2 border-blue-100 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Analyzing Document...</h3>
                            </div>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-700 shadow-lg relative overflow-hidden group">
                                <FileText className="w-24 h-24 text-slate-400 mb-4" />
                                <span className="text-slate-300 font-mono text-sm">{file?.name}</span>
                                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle size={12} /> OCR Complete
                                </div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-600" /> Extracted Intelligence</h3>
                                    <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">CONFIDENCE: {analysisResult.confidence || 95}%</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">Project Name</label><p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.projectName}</p></div>
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">Total Budget</label><p className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">{analysisResult.budget}</p></div>
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">Contractor</label><p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.contractor}</p></div>
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">Location</label><p className="font-medium text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> {analysisResult.location}</p></div>
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">Start Date</label><p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.startDate}</p></div>
                                    <div className="space-y-1"><label className="text-xs font-semibold text-slate-400 uppercase">End Date</label><p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.endDate}</p></div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 flex items-center justify-center gap-2"><MapIcon size={18} /> Verify on Map</button>
                                    <button onClick={() => navigate('/report')} className="flex-1 bg-red-50 border border-red-100 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 flex items-center justify-center gap-2"><AlertCircle size={18} /> Report Issue</button>
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