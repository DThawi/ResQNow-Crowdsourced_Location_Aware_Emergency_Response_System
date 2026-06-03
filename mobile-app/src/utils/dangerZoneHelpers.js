const SEVERITY_FROM_COUNT = (count) => {
  if (count >= 5) return "CRITICAL";
  if (count >= 3) return "HIGH";
  if (count >= 2) return "MEDIUM";
  return "LOW";
};

export function parseIncidentCoordinates(center) {
  const raw = center?.location?.coordinates;
  if (Array.isArray(raw) && raw.length >= 2) {
    const lng = Number(raw[0]);
    const lat = Number(raw[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { coordinates: [lng, lat], latitude: lat, longitude: lng };
    }
  }
  if (typeof raw === "string") {
    const parts = raw.trim().split(/[\s,]+/).map(Number);
    if (parts.length >= 2 && parts.every(Number.isFinite)) {
      return {
        coordinates: [parts[0], parts[1]],
        latitude: parts[1],
        longitude: parts[0],
      };
    }
  }
  if (center?.location?.lat != null && center?.location?.lng != null) {
    return {
      coordinates: [center.location.lng, center.location.lat],
      latitude: center.location.lat,
      longitude: center.location.lng,
    };
  }
  return { coordinates: null, latitude: null, longitude: null };
}

export function computeDensityPerKm2(incidentCount, radiusMeters) {
  const km = Math.max((radiusMeters || 500) / 1000, 0.15);
  const area = Math.PI * km * km;
  return (incidentCount / area).toFixed(1);
}

export function computeTrend(incidents = []) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const recent = incidents.filter(
    (i) => i.timestamp && now - new Date(i.timestamp).getTime() < dayMs
  ).length;
  const older = incidents.length - recent;

  if (recent > older && recent >= 2) {
    return {
      trendLabel: "Increasing Trend",
      trendIcon: "trending-up",
      trendColor: "#D62828",
    };
  }
  return {
    trendLabel: "Stable Trend",
    trendIcon: "remove",
    trendColor: "#64748b",
  };
}

export function formatClusterToZone(cluster) {
  const incidents = cluster.incidents || [];
  if (incidents.length === 0) return null;

  const center = incidents[0];
  const { coordinates, latitude, longitude } = parseIncidentCoordinates(center);
  const count = cluster.count ?? incidents.length;
  const radiusMeters = Math.max(count * 100, 200);
  const severity = SEVERITY_FROM_COUNT(count);
  const trend = computeTrend(incidents);

  return {
    _id: cluster._id,
    name: center.type ? `${center.type} Zone` : "Danger Zone",
    type: center.type,
    severity,
    description:
      center.description || "Multiple incidents reported in this area.",
    radius: `${radiusMeters} m`,
    affected: `~${count * 50}`,
    date: center.timestamp
      ? new Date(center.timestamp).toLocaleDateString()
      : "N/A",
    coordinates,
    latitude,
    longitude,
    status: count >= 3 ? "Evacuate" : "Monitor",
    incidents,
    incidentCount: count,
    density: computeDensityPerKm2(count, radiusMeters),
    reportedBy: center.reportedBy || "Unknown",
    timestamp: center.timestamp,
    updated_at: incidents.reduce((latest, inc) => {
      const t = inc.timestamp ? new Date(inc.timestamp).getTime() : 0;
      return t > latest ? t : latest;
    }, 0)
      ? new Date(
          Math.max(
            ...incidents.map((i) =>
              i.timestamp ? new Date(i.timestamp).getTime() : 0
            )
          )
        ).toISOString()
      : center.timestamp,
    ...trend,
  };
}

export function buildHistoricalInsights(zones) {
  if (!zones.length) {
    return {
      avgDensity: "0.0",
      totalMonitored: 0,
      highPriority: 0,
    };
  }

  const densities = zones
    .map((z) => parseFloat(z.density))
    .filter((n) => Number.isFinite(n));

  const avgDensity =
    densities.length > 0
      ? (densities.reduce((a, b) => a + b, 0) / densities.length).toFixed(1)
      : "0.0";

  const highPriority = zones.filter(
    (z) => z.severity === "CRITICAL" || z.severity === "HIGH"
  ).length;

  return {
    avgDensity,
    totalMonitored: zones.length,
    highPriority,
  };
}