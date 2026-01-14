import React, { useState, useEffect } from 'react';
import { Upload, X, MapPin, Loader2, CheckCircle, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitReport = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: 'Roads',
        title: '',
        description: '',
        isAnonymous: false,
    });
    const [metadata, setMetadata] = useState({
        lat: '',
        lng: '',
        timestamp: null,
        dateString: ''
    });
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const captureMetadata = () => {
        // 1. Capture Time
        const now = new Date();
        const timestamp = now.getTime();
        const dateString = now.toLocaleString();

        // 2. Capture Location
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMetadata({
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                    timestamp: timestamp,
                    dateString: dateString
                });
                setIsLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                // Still save timestamp even if loc fails
                setMetadata(prev => ({
                    ...prev,
                    timestamp: timestamp,
                    dateString: dateString
                }));
                setIsLocating(false);
                alert('Unable to capture precise location. Timestamp recorded.');
            }
        );
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files];
            setImages(newImages);

            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

            // Auto-trigger metadata capture when the first image is selected
            if (images.length === 0) {
                captureMetadata();
            }
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviewUrls);

        if (newImages.length === 0) {
            setMetadata({ lat: '', lng: '', timestamp: null, dateString: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('category', formData.category);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('isAnonymous', formData.isAnonymous);

        // Append Metadata
        data.append('lat', metadata.lat);
        data.append('lng', metadata.lng);
        data.append('timestamp', metadata.timestamp);

        images.forEach((image) => {
            data.append('images', image);
        });

        console.log('--- FORM SUBMISSION DATA ---');
        for (let [key, value] of data.entries()) {
            // Log file names for images
            if (value instanceof File) {
                console.log(`${key}:`, value.name);
            } else {
                console.log(`${key}:`, value);
            }
        }
        console.log('----------------------------');

        try {
            // Placeholder for API call
            // await axios.post('/api/reports', data);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowSuccess(true);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

                        {/* Header */}
                        <div className="bg-slate-900 px-8 py-6 text-white">
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <AlertTriangle className="text-yellow-400" />
                                Report Infrastructure Issue
                            </h1>
                            <p className="text-slate-400 mt-2">Help us track and resolve public infrastructure discrepancies.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Visual Evidence Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-slate-700">Visual Evidence</label>

                                {images.length === 0 ? (
                                    <div
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative"
                                        onClick={() => document.getElementById('image-upload').click()}
                                    >
                                        <input
                                            type="file"
                                            id="image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                        />
                                        <div className="flex flex-col items-center gap-3 text-slate-500">
                                            <div className="p-4 bg-slate-100 rounded-full">
                                                <Upload className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                                                <p className="text-xs mt-1">Upload multiple photos if needed. First photo triggers GPS.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group aspect-square">
                                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add More Button */}
                                            <div
                                                className="border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors aspect-square"
                                                onClick={() => document.getElementById('image-upload-more').click()}
                                            >
                                                <input
                                                    type="file"
                                                    id="image-upload-more"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                />
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Upload size={24} />
                                                    <span className="text-sm font-medium">Add More</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Verified Metadata Box */}
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between animate-in fade-in duration-500">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">Metadata Verified</h4>
                                                    <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={12} />
                                                            {isLocating ? 'Locating...' : (metadata.lat ? `${metadata.lat}, ${metadata.lng}` : 'Pending Location')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {metadata.dateString || 'Pending Time'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isLocating && <Loader2 className="animate-spin text-blue-500" />}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Infrastructure Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Title of Issue</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="e.g., Deep Pothole on Main St."
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                    >
                                        <option value="Roads">Roads & Transport</option>
                                        <option value="Water">Water Supply</option>
                                        <option value="Sanitation">Sanitation & Waste</option>
                                        <option value="Public Buildings">Public Buildings</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    placeholder="Describe the issue in detail..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            {/* Submit & Privacy */}
                            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isAnonymous"
                                            checked={formData.isAnonymous}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Submit Anonymously
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Report'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccess && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h2>
                            <p className="text-slate-500 mb-8">Thank you for contributing to Project INTEGRITY. Your report has been securely logged.</p>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    navigate('/');
                                }}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmitReport;
