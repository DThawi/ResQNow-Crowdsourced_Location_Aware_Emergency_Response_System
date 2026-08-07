import { useEffect, useState } from "react";
import * as Location from "expo-location";

let locationPermissionPromise;

const ensureLocationPermission = () => {
  if (!locationPermissionPromise) {
    locationPermissionPromise = Location.getForegroundPermissionsAsync().then(
      async ({ status }) =>
        status === "granted"
          ? "granted"
          : (await Location.requestForegroundPermissionsAsync()).status
    );
  }
  return locationPermissionPromise;
};

export const formatDateTime = (value, fallback = "Date unavailable") => {
  if (!value) return fallback;

  const rawValue = value?.$date ?? value;
  const numericValue =
    typeof rawValue === "number"
      ? rawValue
      : typeof rawValue === "string" && /^\d+$/.test(rawValue.trim())
        ? Number(rawValue)
        : null;
  const date = new Date(
    numericValue === null
      ? rawValue
      : numericValue < 100000000000
        ? numericValue * 1000
        : numericValue
  );
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleString("en-LK", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h12",
  });
};

const getCoordinates = (location) => {
  const coordinates = location?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const [longitude, latitude] = coordinates.map(Number);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
};

export const useReadableAddress = (location) => {
  const [address, setAddress] = useState("Resolving address...");

  useEffect(() => {
    let active = true;
    const coordinates = getCoordinates(location);

    if (!coordinates) {
      setAddress("Location unavailable");
      return () => {
        active = false;
      };
    }

    const reverseGeocode = async () => {
      try {
        const permissionStatus = await ensureLocationPermission();
        if (permissionStatus !== "granted") {
          if (active) setAddress("Address unavailable");
          return;
        }

        const results = await Location.reverseGeocodeAsync(coordinates);
        const place = results?.[0];
        const readableAddress = [
          place?.name,
          place?.street,
          place?.district,
          place?.city,
          place?.region,
        ]
          .filter(Boolean)
          .join(", ");

        if (active) setAddress(readableAddress || "Address unavailable");
      } catch {
        if (active) setAddress("Address unavailable");
      }
    };

    reverseGeocode();
    return () => {
      active = false;
    };
  }, [location]);

  return address;
};
