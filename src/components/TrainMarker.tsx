import { Marker, Popup } from "react-leaflet";
import type { TrainMarkerProps } from "../types/types";
import { CircleIcon } from "./CircleIcon";

const getRouteColor = (routeId?: string): string => {
  if (!routeId) return "#666666";

  if (routeId.includes("ETS")) return "#734b47ff"; // Red for ETS
  if (routeId.includes("SH")) return "#9b59b6"; // Purple for Shuttle
  if (routeId.includes("100")) return "#3498db"; // Blue for Butterworth-Ipoh/Padang Besar
  return "#27ae60"; // Green for Komuter services
};

// Create a custom train icon with rotation

export const TrainMarker = ({ vehicle }: TrainMarkerProps) => {
  const color = getRouteColor(vehicle.routeId);
  const icon = CircleIcon(color);

  // Convert speed from m/s to km/h
  // The train speed seems way too fast to be in m/s originally. Reverted to km/h
  // const speedKmh = vehicle.speed ? Math.round(vehicle.speed * 3.6) : 0;
  const speedKmh = vehicle.speed;

  return (
    <Marker position={[vehicle.latitude, vehicle.longitude]} icon={icon}>
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="m-0 mb-2.5 text-base font-bold">
            {vehicle.label || "Train"}
          </h3>
          <div className="text-sm leading-relaxed">
            <div>
              <strong>Route:</strong> {vehicle.routeName || "Unknown"}
            </div>
            <div>
              <strong>Next Stop:</strong> {vehicle.nextStop || "-"}
            </div>
            <div>
              <strong>Speed:</strong> {speedKmh} km/h
            </div>
            <div>
              <p>
                <strong>Updated:</strong> {vehicle.timestamp}
              </p>
            </div>
            {vehicle.tripId && (
              <div className="text-xs text-gray-600 mt-1">
                Trip ID: {vehicle.tripId}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
