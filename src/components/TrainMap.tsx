import { MapContainer, TileLayer } from "react-leaflet";
import { TrainMarker } from "./TrainMarker";
import "leaflet/dist/leaflet.css";
import type { EnrichedVehicle } from "../types/types";

interface TrainMapProps {
  vehicles: EnrichedVehicle[];
}

export const TrainMap = ({ vehicles }: TrainMapProps) => {
  // Center on Malaysia (approximately Kuala Lumpur area)
  const center: [number, number] = [4.2105, 101.9758];
  const zoom = 8;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.map((vehicle) => (
        <TrainMarker key={vehicle.id} vehicle={vehicle} />
      ))}
    </MapContainer>
  );
};
