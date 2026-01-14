import React, { useState } from 'react';
import { LayoutDashboard, Map as MapIcon, FileText, FileSearch, Bell, Plus, Upload, Cpu, CheckCircle, AlertCircle, MapPin, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DocumentAnalysis = () => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf')) {
            processFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = async (uploadedFile) => {
        setFile(uploadedFile);
        setIsScanning(true);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('document', uploadedFile);

        try {
            // Call the backend
            const response = await axios.post('http://localhost:5000/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update state with real data from Gemini
            setAnalysisResult({
                projectName: response.data.projectName || "Unknown Project",
                budget: response.data.budget || "₹0",
                contractor: response.data.contractor || "Not Specified",
                startDate: response.data.startDate || "N/A",
                endDate: response.data.endDate || "N/A",
                location: response.data.location || "Unknown Location",
                confidence: response.data.confidence || 85
            });

        } catch (error) {
            console.error("Error analyzing document:", error);
            alert("Failed to analyze the document. Check console for details.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleReportInconsistency = () => {
        navigate('/report');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-blue-400">INTEGRITY</h1>
                    <p className="text-xs text-slate-400 mt-1">Public Oversight Platform</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Overview</span>
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <MapIcon size={20} />
                        <span className="font-medium">Map View</span>
                    </Link>
                    <Link to="/report" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <FileText size={20} />
                        <span className="font-medium">Reports</span>
                    </Link>
                    <Link to="/analysis" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/20">
                        <FileSearch size={20} />
                        <span className="font-medium">Doc Intelligence</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                        <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-slate-400">Citizen Monitor</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search documents, contracts, or entities..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button
                            onClick={() => navigate('/report')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Report
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

                        {/* Upload Section */}
                        {!analysisResult && !isScanning && (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('doc-upload').click()}
                                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${isDragging
                                    ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    id="doc-upload"
                                    className="hidden"
                                    accept=".pdf,image/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Upload className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-800">Drop your document here</h3>
                                        <p className="text-slate-500 mt-2">Supports PDF, JPG, PNG (Max 20MB)</p>
                                    </div>
                                    <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 mt-2">
                                        Browse Files
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Scanning State */}
                        {isScanning && (
                            <div className="rounded-2xl bg-white border border-slate-200 p-16 text-center shadow-sm relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full animate-scan"></div>
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                                            <Cpu className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <div className="absolute -inset-2 border-2 border-blue-100 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Analyzing Document Structure...</h3>
                                        <p className="text-slate-500 mt-1">Extracting entities, dates, and financial data.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results View */}
                        {analysisResult && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Left: Document Preview */}
                                <div className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-700 shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                                    <FileText className="w-24 h-24 text-slate-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-slate-300 font-mono text-sm">{file?.name}</span>
                                    <span className="text-xs text-slate-500 mt-1">{(file?.size / 1024 / 1024).toFixed(2)} MB • Processed</span>
                                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                                        <CheckCircle size={12} />
                                        OCR Complete
                                    </div>
                                </div>

                                {/* Right: Data Extraction Card */}
                                <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Cpu className="w-5 h-5 text-blue-600" />
                                            Extracted Intelligence
                                        </h3>
                                        <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                            CONFIDENCE: {analysisResult.confidence}%
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</label>
                                            <p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.projectName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Budget</label>
                                            <p className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">{analysisResult.budget}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contractor</label>
                                            <p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.contractor}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Location</label>
                                            <p className="font-medium text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1">
                                                <MapPin size={14} className="text-slate-400" />
                                                {analysisResult.location}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</label>
                                            <p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.startDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date</label>
                                            <p className="font-medium text-slate-800 border-b border-slate-100 pb-2">{analysisResult.endDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                            <MapIcon size={18} />
                                            Verify on Map
                                        </button>
                                        <button
                                            onClick={handleReportInconsistency}
                                            className="flex-1 bg-red-50 border border-red-100 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <AlertCircle size={18} />
                                            Report Issue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default DocumentAnalysis;