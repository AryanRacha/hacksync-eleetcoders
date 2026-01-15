// 1. Reverse Geocoding: Convert lat/lng to address (and pincode)
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const res = await fetch(url, {
      headers: {
        // IMPORTANT: OSM requires a custom User-Agent.
        // Replace 'CivicReportApp/1.0' with your actual app name and version.
        "User-Agent": "reporting-app/1.0 (aryanracha@gmail.com)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to reverse geocode: ${res.statusText}`);
    }

    const data = await res.json();

    // Return the full display name as the primary address
    return data.display_name || "Address not found";
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    // Fallback or re-throw the error so the controller can handle it
    throw new Error("Could not determine address from coordinates.");
  }
}

// 2. GeoJSON Conversion: Convert lat/lng to GeoJSON Point
export function toGeoJSON(lat, lng) {
  return {
    type: "Point",
    coordinates: [lng, lat],
  };
}

// 3. Distance Calculation: Calculate distance between two points (Haversine formula)
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 4. Clustering and Heatmaps: Group points by proximity (template)
export function clusterLocations(locations, radiusMeters = 500) {
  const clusters = [];
  const visited = new Array(locations.length).fill(false);
  for (let i = 0; i < locations.length; i++) {
    if (visited[i]) continue;
    const cluster = [locations[i]];
    visited[i] = true;
    for (let j = i + 1; j < locations.length; j++) {
      if (
        !visited[j] &&
        calculateDistance(
          locations[i].lat,
          locations[i].lng,
          locations[j].lat,
          locations[j].lng
        ) *
          1000 <=
          radiusMeters
      ) {
        cluster.push(locations[j]);
        visited[j] = true;
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

// 5. Filtering and Searching: Filter locations within a radius
export function filterByRadius(centerLat, centerLng, locations, radiusKm) {
  return locations.filter(
    (loc) =>
      calculateDistance(centerLat, centerLng, loc.lat, loc.lng) <= radiusKm
  );
}

// 6. Routing and Directions: Get route between two points (template)
export async function getRoute(startLat, startLng, endLat, endLng) {
  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to get route");
  const data = await res.json();
  return data.routes[0];
}

// 7. Analytics and Reporting: Analyze spatial distribution (template)
export function analyzeSpatialDistribution(locations) {
  const density = {};
  locations.forEach((loc) => {
    const key = `${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;
    density[key] = (density[key] || 0) + 1;
  });
  return density;
}

// 8. Mapping and Visualization: Prepare data for map display (template)
export function prepareMapData(locations) {
  return {
    type: "FeatureCollection",
    features: locations.map((loc) => ({
      type: "Feature",
      geometry: toGeoJSON(loc.lat, loc.lng),
      properties: { ...loc },
    })),
  };
}

// Find all issues within a 3 km radius of the user's location
export const findIssuesNearUser = async (lat, lng) => {
  // Assumes you have an Issue model with a 'location' field (GeoJSON Point)
  const radiusMeters = 3000; // 3 km
  const issues = await Issue.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radiusMeters,
      },
    },
  });
  return issues;
};
