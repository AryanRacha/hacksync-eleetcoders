import React, { useState, useEffect } from 'react';
import { Upload, X, MapPin, Loader2, CheckCircle, Shield, AlertTriangle, Search, Bell, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../api/reportApi';

const SubmitReport = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [timestamp, setTimestamp] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Backend allowed categories
    const categories = [
        { label: 'Pothole', value: 'pothole' },
        { label: 'Traffic', value: 'traffic' },
        { label: 'Water Supply', value: 'water supply' },
        { label: 'Garbage', value: 'garbage' },
        { label: 'Streetlight', value: 'streetlight' },
    ];

    const captureMetadata = () => {
        const now = Date.now();
        setTimestamp(now);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to fetch location. Please enable GPS.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(prev => [...prev, ...files]);

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);

            // Capture metadata if this is the first image(s) and not yet captured
            if (!timestamp) {
                captureMetadata();
            }
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Please upload at least one image as evidence.");
            return;
        }

        if (!location.lat || !location.lng) {
            alert("Location is required. Please ensure GPS is enabled and try uploading an image again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('latitude', location.lat);
            data.append('longitude', location.lng);

            images.forEach((image) => {
                data.append('images', image);
            });

            const response = await createIssue(data);

            if (response.status === 201) {
                alert("Report submitted successfully!");
                navigate('/');
            } else if (response.status === 200) {
                alert("Report added to existing issue at this location.");
                navigate('/');
            } else {
                alert("Report submitted.");
                navigate('/');
            }

        } catch (error) {
            console.error("Error submitting report:", error);
            alert(error.response?.data?.message || "Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        CM
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Submit New Report</h1>
                        <p className="text-slate-500 mt-1">Report infrastructure issues or corruption securely. Your identity is protected.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Info size={20} className="text-blue-600" />
                                    Report Details
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Report Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., Deep Pothole on Main Street"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Describe the issue in detail..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Evidence Upload */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Upload size={20} className="text-blue-600" />
                                    Evidence Upload
                                </h3>

                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700">Click to upload images</p>
                                            <p className="text-sm text-slate-400">JPG, PNG up to 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Add More Button inside grid */}
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-slate-50 transition-colors aspect-square">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center">
                                                <Plus size={24} className="text-slate-400" />
                                                <span className="text-xs text-slate-500 font-medium">Add More</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Metadata & Submit */}
                        <div className="space-y-6">
                            {/* Metadata Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Metadata Validation</h3>

                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg flex items-start gap-3 border ${timestamp ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className={`mt-0.5 ${timestamp ? 'text-green-600' : 'text-slate-400'}`}>
                                            <CheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">Date & Time Stamp</p>
                                            <p className="text-xs text-slate-500">{timestamp ? new Date(timestamp).toLocaleString() : 'Pending upload...'}</p>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg flex items-start gap-3 border ${location.lat ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className={`mt-0.5 ${location.lat ? 'text-green-600' : 'text-slate-400'}`}>
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">GPS Geotagging</p>
                                            <p className="text-xs text-slate-500">
                                                {location.lat
                                                    ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                                    : 'Pending upload...'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
                                        <Shield size={18} className="text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Anti-Tamper Protocol</p>
                                            <p className="text-xs text-blue-600/80">
                                                Photos are hashed and signed upon upload to ensure evidence integrity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-start gap-3 mb-6">
                                    <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        By submitting this report, you attest that the information provided is true to the best of your knowledge. False reporting may lead to account suspension.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Report"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
