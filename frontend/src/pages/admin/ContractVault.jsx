import React, { useState, useEffect } from 'react';
import { Upload, Cpu, CheckCircle, AlertCircle, FileText, Search, Plus } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const ContractVault = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const res = await axiosInstance.get('/contracts');
            setContracts(res.data);
        } catch (error) {
            console.error("Failed to fetch contracts", error);
        }
    };

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
            // Updated endpoint to the new admin contract upload
            const response = await axiosInstance.post('/contracts/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysisResult(response.data.record);
            fetchContracts(); // Refresh list
        } catch (error) {
            console.error("Error analyzing document:", error);
            alert("Analysis failed. Please check console.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-indigo-600" />
                    Contract Vault
                </h1>
                <p className="text-slate-500">Secure repository for official government tender documents and contracts.</p>
            </header>

            <div className="max-w-6xl mx-auto space-y-8">

                {/* Upload Section */}
                {!analysisResult && !isScanning && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('doc-upload').click()}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 bg-white ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                    >
                        <input type="file" id="doc-upload" className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Upload Official Contract</h3>
                            <p className="text-slate-500 text-sm">Drag & drop or click to browse (PDF, Images)</p>
                        </div>
                    </div>
                )}

                {/* Scanning State */}
                {isScanning && (
                    <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center relative overflow-hidden shadow-sm">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full animate-scan"></div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse"><Cpu className="w-10 h-10 text-indigo-600" /></div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">AI Extracting Metadata...</h3>
                        </div>
                    </div>
                )}

                {/* New Analysis Result */}
                {analysisResult && (
                    <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle className="text-emerald-500 w-5 h-5" />
                                    Contract Digitized Successfully
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Stored in Immutable Record Ledger</p>
                            </div>
                            <button onClick={() => { setAnalysisResult(null); setFile(null); }} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                Upload Another
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                            <div><label className="text-xs uppercase font-bold text-slate-400">Project Name</label><p className="font-semibold text-slate-800">{analysisResult.projectName}</p></div>
                            <div><label className="text-xs uppercase font-bold text-slate-400">Budget</label><p className="font-semibold text-slate-800">{analysisResult.budget}</p></div>
                            <div><label className="text-xs uppercase font-bold text-slate-400">Contractor</label><p className="font-semibold text-slate-800">{analysisResult.contractor}</p></div>
                        </div>
                    </div>
                )}

                {/* Existing Contracts Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Vaulted Records</h3>
                        <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{contracts.length} Records</span>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Project Name</th>
                                <th className="px-6 py-3 font-medium">Contractor</th>
                                <th className="px-6 py-3 font-medium">Budget</th>
                                <th className="px-6 py-3 font-medium">Date Vaulted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contracts.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">No contracts vaulted yet.</td></tr>
                            ) : (
                                contracts.map(record => (
                                    <tr key={record._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-medium text-slate-800">{record.projectName}</td>
                                        <td className="px-6 py-3 text-slate-600">{record.contractor}</td>
                                        <td className="px-6 py-3 font-mono text-slate-600">{record.budget}</td>
                                        <td className="px-6 py-3 text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
            <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } } .animate-scan { animation: scan 2s linear infinite; }`}</style>
        </div>
    );
};

export default ContractVault;
