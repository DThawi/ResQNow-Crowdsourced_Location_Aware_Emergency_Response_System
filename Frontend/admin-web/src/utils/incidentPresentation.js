const addressCache = new Map();
const pendingLookups = new Map();

export const formatIncidentDateTime = (timestamp) => {
  if (!timestamp || Number.isNaN(new Date(timestamp).getTime())) {
    return "Date and time unavailable";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

export const getIncidentAddress = async (location) => {
  const [longitude, latitude] = location?.coordinates || [];
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "Location unavailable";
  }

  const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
  if (addressCache.has(cacheKey)) return addressCache.get(cacheKey);
  if (pendingLookups.has(cacheKey)) return pendingLookups.get(cacheKey);

  const lookup = fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    { headers: { Accept: "application/json", "Accept-Language": "en" } },
  )
    .then((response) => {
      if (!response.ok) throw new Error("Address lookup failed");
      return response.json();
    })
    .then((data) => data.display_name || "Address unavailable")
    .catch(() => "Address unavailable")
    .then((address) => {
      addressCache.set(cacheKey, address);
      pendingLookups.delete(cacheKey);
      return address;
    });

  pendingLookups.set(cacheKey, lookup);
  return lookup;
};
