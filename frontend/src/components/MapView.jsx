import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ reports = [] }) => {
    // Default center (India roughly) or specific city
    const position = [20.5937, 78.9629];

    return (
        <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => {
                // Handle MongoDB GeoJSON format { type: 'Point', coordinates: [lng, lat] }
                // Leaflet expects [lat, lng]
                let markerPosition = null;

                if (report.location && report.location.coordinates) {
                    const [lng, lat] = report.location.coordinates;
                    if (lat && lng) {
                        markerPosition = [lat, lng];
                    }
                } else if (Array.isArray(report.location)) {
                    // Fallback for mock data [lat, lng]
                    markerPosition = report.location;
                }

                if (!markerPosition) return null;

                return (
                    <Marker key={report._id || report.id} position={markerPosition}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{report.title}</h3>
                                <p className="text-xs text-gray-600 capitalize">{report.category}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapView;
