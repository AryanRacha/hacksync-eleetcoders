import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.heat';
import userIconAsset from '../assets/user_map_icon.png';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for Issue Types
const potholeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const garbageIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const waterLeakIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultIssueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getIssueIcon = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('pothole')) return potholeIcon;
    if (typeLower.includes('unsanitary') || typeLower.includes('garbage')) return garbageIcon;
    if (typeLower.includes('pipeline') || typeLower.includes('water')) return waterLeakIcon;
    return defaultIssueIcon;
};

const userPedestrianIcon = new L.Icon({
    iconUrl: userIconAsset,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [35, 35], // Adjusted size for custom icon
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
    shadowSize: [41, 41]
});

// Heatmap Layer Component
const HeatmapLayer = ({ reports }) => {
    const map = useMap();

    useEffect(() => {
        if (!reports || reports.length === 0) return;

        // Include High (1.0) and Medium (0.5) risk reports
        const points = reports
            .filter(r => r.riskLevel === 'High' || r.riskLevel === 'Medium' || r.status === 'Rejected')
            .map(r => {
                const intensity = (r.riskLevel === 'High' || r.status === 'Rejected') ? 1.0 : 0.5;
                return [...r.location, intensity];
            });

        if (points.length === 0) return;

        const heatLayer = L.heatLayer(points, {
            radius: 80, // Increased radius for better visibility
            blur: 20,
            maxZoom: 17,
            gradient: { 0.4: 'yellow', 0.6: 'orange', 0.8: 'red', 1.0: 'darkred' }
        }).addTo(map);

        // Fix for "willReadFrequently" warning
        const canvas = heatLayer._canvas;
        if (canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
        }

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [reports, map]);

    return null;
};

const createClusterCustomIcon = (cluster, className) => {
    return L.divIcon({
        html: `<div class="custom-cluster ${className}">${cluster.getChildCount()}</div>`,
        className: 'custom-marker-cluster',
        iconSize: L.point(40, 40, true),
    });
};

const LocateMeButton = ({ onLocate }) => {
    return (
        <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px', pointerEvents: 'auto' }}>
            <div className="leaflet-control">
                <button
                    onClick={onLocate}
                    className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 p-2 rounded-lg shadow-lg border border-white/20 transition-all duration-200 flex items-center justify-center group"
                    title="Center on my location"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const MapController = ({ setUserLocation, onMapMove }) => {
    const map = useMap();
    const hasAutoLocated = useRef(false);
    const lastFetchPos = useRef(null);

    // Initial fetch for a position
    const triggerFetch = useCallback((latlng) => {
        if (!onMapMove) return;

        // Only fetch if moved more than 10km from last fetch to avoid spamming
        if (!lastFetchPos.current || latlng.distanceTo(lastFetchPos.current) > 10000) {
            console.log("Geospatial Debug: Significant move detected, fetching new data...");
            lastFetchPos.current = latlng;
            onMapMove({ lat: latlng.lat, lng: latlng.lng });
        }
    }, [onMapMove]);

    useMapEvents({
        moveend: () => {
            triggerFetch(map.getCenter());
        }
    });

    useEffect(() => {
        if (!map) return;

        const onLocationFound = (e) => {
            console.log("Marker Debug: Location found at", e.latlng);
            setUserLocation([e.latlng.lat, e.latlng.lng]);
            map.setView(e.latlng, 16);
            triggerFetch(e.latlng);
        };

        const onLocationError = (e) => {
            console.warn("Marker Debug: Location error", e.message);
        };

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        if (!hasAutoLocated.current) {
            console.log("Marker Debug: Triggering initial locate...");
            hasAutoLocated.current = true;
            map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
        }

        return () => {
            map.off('locationfound', onLocationFound);
            map.off('locationerror', onLocationError);
        };
    }, [map, setUserLocation, triggerFetch]);

    const handleLocate = () => {
        console.log("Marker Debug: Manual locate clicked");
        map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    };

    return <LocateMeButton onLocate={handleLocate} />;
};

const MapView = ({ reports = [], onMapMove }) => {
    const [centerPosition, setCenterPosition] = useState([19.0760, 72.8777]); // Default Mumbai
    const [userPosition, setUserPosition] = useState(null);

    const handleUserLocationUpdate = useCallback((pos) => {
        console.log("Marker Debug: MapView updating userPosition to", pos);
        setCenterPosition(pos);
        setUserPosition(pos);
    }, []);

    // Categorization Logic
    const highDiscrepancy = reports.filter(r => r.riskLevel === 'High' || r.status === 'Rejected');
    const compliant = reports.filter(r => r.status === 'Verified' && r.riskLevel === 'Low');
    const moderate = reports.filter(r =>
        !highDiscrepancy.some(h => h.id === r.id) && !compliant.some(c => c.id === r.id)
    );

    return (
        <MapContainer center={centerPosition} zoom={11} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController setUserLocation={handleUserLocationUpdate} onMapMove={onMapMove} />

            {/* User Location Marker (Pedestrian) */}
            {userPosition && (
                <Marker position={userPosition} icon={userPedestrianIcon} zIndexOffset={1000}>
                    <Popup>
                        <div className="p-1 font-bold text-blue-600">You are here</div>
                    </Popup>
                </Marker>
            )}

            {/* Heatmap for High Risk areas */}
            <HeatmapLayer reports={reports} />

            {/* High Discrepancy Clusters (Red) */}
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={(c) => createClusterCustomIcon(c, 'cluster-high')}
            >
                {highDiscrepancy.map((report) => (
                    <Marker key={report.id} position={report.location} icon={getIssueIcon(report.type)}>
                        <Popup>
                            <div className="p-2 min-w-[200px] max-w-[250px]">
                                {report.imageUrl && (
                                    <img
                                        src={report.imageUrl}
                                        alt={report.type}
                                        className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 leading-tight">{report.type}</h3>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${report.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                                        report.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {report.riskLevel} Risk
                                    </span>
                                </div>
                                {report.description && (
                                    <p className="text-xs text-slate-600 mb-2 line-clamp-3">{report.description}</p>
                                )}
                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                                    <span>Status: <span className="font-medium text-slate-600">{report.status}</span></span>
                                    <span>{report.date}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            {/* Compliant Clusters (Green) */}
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={(c) => createClusterCustomIcon(c, 'cluster-compliant')}
            >
                {compliant.map((report) => (
                    <Marker key={report.id} position={report.location} icon={getIssueIcon(report.type)}>
                        <Popup>
                            <div className="p-2 min-w-[200px] max-w-[250px]">
                                {report.imageUrl && (
                                    <img
                                        src={report.imageUrl}
                                        alt={report.type}
                                        className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 leading-tight">{report.type}</h3>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap bg-green-100 text-green-600">
                                        Low Risk
                                    </span>
                                </div>
                                {report.description && (
                                    <p className="text-xs text-slate-600 mb-2 line-clamp-3">{report.description}</p>
                                )}
                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                                    <span>Status: <span className="font-medium text-slate-600">{report.status}</span></span>
                                    <span>{report.date}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            {/* Moderate Clusters (Yellow) */}
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={(c) => createClusterCustomIcon(c, 'cluster-moderate')}
            >
                {moderate.map((report) => (
                    <Marker key={report.id} position={report.location} icon={getIssueIcon(report.type)}>
                        <Popup>
                            <div className="p-2 min-w-[200px] max-w-[250px]">
                                {report.imageUrl && (
                                    <img
                                        src={report.imageUrl}
                                        alt={report.type}
                                        className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 leading-tight">{report.type}</h3>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap bg-yellow-100 text-yellow-600">
                                        Medium Risk
                                    </span>
                                </div>
                                {report.description && (
                                    <p className="text-xs text-slate-600 mb-2 line-clamp-3">{report.description}</p>
                                )}
                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                                    <span>Status: <span className="font-medium text-slate-600">{report.status}</span></span>
                                    <span>{report.date}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default MapView;
